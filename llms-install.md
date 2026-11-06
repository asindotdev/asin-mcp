# Installing the Asin MCP server

Instructions for AI agents installing this server for a user.

1. Check that Node.js 20 or newer is available (`node --version`).
2. Ask the user for their Asin API key. They can create one at https://www.asin.dev/signup and copy it from https://www.asin.dev/app.
   Never print the key back or commit it to a file in a repository.
3. Prefer the hosted server: add it with URL `https://www.asin.dev/api/mcp` and the header `Authorization: Bearer <key>`:

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

Or run it locally over stdio:

```json
{
  "mcpServers": {
    "asin": {
      "command": "npx",
      "args": ["-y", "@asindotdev/mcp"],
      "env": {
        "ASIN_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

4. Restart the client and check that the `check_product` tool is listed.

The server needs no other configuration. Each tool call that reaches the API consumes Asin credits.
