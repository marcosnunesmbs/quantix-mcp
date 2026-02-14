import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateCreditCardInput, UpdateCreditCardInput, PayStatementInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';

export function registerCreditCardTools(server: McpServer) {
  server.registerTool(
    'create_credit_card',
    {
      title: 'Create Credit Card',
      description: 'Create a new credit card account',
      inputSchema: CreateCreditCardInput
    },
    async (args) => {
      const card = await apiClient.post('/credit-cards', args);
      return {
        content: [{ type: 'text', text: `Credit Card created: ${JSON.stringify(card, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'get_credit_cards',
    {
      title: 'Get Credit Cards',
      description: 'List all credit cards',
      inputSchema: z.object({})
    },
    async () => {
      const cards = await apiClient.get('/credit-cards');
      return {
        content: [{ type: 'text', text: `Credit Cards: ${JSON.stringify(cards, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'get_credit_card',
    {
      title: 'Get Credit Card',
      description: 'Get a credit card by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      const card = await apiClient.get(`/credit-cards/${id}`);
      return {
        content: [{ type: 'text', text: `Credit Card: ${JSON.stringify(card, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'update_credit_card',
    {
      title: 'Update Credit Card',
      description: 'Update a credit card',
      inputSchema: UpdateCreditCardInput
    },
    async ({ id, ...data }) => {
      const card = await apiClient.patch(`/credit-cards/${id}`, data);
      return {
        content: [{ type: 'text', text: `Credit Card updated: ${JSON.stringify(card, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'delete_credit_card',
    {
      title: 'Delete Credit Card',
      description: 'Delete a credit card by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      await apiClient.delete(`/credit-cards/${id}`);
      return {
        content: [{ type: 'text', text: `Credit Card deleted successfully (ID: ${id})` }]
      };
    }
  );

  server.registerTool(
    'get_statement',
    {
      title: 'Get Statement',
      description: 'Get credit card statement for a specific month',
      inputSchema: z.object({
        id: z.string().describe('Credit Card ID'),
        month: z.string().describe('Month in YYYY-MM format')
      })
    },
    async ({ id, month }) => {
      const statement = await apiClient.get(`/credit-cards/${id}/statement?month=${month}`);
      return {
        content: [{ type: 'text', text: `Statement: ${JSON.stringify(statement, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'pay_statement',
    {
      title: 'Pay Statement',
      description: 'Mark all transactions in a credit card statement as paid',
      inputSchema: PayStatementInput
    },
    async ({ cardId, month, paymentAccountId }) => {
      await apiClient.post(`/credit-cards/${cardId}/pay-statement`, { month, paymentAccountId });
      return {
        content: [{ type: 'text', text: `Statement for ${month} paid successfully.` }]
      };
    }
  );

  server.registerTool(
    'get_statement_status',
    {
      title: 'Get Statement Status',
      description: 'Get credit card statement payment status',
      inputSchema: z.object({
        id: z.string().describe('Credit Card ID'),
        month: z.string().describe('Month in YYYY-MM format')
      })
    },
    async ({ id, month }) => {
      const status = await apiClient.get(`/credit-cards/${id}/statement-status?month=${month}`);
      return {
        content: [{ type: 'text', text: `Statement Status: ${JSON.stringify(status, null, 2)}` }]
      };
    }
  );
}
