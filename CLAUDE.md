# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build       # Compile TypeScript → dist/
npm run dev         # Run with tsx (no build required)
npm start           # Run compiled dist/index.js
npm test            # Run all tests with vitest
```

Run a single test file:
```bash
npx vitest run tests/tools/categories.test.ts
```

Inspect the MCP server interactively (requires a build first):
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Environment

Create `.env` in the project root:
```
QUANTIX_API_URL=https://api.quantix.example.com
QUANTIX_API_KEY=your_api_key_here
MCPPORT=3001
```

`QUANTIX_API_KEY` is required. `QUANTIX_API_URL` defaults to `https://api.quantix.example.com`.

## Architecture

This is an MCP server that proxies Quantix Personal Finance API endpoints as MCP tools. It runs in **stdio mode** (for Claude Desktop / `npx quantix-mcp`).

**Data flow:** MCP client → `src/index.ts` (McpServer + StdioTransport) → tool handler → `src/services/apiClient.ts` → Quantix REST API

### Key files

| File | Role |
|------|------|
| `src/index.ts` | Creates `McpServer`, registers all tool groups, connects via `StdioServerTransport` |
| `src/config.ts` | Zod-validated env vars; exports `config` object |
| `src/services/apiClient.ts` | Thin `fetch` wrapper; injects `x-api-key` header; exports `apiClient.get/post/patch/put/delete` |
| `src/types/schemas.ts` | All Zod schemas — both domain entity schemas and tool input schemas |
| `src/tools/*.ts` | Each file exports a `register*Tools(server: McpServer)` function |
| `tests/setup.ts` | Vitest setup — mocks `global.fetch` and mocks `config` module |

### Adding a new tool group

1. Create `src/tools/mymodule.ts` exporting `registerMyModuleTools(server: McpServer)`.
2. Define input schemas in `src/types/schemas.ts`.
3. Import and call `registerMyModuleTools(mcpServer)` in `src/index.ts`.
4. Add a test file at `tests/tools/mymodule.test.ts` — mock `apiClient` (not `fetch`), create a mock server to capture registered handlers, then call handlers directly.

### Conventions

- All imports use `.js` extension (ESM `nodenext` module resolution), even for `.ts` source files.
- Tool handlers return `{ content: [{ type: 'text', text: '...' }] }`.
- The `mode` query param (`SINGLE` | `PENDING` | `ALL`) on transaction update/delete controls scope for recurring transactions.
- `ApiClientError` (from `apiClient.ts`) is thrown on non-2xx responses and includes `status` and `statusText`.
