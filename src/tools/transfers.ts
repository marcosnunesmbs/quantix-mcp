// MCP tools for /transfers endpoints
// Auto-generated, Feb 2026
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiClient } from '../services/apiClient.js';
import { TransferSchema, CreateTransferRequestSchema, UpdateTransferRequestSchema } from '../types/schemas.js';

export function registerTransferTools(server: McpServer) {
  // Create transfer
  server.registerTool(
    'create_transfer',
    {
      title: 'Create Transfer',
      description: 'Create a new transfer between accounts',
      inputSchema: CreateTransferRequestSchema
    },
    async (input: z.infer<typeof CreateTransferRequestSchema>) => {
      const transfer = await apiClient.post('/transfers', input);
      return {
        content: [{ type: 'text', text: `Transfer created: ${JSON.stringify(transfer, null, 2)}` }]
      };
    }
  );

  // List transfers
  server.registerTool(
    'get_transfers',
    {
      title: 'Get Transfers',
      description: 'List transfers with optional filters',
      inputSchema: z.object({
        accountId: z.string().optional(),
        month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    },
    async (input: { accountId?: string | undefined; month?: string | undefined; startDate?: string | undefined; endDate?: string | undefined }) => {
      const params = new URLSearchParams();
      if (input.accountId) params.append('accountId', input.accountId);
      if (input.month) params.append('month', input.month);
      if (input.startDate) params.append('startDate', input.startDate);
      if (input.endDate) params.append('endDate', input.endDate);
      const qs = params.toString();
      const url = qs ? `/transfers?${qs}` : '/transfers';
      const transfers = await apiClient.get(url);
      return {
        content: [{ type: 'text', text: `Transfers: ${JSON.stringify(transfers, null, 2)}` }]
      };
    }
  );

  // Get transfer by ID
  server.registerTool(
    'get_transfer',
    {
      title: 'Get Transfer',
      description: 'Get a transfer by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async (input: { id: string }) => {
      const transfer = await apiClient.get(`/transfers/${input.id}`);
      return {
        content: [{ type: 'text', text: `Transfer: ${JSON.stringify(transfer, null, 2)}` }]
      };
    }
  );

  // Update transfer
  server.registerTool(
    'update_transfer',
    {
      title: 'Update Transfer',
      description: 'Update a transfer',
      inputSchema: z.object({ id: z.string() }).merge(UpdateTransferRequestSchema)
    },
    async (input: { id: string } & z.infer<typeof UpdateTransferRequestSchema>) => {
      const { id, ...body } = input;
      const transfer = await apiClient.patch(`/transfers/${id}`, body);
      return {
        content: [{ type: 'text', text: `Transfer updated: ${JSON.stringify(transfer, null, 2)}` }]
      };
    }
  );

  // Delete transfer
  server.registerTool(
    'delete_transfer',
    {
      title: 'Delete Transfer',
      description: 'Delete a transfer',
      inputSchema: z.object({ id: z.string() })
    },
    async (input: { id: string }) => {
      await apiClient.delete(`/transfers/${input.id}`);
      return {
        content: [{ type: 'text', text: `Transfer deleted: ${input.id}` }]
      };
    }
  );
}
