
# Quantix Personal Finance MCP Server

MCP (Model Context Protocol) server for the Quantix Personal Finance API. Exposes all endpoints for categories, credit cards, transactions, and summaries as MCP tools, with full input validation and modular architecture.

## Features

- **Accounts**: Manage bank accounts, wallets, and investments.
- **Categories**: Create, list, update, and delete financial categories.
- **Credit Cards**: Manage cards, view/pay statements, and track statement status.
- **Transactions**: Full CRUD for transactions including recurring payments and installment handling.
- **Details**: Mark transactions as paid/unpaid.
- **Settings**: Manage global user preferences (currency, language, etc.).
- **Summary**: Get monthly financial summaries.

All tool inputs are validated using [Zod](https://zod.dev/) schemas matching the OpenAPI spec.

## Prerequisites

- Node.js (v18 or higher)
- npm
- Access to Quantix API and API Key

## Installation

1. Clone or navigate to the project repository.
2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the project root:

```env
QUANTIX_API_URL=https://api.quantix.example.com
QUANTIX_API_KEY=your_api_key_here
MCPPORT=3001
```

## Building the Project

Compile the TypeScript code to JavaScript:

```bash
npm run build
```

The compiled output will be in the `dist` directory.

## Usage

### Quick Start (npx)

To run the server directly from npm:

```bash
npx quantix-mcp
```

Make sure the environment variables (`QUANTIX_API_URL`, `QUANTIX_API_KEY`) are set in your environment.

### Development

Run the server in development mode (with hot reload):

```bash
npm run dev
```

### Production

```bash
npm start
```

### MCP Inspector (Recommended for Testing)

1. Build the project:
   ```bash
   npm run build
   ```
2. Run the inspector:
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```
3. Open the provided URL to interact with your server.

## Exposed MCP Tools

| Category | Tool Name | Description |
|----------|-----------|-------------|
| **Accounts** | `create_account` | Create a new financial account |
| | `get_accounts` | List all accounts with balances |
| | `get_account` | Get details of a specific account |
| | `update_account` | Update an existing account |
| | `delete_account` | Delete an account |
| | `get_account_balance` | Get current balance for an account |
| | `get_account_transactions` | Get transactions linked to an account |
| **Categories** | `create_category` | Create a new financial category |
| | `get_categories` | List all categories |
| | `get_category` | Get a category by ID |
| | `update_category` | Update a category |
| | `delete_category` | Delete a category |
| **Credit Cards** | `create_credit_card` | Create a new credit card |
| | `get_credit_cards` | List all credit cards |
| | `get_credit_card` | Get a credit card by ID |
| | `update_credit_card` | Update a credit card |
| | `delete_credit_card` | Delete a credit card |
| | `get_statement` | Get statement for a specific month |
| | `get_statement_status` | Get payment status of a statement |
| | `pay_statement` | Mark statement transactions as paid |
| **Transactions** | `create_transaction` | Record a new transaction |
| | `get_transactions` | List transactions (optional month filter) |
| | `get_transaction` | Get transaction details |
| | `update_transaction` | Update transaction (supports recurring) |
| | `pay_transaction` | Mark transaction as paid |
| | `unpay_transaction` | Mark transaction as unpaid |
| | `delete_transaction` | Delete transaction (supports recurring) |
| **Settings** | `create_settings` | Create global user settings |
| | `get_settings` | Get global settings |
| | `update_settings` | Update global settings |
| **Summary** | `get_summary` | Get monthly financial summary |

See the OpenAPI spec in `specs/001-mcp-api-integration/contracts/openapi.yaml` for detailed schemas.

## Setup with Claude Desktop

1. Locate your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the server configuration:

   **Using npx (Recommended for users):**

   ```json
   {
     "mcpServers": {
       "quantix": {
         "command": "npx",
         "args": ["-y", "quantix-mcp"],
         "env": {
           "QUANTIX_API_URL": "https://api.quantix.example.com",
           "QUANTIX_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

   **Using local build (For developers):**

   ```json
   {
     "mcpServers": {
       "quantix": {
         "command": "node",
         "args": ["/absolute/path/to/dist/index.js"],
         "env": {
           "QUANTIX_API_URL": "https://api.quantix.example.com",
           "QUANTIX_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

## Testing

Run all tests:

```bash
npm test
```

## License

ISC
