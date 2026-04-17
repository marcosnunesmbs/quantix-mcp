#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import express, { type Request, type Response } from 'express';
import { config } from './config.js';
import { requestContext } from './services/requestContext.js';
import { registerCategoryTools } from './tools/categories.js';
import { registerCreditCardTools } from './tools/credit-cards.js';
import { registerTransactionTools } from './tools/transactions.js';
import { registerSummaryTools } from './tools/summary.js';
import { registerAccountTools } from './tools/accounts.js';
import { registerSettingsTools } from './tools/settings.js';
import { registerTransferTools } from './tools/transfers.js';
import { registerDataTools } from './tools/data.js';
import { registerSubscriptionTools } from './tools/subscriptions.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

export function getServer() {
    const mcpServer = new McpServer({
        name: 'quantix_mcp_server',
        version: pkg.version,
        description: 'MCP server for Quantix personal finance management',
    });

    console.error('Quantix MCP server started');

    // Register Tools here
    registerCategoryTools(mcpServer);
    registerCreditCardTools(mcpServer);
    registerTransactionTools(mcpServer);
    registerSummaryTools(mcpServer);
    registerAccountTools(mcpServer);
    registerSettingsTools(mcpServer);

    registerTransferTools(mcpServer);
    registerDataTools(mcpServer);
    registerSubscriptionTools(mcpServer);

    return mcpServer;
}

async function startStdio() {
    const transport = new StdioServerTransport();
    const mcpServer = getServer();
    await mcpServer.connect(transport);
    console.error('Quantix MCP server running in stdio mode');
}

async function startHttp() {
    const app = express();
    app.use(express.json());

    const port = parseInt(config.MCPPORT, 10);

    const extractApiKey = (req: Request): string | undefined => {
        const authHeader = req.headers['authorization'];
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7);
        }
        const apiKeyHeader = req.headers['x-api-key'] ?? req.headers['api-key'];
        if (typeof apiKeyHeader === 'string') {
            return apiKeyHeader;
        }
        return undefined;
    };

    const mcpHandler = async (req: Request, res: Response) => {
        const apiKey = extractApiKey(req);
        if (!apiKey) {
            res.status(401).json({ error: 'Missing authentication. Use Authorization: Bearer <key>, x-api-key, or api-key header.' });
            return;
        }

        await requestContext.run({ apiKey }, async () => {
            const transport = new StreamableHTTPServerTransport({});
            const mcpServer = getServer();
            // Cast needed: exactOptionalPropertyTypes causes onclose incompatibility with Transport interface
            await mcpServer.connect(transport as never);
            await transport.handleRequest(req, res, req.body);
        });
    };

    // Handle GET (SSE stream), POST (JSON-RPC) and DELETE (session termination)
    app.get('/mcp', mcpHandler);
    app.post('/mcp', mcpHandler);
    app.delete('/mcp', mcpHandler);

    app.get('/health', (_req: Request, res: Response) => {
        res.json({ status: 'ok', transport: 'http' });
    });

    app.listen(port, () => {
        console.error(`Quantix MCP server running in HTTP mode on port ${port}`);
        console.error(`Endpoint: http://0.0.0.0:${port}/mcp`);
    });
}

async function main() {
    if (config.TRANSPORT === 'http') {
        await startHttp();
    } else {
        await startStdio();
    }
}

main().catch(error => {
    console.error('Server error:', error);
    process.exit(1);
});
