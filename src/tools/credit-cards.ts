import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateCreditCardInput, UpdateCreditCardInput, PayStatementInput, ReopenStatementInput, CreateAnticipationInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerCreditCardTools(server: McpServer) {
  server.registerTool(
    'create_credit_card',
    {
      title: 'Create Credit Card',
      description: 'Create a new credit card account',
      inputSchema: CreateCreditCardInput
    },
    async (args) => {
      try {
        const card = await apiClient.post('/credit-cards', args);
        return {
          content: [{ type: 'text', text: `Credit Card created: ${JSON.stringify(card, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        const cards = await apiClient.get('/credit-cards');
        return {
          content: [{ type: 'text', text: `Credit Cards: ${JSON.stringify(cards, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        const card = await apiClient.get(`/credit-cards/${id}`);
        return {
          content: [{ type: 'text', text: `Credit Card: ${JSON.stringify(card, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        const card = await apiClient.patch(`/credit-cards/${id}`, data);
        return {
          content: [{ type: 'text', text: `Credit Card updated: ${JSON.stringify(card, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        await apiClient.delete(`/credit-cards/${id}`);
        return {
          content: [{ type: 'text', text: `Credit Card deleted successfully (ID: ${id})` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        const statement = await apiClient.get(`/credit-cards/${id}/statement?month=${month}`);
        return {
          content: [{ type: 'text', text: `Statement: ${JSON.stringify(statement, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        await apiClient.post(`/credit-cards/${cardId}/pay-statement`, { month, paymentAccountId });
        return {
          content: [{ type: 'text', text: `Statement for ${month} paid successfully.` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'reopen_statement',
    {
      title: 'Reopen Statement',
      description: 'Reopen a credit card statement by marking all transactions as unpaid',
      inputSchema: ReopenStatementInput
    },
    async ({ cardId, month }) => {
      try {
        const result = await apiClient.post(`/credit-cards/${cardId}/reopen-statement`, { month });
        return {
          content: [{ type: 'text', text: `Statement reopened: ${JSON.stringify(result, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        const status = await apiClient.get(`/credit-cards/${id}/statement-status?month=${month}`);
        return {
          content: [{ type: 'text', text: `Statement Status: ${JSON.stringify(status, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'create_anticipation',
    {
      title: 'Create Credit Card Anticipation',
      description: 'Create a credit card anticipation (advance payment toward a statement). Creates a linked pair: INCOME on the credit card side and EXPENSE on the account side.',
      inputSchema: CreateAnticipationInput
    },
    async ({ cardId, ...body }) => {
      try {
        const result = await apiClient.post(`/credit-cards/${cardId}/anticipations`, body);
        return {
          content: [{ type: 'text', text: `Anticipation created: ${JSON.stringify(result, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}
