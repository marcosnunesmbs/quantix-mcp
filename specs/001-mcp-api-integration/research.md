# Research & Decisions: MCP API Integration

**Feature**: [spec.md](./spec.md)
**Status**: Complete

## Unknowns & Clarifications

### 1. Project Structure for Scaling Tools
**Question**: How to manage 12+ tools without bloating `index.ts`?
**Context**: Current `index.ts` has tool definition inline.
**Finding**: The MCP SDK `server.registerTool` can be called from imported modules if we pass the `mcpServer` instance, or better yet, we can export `Tool` definitions (name, description, schema, handler) and register them in a loop.
**Decision**:
- Create a `registerTools(server: McpServer)` function in each tool module (e.g., `src/tools/categories.ts`).
- `src/index.ts` will import these registration functions and call them.

### 2. Mocking `fetch` for Tests
**Question**: Best way to test without hitting real API?
**Context**: We generally want unit tests to be fast and isolated.
**Finding**: Since we are using native `fetch` (Node 18+), we can use `vitest` to spy on `global.fetch` or use a library like `msw` (Mock Service Worker). Given the simplicity, basic `vi.spyOn(global, 'fetch')` is sufficient.
**Decision**: Use `vitest` and spy on `global.fetch`.

## Technology Choices

| Area | Choice | Rationale |
|------|--------|-----------|
| **Validation** | `zod` | Native support in MCP SDK, TypeScript native, easy to derive from OpenAPI. |
| **HTTP Client** | Native `fetch` | No extra dependency weight, fully supported in modern Node. |
| **Testing** | `vitest` | Fast, compatible with ESM (Type "module" in package.json), Jest-compatible API. |
| **Env Vars** | `process.env` | Simple standard. |

## Design Patterns

### API Client Wrapper
Instead of calling `fetch` in every tool, we will create `src/services/apiClient.ts`:
```typescript
async function apiFetch<T>(endpoint: string, options: RequestInit): Promise<T> {
  const url = `${process.env.QUANTIX_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'API-KEY': process.env.QUANTIX_API_KEY
    }
  });
  // Error handling logic here
  return response.json();
}
```

### Zod Schema Reusability
We will define Zod schemas in `src/types/schemas.ts` that mirror the OpenAPI `components/schemas`. Use `z.infer` to generate TypeScript types for compile-time safety.

## Alternatives Considered

- **OpenAPI Code Generator**: Could auto-generate the client.
  - *Rejected*: Too heavy for 12 endpoints, harder to customize for MCP specific return formats.
- **Axios**:
  - *Rejected*: `fetch` is built-in.
