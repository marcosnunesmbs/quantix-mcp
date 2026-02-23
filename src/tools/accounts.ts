import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateAccountInput, UpdateAccountInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerAccountTools(server: McpServer) {
  server.registerTool(
    'create_account',
    {
      title: 'Create Account',
      description: 'Create a new financial account (BANK_ACCOUNT, WALLET, etc.)',
      inputSchema: CreateAccountInput
    },
    async (args) => {
      try {
        const account = await apiClient.post('/accounts', args);
        return {
          content: [{ type: 'text', text: `Account created: ${JSON.stringify(account, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_accounts',
    {
      title: 'Get Accounts',
      description: 'List all financial accounts with current balances',
      inputSchema: z.object({})
    },
    async () => {
      try {
        const accounts = await apiClient.get('/accounts');
        return {
          content: [{ type: 'text', text: `Accounts: ${JSON.stringify(accounts, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_account',
    {
      title: 'Get Account Details',
      description: 'Get details of a specific account by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const account = await apiClient.get(`/accounts/${id}`);
        return {
          content: [{ type: 'text', text: `Account details: ${JSON.stringify(account, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'update_account',
    {
      title: 'Update Account',
      description: 'Update an existing account',
      inputSchema: UpdateAccountInput
    },
    async ({ id, ...data }) => {
      try {
        const account = await apiClient.patch(`/accounts/${id}`, data);
        return {
          content: [{ type: 'text', text: `Account updated: ${JSON.stringify(account, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'delete_account',
    {
      title: 'Delete Account',
      description: 'Delete an account by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        await apiClient.delete(`/accounts/${id}`);
        return {
          content: [{ type: 'text', text: `Account deleted successfully (ID: ${id})` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_account_balance',
    {
      title: 'Get Account Balance',
      description: 'Get the current balance for a specific account',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const balance = await apiClient.get(`/accounts/${id}/balance`);
        return {
          content: [{ type: 'text', text: `Account balance: ${JSON.stringify(balance, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

}
