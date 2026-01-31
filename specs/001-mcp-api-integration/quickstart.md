# Quickstart: Quantix MCP Server

This guide explains how to configure and run the Quantix MCP server integration.

## Prerequisites

- Node.js 18+
- A running instance of the Quantix API (or access to Staging/Prod)
- An API Key for Quantix

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Set the following environment variables. You can add them to a `.env` file or export them in your shell.

| Variable | Description | Example |
|----------|-------------|---------|
| `QUANTIX_API_URL` | Base URL of the Quantix API | `https://api.quantix.example.com` |
| `QUANTIX_API_KEY` | Your authentication key | `sk_live_12345` |
| `MPC_PORT` | Port for the MCP server | `3001` (default) |

## Running the Server

### Development Mode
```bash
# Windows (PowerShell)
$env:QUANTIX_API_URL="https://api.quantix.example.com"; $env:QUANTIX_API_KEY="test"; npm run dev

# Linux/Mac
QUANTIX_API_URL=https://api.quantix.example.com QUANTIX_API_KEY=test npm run dev
```

### Production
```bash
node dist/index.js
```

## Using with Claude Desktop

Add the server config to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "quantix": {
      "command": "node",
      "args": ["path/to/morpheus-mcp/dist/index.js"],
      "env": {
        "QUANTIX_API_URL": "...",
        "QUANTIX_API_KEY": "..."
      }
    }
  }
}
```

## Verification

To verify the integration, use the MCP Inspector or curl the running server (since it's HTTP/SSE based):

```bash
curl http://localhost:3001/mcp
```
