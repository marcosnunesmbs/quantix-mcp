#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import express, { type Request, type Response } from 'express';
import { config } from './config.js';
import { z } from 'zod';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerCategoryTools } from './tools/categories.js';
import { registerCreditCardTools } from './tools/credit-cards.js';
import { registerTransactionTools } from './tools/transactions.js';
import { registerSummaryTools } from './tools/summary.js';
import { registerAccountTools } from './tools/accounts.js';
import { registerSettingsTools } from './tools/settings.js';
import { registerTransferTools } from './tools/transfers.js';

export function getServer() {
    const mcpServer = new McpServer({
        name: 'quantix_mcp_server',
        version: '0.3.6',
        description: 'MCP server for Quantix personal finance management',
    });

    console.log('Quantix MCP server started');

    // Register Tools here
    registerCategoryTools(mcpServer);
    registerCreditCardTools(mcpServer);
    registerTransactionTools(mcpServer);
    registerSummaryTools(mcpServer);
    registerAccountTools(mcpServer);
    registerSettingsTools(mcpServer);

    registerTransferTools(mcpServer);

    return mcpServer;
}

async function main() {
    const transport = new StdioServerTransport();
    const mcpServer = getServer();
    await mcpServer.connect(transport);
    console.log('Quantix MCP server is running...');
}

main().catch(error => {
    console.error('Server error:', error);
    process.exit(1);
});
