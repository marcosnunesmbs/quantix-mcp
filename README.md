# CoinGecko Price MCP Server

A simple Model Context Protocol (MCP) server that provides cryptocurrency pricing information using the CoinGecko API.

## Features

- **get_crypto_price**: A tool to fetch the current price of a cryptocurrency in a specific currency.
  - Inputs:
    - `crypto_id`: The CoinGecko ID of the cryptocurrency (e.g., 'bitcoin', 'ethereum').
    - `currency`: The target currency for the price (e.g., 'usd', 'brl').

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1. Clone or navigate to the project repository.
2. Install dependencies:

   ```bash
   npm install
   ```

## Building the Project

Compile the TypeScript code to JavaScript:

```bash
npm run build
```

The compiled output will be in the `dist` directory.

## Usage

### Testing Locally with MCP Inspector (The `npx` Way)

You can test the server interactively using the MCP Inspector. This allows you to inspect tools and resources and make tool calls directly.

1. Build the project first:
   ```bash
   npm run build
   ```

2. Run the inspector using `npx`, pointing it to your built server script:

   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

   _Note: On Windows, use a full path or ensuring valid path syntax if you encounter issues._

3. Open the URL provided in the terminal (usually `http://localhost:5173`) to interact with your server.

### Running Directly

You can run the server directly (it communicates via Stdio), but it is designed to be used by an MCP client (like Claude Desktop or the Inspector).

```bash
npm start
```

### Developing

To run the server in development mode (using `tsx`):

```bash
npm run dev
```

## Setup with Claude Desktop

To use this server with Claude Desktop apps:

1. Locate your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the server configuration:

   ```json
   {
     "mcpServers": {
       "coingecko_price": {
         "command": "node",
         "args": ["/absolute/path/to/mcp_coingecko_price_ts/dist/index.js"]
       }
     }
   }
   ```
   *Remember to run `npm run build` after making changes to the source code.*

3. You can run this mcp with stdio transport using npx command

    ```json
    {
     "mcpServers": {
       "coingecko_price": {
         "command": "npx",
         "args": ["-y", "mcp_coingecko_price_ts"]
       }
     }
   }
    ```
