
# Quantix Personal Finance MCP Server

MCP (Model Context Protocol) server for the Quantix Personal Finance API. Exposes all endpoints as MCP tools with full input validation and modular architecture.

## Features

- **Accounts**: Manage bank accounts, wallets, savings, and investments.
- **Categories**: Create, list, update, and delete financial categories (INCOME/EXPENSE).
- **Credit Cards**: Manage cards, view/pay statements, and track statement status.
- **Transactions**: Full CRUD with filters (month, date range, account, category, card, type, paid status), recurring payments, and installment handling.
- **Transactions (paid status)**: Mark transactions as paid or unpaid.
- **Settings**: Manage global user preferences (name, currency, language).
- **Summary**: Financial summary by month or custom date range — income, expenses, balance, credit card totals, and category breakdowns.
- **Data**: Export and import a full backup of all user data.

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

```bash
npm run build
```

The compiled output will be in the `dist` directory.

## Usage

### Quick Start (npx)

```bash
npx quantix-mcp
```

Make sure the environment variables (`QUANTIX_API_URL`, `QUANTIX_API_KEY`) are set in your environment.

### Development

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
| | `get_accounts` | List all accounts with current balances |
| | `get_account` | Get details of a specific account |
| | `update_account` | Update account name or type |
| | `delete_account` | Delete an account |
| | `get_account_balance` | Get current balance for an account |
| | `get_account_transactions` | List all transactions linked to an account |
| **Categories** | `create_category` | Create a new financial category (INCOME/EXPENSE) |
| | `get_categories` | List all categories |
| | `get_category` | Get a category by ID |
| | `update_category` | Update category name or color |
| | `delete_category` | Delete a category |
| **Credit Cards** | `create_credit_card` | Create a new credit card |
| | `get_credit_cards` | List all credit cards |
| | `get_credit_card` | Get a credit card by ID |
| | `update_credit_card` | Update credit card details |
| | `delete_credit_card` | Delete a credit card |
| | `get_statement` | Get statement for a specific month (`YYYY-MM`) |
| | `get_statement_status` | Get payment status of a statement |
| | `pay_statement` | Mark all statement transactions as paid |
| **Transactions** | `create_transaction` | Record a new income or expense |
| | `get_transactions` | List transactions — filters: `month`, `startDate`, `endDate`, `accountId`, `categoryId`, `creditCardId`, `type`, `paid` |
| | `get_transaction` | Get transaction details by ID |
| | `update_transaction` | Update a transaction (supports `mode`: SINGLE / PENDING / ALL for recurring/installments) |
| | `pay_transaction` | Mark a transaction as paid/received |
| | `unpay_transaction` | Mark a transaction as unpaid |
| | `delete_transaction` | Delete a transaction (supports `mode`: SINGLE / PENDING / ALL) |
| **Settings** | `create_settings` | Create global user settings (only if not yet created) |
| | `get_settings` | Get global settings |
| | `update_settings` | Update global settings |
| **Summary** | `get_summary` | Financial summary — provide `month` (YYYY-MM) **or** `startDate` + `endDate` (YYYY-MM-DD) |
| **Data** | `export_data` | Export all user data as a complete backup |
| | `import_data` | Import a backup (`mode`: `reset` clears all data first, `increment` skips existing IDs) |

See `openapi.yaml` at the project root for full endpoint and schema details.

## Setup with Claude Desktop

1. Locate your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the server configuration:

   **Using npx (Recommended):**

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

```bash
npm test
```

## License

ISC
