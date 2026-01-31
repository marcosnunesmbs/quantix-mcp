# Tasks: MCP Server for Quantix API Integration

**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)
**Status**: In Progress

## Phase 1: Setup
*Goal: Initialize project structure and dependencies*

- [x] T001 [P] Install Vitest and testing dependencies in `package.json`
- [x] T002 [P] Create project directory structure (`src/tools`, `src/services`, `src/types`, `tests`)
- [x] T003 Implement `src/config.ts` for environment variable management
- [x] T004 [P] Configure Vitest in `vitest.config.ts` (or script in package.json)

## Phase 2: Foundational & Shared Components
*Goal: Establish core API client and data schemas*

- [x] T005 [P] Implement `src/services/apiClient.ts` with authentication and typed `fetch`
- [x] T006 [P] Implement `src/types/schemas.ts` with Zod definitions for all entities (Category, Transaction, etc.)
- [x] T007 Create basic test setup/helpers in `tests/setup.ts`

## Phase 3: Server Configuration (User Story 1)
*Goal: Server starts with correct configuration and tool registration architecture*

- [x] T008 [US1] Refactor `src/index.ts` to use `src/config.ts` and support modular tool registration
- [x] T009 [US1] Create integration test `tests/server.test.ts` to verify server startup and env handling

## Phase 4: Categories Support (User Story 2)
*Goal: Enable management of financial categories*

- [x] T010 [US2] TDD: Implement `src/tools/categories.ts` (write tests in `tests/tools/categories.test.ts` first)
- [x] T011 [US2] Register category tools in `src/index.ts`

## Phase 5: Credit Cards Support (User Story 3)
*Goal: Enable management of credit cards and statements*

- [x] T012 [US3] TDD: Implement `src/tools/credit-cards.ts` (write tests in `tests/tools/credit-cards.test.ts` first)
- [x] T013 [US3] Register credit card tools in `src/index.ts`

## Phase 6: Transactions & Summary Support (User Story 4)
*Goal: Enable transaction recording and financial summaries*

- [x] T014 [US4] TDD: Implement `src/tools/transactions.ts` (write tests in `tests/tools/transactions.test.ts` first)
- [x] T015 [US4] TDD: Implement `src/tools/summary.ts` (write tests in `tests/tools/summary.test.ts` first)
- [x] T016 [US4] Register transaction and summary tools in `src/index.ts`

## Phase 7: Polish & Documentation
*Goal: Final verification and cleanup*

- [x] T017 Remove legacy `get_crypto_price` example from `src/index.ts`
- [x] T018 Verify `quickstart.md` instructions against the running server
- [x] T019 Run full test suite and ensure all tests pass
- [x] T020 Benchmark tool overhead to verify <20ms latency goal

## Dependencies

- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2 (config & client)
- Phase 4, 5, 6 depend on Phase 3 (server setup) and Phase 2 (schemas/client)
- Phases 4, 5, 6 can be executed in parallel (independent modules), but registered sequentially in T0XX tasks if strictly following order.

## Implementation Strategy
- **MVP**: Complete through Phase 3 + Phase 4 (Categories) to prove the pattern.
- **Incremental**: Add Credit Cards and Transactions as separate modules.
