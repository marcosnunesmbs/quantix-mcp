# Feature Specification: MCP Server for Quantix API Integration

**Feature Branch**: `001-mcp-api-integration`
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: "Vamos criar um servidor MCP para acessar todas essa rotas da nossa api, coloque o endereço da url como padrão vindo de env e api-key necessária também, use o zod para padronizar e especificar os inputs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure and Start MCP Server (Priority: P1)

As a developer or AI agent, I want to configure the MCP server with the API URL and API Key so that I can securely access the financial data.

**Why this priority**: Essential for the server to function and authenticate.

**Independent Test**:
1. Set `QUANTIX_API_URL` and `QUANTIX_API_KEY` environment variables.
2. Start the server.
3. Verify that the server starts without errors and is ready to accept requests.

**Acceptance Scenarios**:

1. **Given** valid environment variables, **When** the server starts, **Then** it initializes successfully.
2. **Given** missing API Key, **When** the server starts, **Then** it might warn or fail calls (depending on implementation), but tools should be registered.

---

### User Story 2 - Manage Financial Categories (Priority: P2)

As a user, I want to create, list, and delete categories to organize my finances.

**Why this priority**: Categories are foundational for transactions.

**Independent Test**: Use an MCP client to call category tools.

**Acceptance Scenarios**:

1. **Given** the MCP server is running, **When** I call `get_categories`, **Then** I receive a list of categories.
2. **Given** a new category name and type, **When** I call `create_category`, **Then** the category is created via the API.
3. **Given** a category ID, **When** I call `delete_category`, **Then** the category is removed.

---

### User Story 3 - Manage Credit Cards and Statements (Priority: P2)

As a user, I want to manage credit cards and view/pay statements.

**Why this priority**: Credit card management is a core feature of the API.

**Independent Test**: Call credit card related tools.

**Acceptance Scenarios**:

1. **Given** card details, **When** I call `create_credit_card`, **Then** a new card is added.
2. **Given** a card ID and month, **When** I call `get_statement`, **Then** I see the transactions for that period.
3. **Given** a card ID and month, **When** I call `pay_statement`, **Then** the transactions are marked as paid.

---

### User Story 4 - Manage Transactions and Summaries (Priority: P2)

As a user, I want to record transactions and view my monthly financial summary.

**Why this priority**: Core value of a finance manager.

**Independent Test**: Call transaction and summary tools.

**Acceptance Scenarios**:

1. **Given** transaction details, **When** I call `create_transaction`, **Then** it is recorded.
2. **Given** a month, **When** I call `get_transactions`, **Then** I see the list of transactions.
3. **Given** a month, **When** I call `get_summary`, **Then** I see income, expenses, and balance.
4. **Given** a transaction ID, **When** I call `pay_transaction`, **Then** it is marked as paid.

## Functional Requirements

1. **Environment Configuration**:
   - Support `QUANTIX_API_URL` (defaulting to `https://api.quantix.example.com` or requiring it).
   - Support `QUANTIX_API_KEY` for authentication header `API-KEY`.

2. **Tool Registration**:
   - Register the following tools in the MCP server:
     - `create_category`
     - `get_categories`
     - `delete_category`
     - `create_credit_card`
     - `get_credit_cards`
     - `get_statement`
     - `pay_statement`
     - `create_transaction`
     - `get_transactions`
     - `pay_transaction`
     - `delete_transaction`
     - `get_summary`

3. **Input Validation**:
   - Use `zod` to define input schemas for all tools.
   - Schemas must match the OpenApi 3.0 definitions provided in `openapi.yaml`.

4. **API Integration**:
   - Make HTTP requests to the configured `QUANTIX_API_URL`.
   - Forward the API Key in headers.
   - Return clear output messages based on API responses.

## Success Criteria

1. **measurable**: 100% of the 12 identified API endpoints are exposed as MCP tools.
2. **measurable**: Inputs for all tools are validated using Zod schemas.
3. **verifiable**: The server connects to the backend using the environment variables.
4. **verifiable**: Tools return meaningful success/error messages to the model.

## Assumptions

- The `openapi.yaml` is the source of truth for schemas.
- The existing project structure with `src/index.ts` determines the server setup (Express + MCP SDK).

## Clarifications

- None at this stage.
