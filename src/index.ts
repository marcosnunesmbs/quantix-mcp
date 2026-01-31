#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'; // Example for Express
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import express, { type Request, type Response } from 'express';

import * as z from 'zod/v4';

function getServer() {
    const mcpServer = new McpServer({
        name: 'quantix_mcp_server',
        version: '1.0.0'
    });

    console.log('McpServer started');

    mcpServer.registerTool(
        'get_crypto_price',
        {
            title: 'Get Cryptocurrency Price',
            description: 'Get the current price of a cryptocurrency from CoinGecko.',
            inputSchema: {
                crypto_id: z.string(),
                currency: z.string()
            }
        },
        async ({ crypto_id, currency }) => {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${crypto_id}&vs_currencies=${currency}`
            );
            const data = await response.json();
            const price = data[crypto_id][currency];
            const output = `The current price of ${crypto_id} in ${currency} is ${price}`;
            return {
                content: [{ type: 'text', text: output }],
            };
        }
    );
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

const MCPPORT = process.env.MCPPORT || 3001;
app.listen(MCPPORT, () => {
    console.log(`MCP server is running on http://localhost:${MCPPORT}/mcp`);
});