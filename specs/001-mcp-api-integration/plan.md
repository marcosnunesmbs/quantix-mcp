# Implementation Plan: MCP Server for Quantix API Integration

**Branch**: `001-mcp-api-integration` | **Date**: 2026-01-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-mcp-api-integration/spec.md`

## Summary

Implement 12 MCP tools to expose the Quantix Personal Finance Manager API capabilities (Categories, Credit Cards, Transactions, Summaries).
The solution will extend the existing Express-based MCP server in `src/index.ts`, adding Zod validation for all inputs and handling API authentication via `QUANTIX_API_KEY`.

## Technical Context

**Language/Version**: TypeScript 5.9 (Node.js)
**Primary Dependencies**: `@modelcontextprotocol/sdk`, `express`, `zod`, `fetch` (native Node 18+)
**Storage**: N/A (Stateless proxy to external API)
**Testing**: Vitest (Proposed, currently missing in `package.json`)
**Target Platform**: MCP Clients (e.g., Claude Desktop) connecting via SSE/HTTP
**Project Type**: Backend / API Proxy
**Performance Goals**: Low latency proxy (adding <20ms overhead)
**Constraints**: Must match OpenAPI 3.0 schema strictly for tools.
**Scale/Scope**: 12 Tools, ~5-6 Service modules.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   **Principle 1 (Library-First)**: We will organize tools into modules (`src/tools/`) rather than a monolithic `index.ts`.
*   **Principle 3 (Test-First)**: We need to introduce a testing framework (`vitest`) as none exists.
*   **Principle 4 (Integration Testing)**: We will create tests that mock the external API to verify tool behavior.

**Governance**: The `constitution.md` appears to be a template. Proceeding with standard best practices.

## Project Structure

### Documentation (this feature)

```text
specs/001-mcp-api-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (Copy of openapi.yaml)
```

### Source Code (repository root)

```text
src/
├── index.ts                # Entry point (server setup)
├── config.ts               # Env var loading
├── tools/                  # New directory for tool definitions
│   ├── categories.ts       # Category tools
│   ├── credit-cards.ts     # Credit Card tools
│   ├── transactions.ts     # Transaction tools
│   └── summary.ts          # Summary tools
├── services/               # New directory for API client
│   └── apiClient.ts        # Typed fetch wrapper for Quantix API
└── types/                  # Shared types / Zod schemas
    └── schemas.ts          # Zod schemas matching OpenAPI

tests/                      # New directory
├── tools/
│   └── transactions.test.ts
└── services/
    └── apiClient.test.ts
```

**Structure Decision**: Modular approach separating Tool Registration (UI layer) from API Logic (Service layer) and Schemas (Model layer).

## Complexity Tracking

N/A
