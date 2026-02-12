
# Quantix Personal Finance MCP Server

MCP (Model Context Protocol) server for the Quantix Personal Finance API. Exposes all endpoints for categories, credit cards, transactions, and summaries as MCP tools, with full input validation and modular architecture.

## Features

- **Categories**: Create, list, and delete financial categories
- **Credit Cards**: Create, list, get statements, and pay statements
- **Transactions**: Create, list, pay, and delete transactions
- **Summary**: Get monthly financial summary

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

| Tool Name           | Description                                      |
|---------------------|--------------------------------------------------|
| create_category     | Create a new financial category                  |
| get_categories      | List all categories                              |
| delete_category     | Delete a category by ID                          |
| create_credit_card  | Create a new credit card                         |
| get_credit_cards    | List all credit cards                            |
| get_statement       | Get credit card statement for a specific month   |
| pay_statement       | Mark all transactions in a statement as paid     |
| create_transaction  | Record a new income or expense                   |
| get_transactions    | List transactions for a specific month           |
| pay_transaction     | Mark a transaction as paid/received              |
| delete_transaction  | Delete a transaction by ID                       |
| get_summary         | Get monthly financial summary                    |

See the OpenAPI spec in `specs/001-mcp-api-integration/contracts/openapi.yaml` for detailed schemas.

## Setup with Claude Desktop

1. Locate your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the server configuration:

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

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1. Clone or navigate to the project repository.
