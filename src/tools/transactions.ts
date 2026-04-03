import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  CreateTransactionInput,
  GetTransactionsInput,
  UpdateTransactionInput,
  CreateCreditCardTransactionInput,
  UpdateCreditCardTransactionInput
} from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerTransactionTools(server: McpServer) {
  server.registerTool(
    'create_transaction',
    {
      title: 'Create Transaction',
      description: 'Record a new income or expense using direct payment methods (CASH, PIX, or DEBIT only). For credit card purchases, use create_credit_transaction instead.',
      inputSchema: CreateTransactionInput
    },
    async (args) => {
      try {
        const transaction = await apiClient.post('/transactions', args);
        return {
          content: [{ type: 'text', text: `Transaction created: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_transactions',
    {
      title: 'Get Transactions',
      description: 'List transactions with optional filters (month, date range, account, category, credit card, type, paid status)',
      inputSchema: GetTransactionsInput
    },
    async (args) => {
      try {
        const params = new URLSearchParams();
        if (args.month) params.append('month', args.month);
        if (args.accountId) params.append('accountId', args.accountId);
        if (args.categoryId) params.append('categoryId', args.categoryId);
        if (args.creditCardId) params.append('creditCardId', args.creditCardId);
        if (args.type) params.append('type', args.type);
        if (args.startDate) params.append('startDate', args.startDate);
        if (args.endDate) params.append('endDate', args.endDate);
        if (args.paid !== undefined) params.append('paid', String(args.paid));
        const qs = params.toString();
        const url = qs ? `/transactions?${qs}` : '/transactions';
        const transactions = await apiClient.get(url);
        return {
          content: [{ type: 'text', text: `Transactions: ${JSON.stringify(transactions, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_transaction',
    {
      title: 'Get Transaction',
      description: 'Get a transaction by ID',
      inputSchema: z.object({ id: z.string().describe("Transaction ID") })
    },
    async ({ id }) => {
      try {
        const transaction = await apiClient.get(`/transactions/${id}`);
        return {
          content: [{ type: 'text', text: `Transaction: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'update_transaction',
    {
      title: 'Update Transaction',
      description: 'Update a transaction using direct payment methods (CASH, PIX, or DEBIT only). For credit card transactions, use update_credit_transaction instead.',
      inputSchema: UpdateTransactionInput
    },
    async ({ id, mode, ...data }) => {
      try {
        const url = mode ? `/transactions/${id}?mode=${mode}` : `/transactions/${id}`;
        const transaction = await apiClient.patch(url, data);
        return {
          content: [{ type: 'text', text: `Transaction updated: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
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
      try {
        const transaction = await apiClient.patch(`/transactions/${id}/pay`);
        return {
          content: [{ type: 'text', text: `Transaction marked as paid: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'unpay_transaction',
    {
      title: 'Unpay Transaction',
      description: 'Mark a transaction as unpaid',
      inputSchema: z.object({ id: z.string().describe("Transaction ID") })
    },
    async ({ id }) => {
      try {
        const transaction = await apiClient.patch(`/transactions/${id}/unpay`);
        return {
          content: [{ type: 'text', text: `Transaction marked as unpaid: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'delete_transaction',
    {
      title: 'Delete Transaction',
      description: 'Delete a transaction by ID',
      inputSchema: z.object({
        id: z.string().describe("Transaction ID"),
        mode: z.enum(["SINGLE", "PENDING", "ALL"]).default("SINGLE").optional()
      })
    },
    async ({ id, mode }) => {
      try {
        const url = mode ? `/transactions/${id}?mode=${mode}` : `/transactions/${id}`;
        await apiClient.delete(url);
        return {
          content: [{ type: 'text', text: `Transaction ${id} deleted.` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'create_credit_transaction',
    {
      title: 'Create Credit Card Transaction',
      description: 'Record a new credit card purchase. The due date is automatically calculated based on the purchase date and the card closing day. Use targetDueMonth to specify a particular billing month.',
      inputSchema: CreateCreditCardTransactionInput
    },
    async (args) => {
      try {
        const transaction = await apiClient.post('/transactions/credit', args);
        return {
          content: [{ type: 'text', text: `Credit card transaction created: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'update_credit_transaction',
    {
      title: 'Update Credit Card Transaction',
      description: 'Update a credit card transaction. If purchaseDate or targetDueMonth is changed, the due date is recalculated.',
      inputSchema: UpdateCreditCardTransactionInput
    },
    async ({ id, ...data }) => {
      try {
        const transaction = await apiClient.patch(`/transactions/credit/${id}`, data);
        return {
          content: [{ type: 'text', text: `Credit card transaction updated: ${JSON.stringify(transaction, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}
