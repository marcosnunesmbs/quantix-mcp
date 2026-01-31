#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import express, { type Request, type Response } from 'express';
import { config } from './config.js';
import { z } from 'zod';
import { registerCategoryTools } from './tools/categories.js';
import { registerCreditCardTools } from './tools/credit-cards.js';
import { registerTransactionTools } from './tools/transactions.js';
import { registerSummaryTools } from './tools/summary.js';

export function getServer() {
    const mcpServer = new McpServer({
        name: 'quantix_mcp_server',
        version: '1.0.0'
    });

    console.log('McpServer started');

    // Register Tools here
    registerCategoryTools(mcpServer);
    registerCreditCardTools(mcpServer);
    registerTransactionTools(mcpServer);
    registerSummaryTools(mcpServer);

    return mcpServer;
}

const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
    const mcpServer = getServer();

    const transport = new StreamableHTTPServerTransport({
    });
    const mcpTransport = transport as unknown as Transport;

    res.on('close', () => {
        transport.close();
        mcpServer.close();
    });

    await mcpServer.connect(mcpTransport);
    await transport.handleRequest(req, res, req.body);
});

if (config.NODE_ENV !== 'test') {
    const MCPPORT = config.MCPPORT;
    app.listen(MCPPORT, () => {
        console.log(`MCP server is running on http://localhost:${MCPPORT}/mcp`);
    });
}

export { app };
