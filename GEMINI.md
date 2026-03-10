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
