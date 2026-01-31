<!--
SYNC IMPACT REPORT
Version Change: 0.0.0 (New) -> 1.0.0
Modified Principles: All (Initial Definition)
Added Sections: All
Removed Sections: None
Templates Requiring Updates: ✅ None (Templates are generic enough)
Follow-up:
- Verify ratification date is acceptable as today.
-->
# Morpheus MCP Constitution

## Core Principles

### I. Library-First
Every feature or tool set should be implemented as a standalone module or library within the `src/tools/` or `src/lib/` structure. Avoid monolithic `index.ts` files. Modules must be self-contained, independently testable, and have a single clear responsibility.

### II. Standard Interface
All tools must expose functionality via the Model Context Protocol (MCP) standard. Inputs must be strictly defined using Zod schemas to ensure type safety and validation at the boundary.

### III. Test-First (NON-NEGOTIABLE)
Test-Driven Development (TDD) is mandatory for core logic. Write tests that define the expected behavior before implementing the functionality. Ensure a Red-Green-Refactor cycle.

### IV. Integration Testing
Given the nature of MCP servers as API proxies, integration tests are critical. Usage of mocking frameworks to simulate external API responses is required to verify contract adherence without flakiness from external services.

### V. Simplicity & Robustness
Keep code simple and readable. Avoid over-engineering. Handle errors gracefully and provide meaningful error messages to the LLM/Client. Strict typing is required throughout to prevent runtime surprises.

## Security & Compliance

### Authentication Management
API keys and secrets must never be hardcoded. They must be loaded from environment variables (e.g., `QUANTIX_API_KEY`). The server should validate the presence of required configuration at startup.

### Data Privacy
Do not log sensitive user data or full API keys. Logs should be structured and sanitized.

## Development Workflow

### Code Review Gates
All Pull Requests must pass the automated build and test suite. Code reviews should verify adherence to the Library-First and Test-First principles.

### Documentation
Every tool must have a clear description and argument documentation suitable for LLM consumption. `README.md` must be kept up-to-date with usage instructions.

## Governance

This constitution serves as the primary source of truth for engineering practices within the Morpheus MCP project.

### Amendments
Any changes to this constitution must be made via a Pull Request to `.specify/memory/constitution.md`.
*   Major changes (altering core principles) require a Consensus Review.
*   Minor changes (clarifications, new sections) require standard Maintainer Review.

### Compliance
All new feature plans (Phase 0/1) must include a "Constitution Check" to verify alignment with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-01-31 | **Last Amended**: 2026-01-31
