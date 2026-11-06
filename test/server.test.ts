import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { AsinClient, type AsinFetch } from "@asindev/sdk";

import { CATALOG, MODE } from "../src/catalog.js";
import { createHttpHandler } from "../src/http.js";
import { createAsinMcpServer } from "../src/server.js";

type Call = { url: URL; init: RequestInit };

async function connect(
  respond: () => Response = () => Response.json({ hello: "world" }),
) {
  const calls: Call[] = [];
  const fetch: AsinFetch = async (input, init) => {
    calls.push({ url: new URL(String(input)), init });
    return respond();
  };
  const sdk = new AsinClient({ apiKey: "secret-test-key", fetch });
  const server = createAsinMcpServer({
    client: sdk,
    sensitiveValues: ["secret-test-key"],
  });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
  return { client, calls };
}

function text(result: Awaited<ReturnType<Client["callTool"]>>): string {
  const content = result.content as { type: string; text?: string }[];
  return content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");
}

describe("asin-mcp", () => {
  it("lists its tools", async () => {
    const { client } = await connect();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    if (MODE === "tools") {
      assert.equal(tools.length, CATALOG.length);
      assert.ok(names.includes("search_amazon"));
    } else {
      assert.ok(
        ["search_endpoints", "get_endpoint", "call_endpoint"].every((n) =>
          names.includes(n),
        ),
      );
    }
    for (const tool of tools) {
      const method = CATALOG.find((e) => e.name === tool.name)?.methods[0];
      assert.equal(tool.annotations?.readOnlyHint, method === "GET", tool.name);
      assert.equal(
        tool.annotations?.destructiveHint,
        method === "DELETE",
        tool.name,
      );
    }
  });

  it("calls the featured endpoint", async () => {
    const { client, calls } = await connect();
    const result =
      MODE === "tools"
        ? await client.callTool({
            name: "search_amazon",
            arguments: { query: "wireless earbuds" },
          })
        : await client.callTool({
            name: "call_endpoint",
            arguments: {
              name: "search_amazon",
              params: { query: "wireless earbuds" },
            },
          });
    assert.equal(result.isError, undefined);
    assert.deepEqual(JSON.parse(text(result)), { hello: "world" });
    assert.equal(calls[0]!.url.pathname, "/api/v1/search");
    assert.equal(
      new Headers(calls[0]!.init.headers).get("authorization"),
      "Bearer secret-test-key",
    );
  });

  it("returns images inline", async () => {
    const { client } = await connect(
      () =>
        new Response(new Uint8Array([137, 80, 78, 71]), {
          headers: { "content-type": "image/png" },
        }),
    );
    const result =
      MODE === "tools"
        ? await client.callTool({ name: "get_account", arguments: {} })
        : await client.callTool({
            name: "call_endpoint",
            arguments: { name: "get_account", params: {} },
          });
    const content = result.content as {
      type: string;
      mimeType?: string;
      data?: string;
    }[];
    assert.equal(content[0]!.type, "image");
    assert.equal(content[0]!.mimeType, "image/png");
    assert.equal(
      content[0]!.data,
      Buffer.from([137, 80, 78, 71]).toString("base64"),
    );
  });

  it("reports API errors without leaking the key", async () => {
    const { client } = await connect(() =>
      Response.json(
        { error: "Invalid API Key secret-test-key" },
        { status: 401 },
      ),
    );
    const result =
      MODE === "tools"
        ? await client.callTool({
            name: "search_amazon",
            arguments: { query: "wireless earbuds" },
          })
        : await client.callTool({
            name: "call_endpoint",
            arguments: {
              name: "search_amazon",
              params: { query: "wireless earbuds" },
            },
          });
    assert.equal(result.isError, true);
    assert.match(text(result), /401/);
    assert.doesNotMatch(text(result), /secret-test-key/);
  });

  it("validates arguments", async () => {
    const { client, calls } = await connect();
    const result =
      MODE === "tools"
        ? await client.callTool({ name: "search_amazon", arguments: {} })
        : await client.callTool({
            name: "call_endpoint",
            arguments: { name: "search_amazon", params: { not_a_param: 1 } },
          });
    assert.equal(result.isError, true);
    assert.equal(calls.length, 0);
  });

  it("serves Streamable HTTP with a per-request API key", async () => {
    const calls: Call[] = [];
    const handler = createHttpHandler({
      clientFactory: (options) =>
        new AsinClient({
          ...options,
          fetch: async (input, init) => {
            calls.push({ url: new URL(String(input)), init });
            return Response.json({ ok: true });
          },
        }),
    });
    const post = (body: unknown, headers: Record<string, string> = {}) =>
      handler(
        new Request("http://localhost/mcp", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json, text/event-stream",
            ...headers,
          },
          body: JSON.stringify(body),
        }),
      );
    const list = { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} };
    assert.equal((await post(list)).status, 401);
    assert.equal(
      (await post(list, { "x-api-key": "k", origin: "https://evil.example" }))
        .status,
      403,
    );
    const response = await post(list, { "x-api-key": "header-key" });
    assert.equal(response.status, 200);
    const payload = (await response.json()) as { result: { tools: unknown[] } };
    assert.ok(payload.result.tools.length > 0);
    assert.equal(
      (await handler(new Request("http://localhost/health"))).status,
      200,
    );
  });
});
