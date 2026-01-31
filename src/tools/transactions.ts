import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateTransactionInput, GetTransactionsInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';

export function registerTransactionTools(server: McpServer) {
  server.registerTool(
    'create_transaction',
    {
      title: 'Create Transaction',
      description: 'Record a new income or expense',
      inputSchema: CreateTransactionInput
    },
    async (args) => {
      const transaction = await apiClient.post('/transactions', args);
      return {
        content: [{ type: 'text', text: `Transaction created: ${JSON.stringify(transaction, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'get_transactions',
    {
      title: 'Get Transactions',
      description: 'List transactions for a specific month',
      inputSchema: GetTransactionsInput
    },
    async ({ month }) => {
      const transactions = await apiClient.get(`/transactions?month=${month}`);
      return {
        content: [{ type: 'text', text: `Transactions: ${JSON.stringify(transactions, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'pay_transaction',
    {
      title: 'Pay Transaction',
      description: 'Mark a transaction as paid/received',
      inputSchema: z.object({ id: z.string().describe("Transaction ID") })
    },
    async ({ id }) => {
      // PATCH /transactions/{id}/pay
      await apiClient.patch(`/transactions/${id}/pay`);
      return {
        content: [{ type: 'text', text: `Transaction ${id} marked as paid.` }]
      };
    }
  );

  server.registerTool(
    'delete_transaction',
    {
      title: 'Delete Transaction',
      description: 'Delete a transaction by ID',
      inputSchema: z.object({ id: z.string().describe("Transaction ID") })
    },
    async ({ id }) => {
      await apiClient.delete(`/transactions/${id}`);
      return {
        content: [{ type: 'text', text: `Transaction ${id} deleted.` }]
      };
    }
  );
}
