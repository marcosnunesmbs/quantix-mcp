import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerSubscriptionTools(server: McpServer) {
  server.registerTool(
    'create_subscription',
    {
      title: 'Create Subscription',
      description: 'Create a new subscription (recurring payment on a credit card)',
      inputSchema: CreateSubscriptionInput
    },
    async (args) => {
      try {
        const subscription = await apiClient.post('/subscriptions', args);
        return {
          content: [{ type: 'text', text: `Subscription created: ${JSON.stringify(subscription, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_subscriptions',
    {
      title: 'Get Subscriptions',
      description: 'List all subscriptions',
      inputSchema: z.object({})
    },
    async () => {
      try {
        const subscriptions = await apiClient.get('/subscriptions');
        return {
          content: [{ type: 'text', text: `Subscriptions: ${JSON.stringify(subscriptions, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_active_subscriptions',
    {
      title: 'Get Active Subscriptions',
      description: 'List all active subscriptions',
      inputSchema: z.object({})
    },
    async () => {
      try {
        const subscriptions = await apiClient.get('/subscriptions/active');
        return {
          content: [{ type: 'text', text: `Active subscriptions: ${JSON.stringify(subscriptions, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_subscription',
    {
      title: 'Get Subscription',
      description: 'Get a subscription by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const subscription = await apiClient.get(`/subscriptions/${id}`);
        return {
          content: [{ type: 'text', text: `Subscription: ${JSON.stringify(subscription, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'update_subscription',
    {
      title: 'Update Subscription',
      description: 'Update a subscription',
      inputSchema: UpdateSubscriptionInput
    },
    async ({ id, ...data }) => {
      try {
        const subscription = await apiClient.patch(`/subscriptions/${id}`, data);
        return {
          content: [{ type: 'text', text: `Subscription updated: ${JSON.stringify(subscription, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'deactivate_subscription',
    {
      title: 'Deactivate Subscription',
      description: 'Deactivate a subscription (soft delete)',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const result = await apiClient.delete(`/subscriptions/${id}`);
        return {
          content: [{ type: 'text', text: `Subscription deactivated: ${JSON.stringify(result, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'delete_subscription_permanent',
    {
      title: 'Delete Subscription Permanently',
      description: 'Permanently delete a subscription',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const result = await apiClient.delete(`/subscriptions/${id}/permanent`);
        return {
          content: [{ type: 'text', text: `Subscription permanently deleted: ${JSON.stringify(result, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'reactivate_subscription',
    {
      title: 'Reactivate Subscription',
      description: 'Reactivate a deactivated subscription',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const subscription = await apiClient.patch(`/subscriptions/${id}/reactivate`, {});
        return {
          content: [{ type: 'text', text: `Subscription reactivated: ${JSON.stringify(subscription, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}