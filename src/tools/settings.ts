import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateSettingsInput, UpdateSettingsInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerSettingsTools(server: McpServer) {
  server.registerTool(
    'create_settings',
    {
      title: 'Create Settings',
      description: 'Create global settings (only if not exists)',
      inputSchema: CreateSettingsInput
    },
    async (args) => {
      try {
        const settings = await apiClient.post('/settings', args);
        return {
          content: [{ type: 'text', text: `Settings created: ${JSON.stringify(settings, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_settings',
    {
      title: 'Get Settings',
      description: 'Get global settings',
      inputSchema: z.object({})
    },
    async () => {
      try {
        const settings = await apiClient.get('/settings');
        return {
          content: [{ type: 'text', text: `Settings: ${JSON.stringify(settings, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'update_settings',
    {
      title: 'Update Settings',
      description: 'Update global settings',
      inputSchema: UpdateSettingsInput
    },
    async (args) => {
      try {
        const settings = await apiClient.put('/settings', args);
        return {
          content: [{ type: 'text', text: `Settings updated: ${JSON.stringify(settings, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}
