# Asin MCP Server

Official [Model Context Protocol](https://modelcontextprotocol.io) server for the [Asin](https://www.asin.dev) Amazon price tracking API.

Track Amazon prices and products with a scheduled watchlist, price history, offers and alerts.

It lets Claude, Cursor, VS Code, Windsurf and any MCP client call the API as tools. Runs over **stdio** (local) or **Streamable HTTP** (self-hosted).

## Requirements

- Node.js 20 or newer
- a Asin API key — [sign up](https://www.asin.dev/signup), then copy it from the [dashboard](https://www.asin.dev/app)

## Hosted server (recommended)

Asin runs this server for you at **`https://www.asin.dev/api/mcp`** (Streamable HTTP). Send your API key as a Bearer token in the `Authorization` header; nothing to install.

```sh
claude mcp add --transport http asin https://www.asin.dev/api/mcp --header "Authorization: Bearer YOUR_API_KEY"
```

```json
{
  "mcpServers": {
    "asin": {
      "url": "https://www.asin.dev/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

The hosted server and this package expose the same API; run the package locally when you want stdio, your own network egress, or to self-host it.

## Run it locally

### Claude Code

```sh
claude mcp add asin --env ASIN_API_KEY=YOUR_API_KEY -- npx -y @asindev/mcp
```

### Claude Desktop, Cursor, Windsurf and other clients

Add the server to the client's MCP configuration (`claude_desktop_config.json`, `.cursor/mcp.json`…):

```json
{
  "mcpServers": {
    "asin": {
      "command": "npx",
      "args": ["-y", "@asindev/mcp"],
      "env": {
        "ASIN_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### VS Code

```json
{
  "servers": {
    "asin": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@asindev/mcp"],
      "env": {
        "ASIN_API_KEY": "${input:asin-api-key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "asin-api-key",
      "description": "Asin API key",
      "password": true
    }
  ]
}
```

### Claude Desktop extension

Download the `.mcpb` bundle from the releases page and open it; Claude Desktop asks for your API key.

### Docker

```sh
docker build -t asin-mcp .
docker run -i --rm -e ASIN_API_KEY=YOUR_API_KEY asin-mcp
```

## Tools

| Tool               | Description                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check_product`    | Asks for a check right away (1 credit), at most once per 5 minutes; earlier calls return the product unchanged. A paused product has to be resumed first. The check runs in the background; with wait=t… |
| `delete_product`   | Removes the product and its price history.                                                                                                                                                               |
| `fetch_offers`     | Reads the offers on Amazon for 1 credit, refunded if it doesn't answer. A read made in the last 3 hours, by anyone, is returned instead, for free (charged: false). The answer is the same as GET /offe… |
| `get_account`      | Your plan, the credits left (monthly allowance and packs), how many products you track and the credits they use per month.                                                                               |
| `get_asin_history` | Every price Asin read for an ASIN on a marketplace over the period, whoever tracks it, oldest first, with the lowest, highest and average of those prices. A history of more than 5000 points is thinne… |
| `get_offers`       | Who sells the product and at what price, as last read, cheapest first, with Amazon's own price and the cheapest new and used offers (used is only known for Amazon's own outlet). Free: this never read… |
| `get_product`      | The product's latest state and every price read of the period, oldest first. The history covers every read of this ASIN on this marketplace, including those made before you added it, so a product add… |
| `list_products`    | Your watchlist, newest first, with each product's latest state and its recent prices (trend). Filter with asin (and marketplace) to know if a product is tracked, or with filter to get the same lists…  |
| `search_amazon`    | Amazon search results (up to 60, sponsored included), to find the ASIN of a product. Free, limited to 30 searches per hour.                                                                              |
| `track_product`    | Adds an ASIN, an Amazon link or a short link (amzn.to, a.co…) to your watchlist. The first check runs in the background within seconds (checking is true until then): poll GET /products/{id}, or send…  |
| `update_product`   | Target price, drop alerts, check interval, or pause. Send only what changes.                                                                                                                             |

Every tool that calls the API consumes credits. JSON results are returned as text; images are returned inline and other files (PDF…) as embedded resources, up to 4 MB.

## Streamable HTTP

```sh
npx @asindev/mcp --http --port 3000
```

The endpoint is `POST /mcp` (stateless, JSON responses). Each client sends its own key in the `x-api-key` header (or `Authorization: Bearer <key>`); the server never uses a key of its own. It binds to `127.0.0.1` by default and rejects browser origins unless you allow them — put it behind TLS before exposing it.

`createHttpHandler()` is exported for Fetch-compatible runtimes (Cloudflare Workers, Deno, Bun):

```ts
import { createHttpHandler } from "@asindev/mcp";

export default { fetch: createHttpHandler({ allowedOrigins: [] }) };
```

## Security

- The API key is read from `ASIN_API_KEY` (stdio) or the request headers (HTTP) and removed from error messages.
- Content fetched from websites is untrusted: the server instructions tell the model to treat it as data, not instructions.
- See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Development

```sh
npm install
npm test
npm run build
npx @modelcontextprotocol/inspector node dist/stdio.js
```

## Built on the SDK

The server uses the official [Node.js SDK](https://github.com/asindotdev/asin-node) (`@asindev/sdk`).

## License

MIT — see [LICENSE](LICENSE).
