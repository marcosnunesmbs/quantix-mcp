import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateCreditCardInput, PayStatementInput } from '../types/schemas.js';
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
    async ({ cardId, month }) => {
      await apiClient.post(`/credit-cards/${cardId}/pay-statement?month=${month}`, {});
      return {
        content: [{ type: 'text', text: `Statement for ${month} paid successfully.` }]
      };
    }
  );
}
