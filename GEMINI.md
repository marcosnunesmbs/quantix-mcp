# Quantix MCP Server Context

This project is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides a bridge between AI models and the **Quantix Personal Finance API**. It allows AI assistants to manage accounts, transactions, categories, credit cards, and financial summaries.

## Project Overview

- **Purpose**: Expose Quantix API endpoints as MCP tools for personal finance management.
- **Authentication**: Uses **API Key authentication** (`x-api-key` header). Although the Quantix API supports JWT/Bearer tokens for web use, they expire every 15 minutes. For persistent MCP access, a long-lived API Key is required.
- **Architecture**: 
  - **Modular Tools**: Tools are categorized by domain (e.g., `accounts.ts`, `transactions.ts`) in `src/tools/`.
  - **Centralized API Client**: `src/services/apiClient.ts` handles communication with the Quantix API using a singleton `apiClient`.
  - **Schema Validation**: Extensive use of [Zod](https://zod.dev/) in `src/types/schemas.ts` to ensure input/output safety and provide descriptive metadata for the AI.
  - **Configuration**: Managed via `dotenv` and validated with Zod in `src/config.ts`.
- **Key Technologies**: TypeScript, Node.js, @modelcontextprotocol/sdk, Zod, Vitest.

## Building and Running

### Prerequisites
- Node.js (v18+)
- Valid `QUANTIX_API_URL` and `QUANTIX_API_KEY` in a `.env` file.

### Commands
- **Install Dependencies**: `npm install`
- **Build**: `npm run build` (Compiles TypeScript to `dist/`)
- **Development**: `npm run dev` (Runs directly from source using `tsx`)
- **Production**: `npm start` (Runs the compiled `dist/index.js`)
- **Test**: `npm test` (Runs the test suite using Vitest)
- **MCP Inspector**: `npx @modelcontextprotocol/inspector node dist/index.js` (Recommended for interactive tool testing)

## Development Conventions

### Adding New Tools
1. Define the input/output schemas in `src/types/schemas.ts`.
2. Create or update the relevant domain file in `src/tools/`.
3. Use the `registerTool` method on the `McpServer` instance.
4. Export a registration function (e.g., `registerNewDomainTools`) and call it in `src/index.ts`.

### Error Handling
- Use the `handleToolError` helper from `src/utils/toolHelpers.ts` to provide consistent error messages to the AI.
- The `apiClient` throws `ApiClientError` for non-2xx responses, which includes the status code and status text.

### Tool Guidelines
- **Descriptions**: Always provide clear, detailed descriptions for tools and their arguments in the Zod schemas (using `.describe()`). This helps the AI understand when and how to use the tool.
- **Idempotency**: Ensure that "Get" operations are read-only and mutations follow standard REST patterns.
- **Validation**: Rely on Zod for input validation. If a required field is missing, the MCP SDK will automatically inform the user/AI.

### Testing
- Place tests in the `tests/` directory.
- Use `tests/setup.ts` to mock the global `fetch` and the project `config`.
- Aim for high coverage of tool logic by mocking various API responses.

## Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `QUANTIX_API_URL` | Base URL for the Quantix API | `https://api.quantix.example.com` |
| `QUANTIX_API_KEY` | Your secret API Key | (Required) |
| `MCPPORT` | Port for HTTP transport (if used) | `3001` |
| `NODE_ENV` | Environment mode | `development` |

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any shell command containing `curl` or `wget` will be intercepted and blocked. Do NOT retry.
Instead use:
- `mcp__context-mode__ctx_fetch_and_index(url, source)` to fetch and index web pages
- `mcp__context-mode__ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any shell command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` will be intercepted and blocked. Do NOT retry with shell.
Instead use:
- `mcp__context-mode__ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch / web browsing — BLOCKED
Direct web fetching is blocked. Use the sandbox equivalent.
Instead use:
- `mcp__context-mode__ctx_fetch_and_index(url, source)` then `mcp__context-mode__ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Shell (>20 lines output)
Shell is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `mcp__context-mode__ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `mcp__context-mode__ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### read_file (for analysis)
If you are reading a file to **edit** it → read_file is correct (edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `mcp__context-mode__ctx_execute_file(path, language, code)` instead. Only your printed summary enters context.

### grep / search (large results)
Search results can flood context. Use `mcp__context-mode__ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `mcp__context-mode__ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `mcp__context-mode__ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `mcp__context-mode__ctx_execute(language, code)` | `mcp__context-mode__ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `mcp__context-mode__ctx_fetch_and_index(url, source)` then `mcp__context-mode__ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `mcp__context-mode__ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `upgrade` MCP tool, run the returned shell command, display as checklist |
