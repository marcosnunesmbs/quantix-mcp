import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ImportDataInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';

export function registerDataTools(server: McpServer) {
  server.registerTool(
    'export_data',
    {
      title: 'Export Data',
      description: 'Export all user data (settings, categories, accounts, credit cards, recurrence rules, transactions) as a complete backup',
      inputSchema: z.object({})
    },
    async () => {
      const data = await apiClient.get('/export');
      return {
        content: [{ type: 'text', text: `Export: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );

  server.registerTool(
    'import_data',
    {
      title: 'Import Data',
      description: 'Import a previously exported backup. Mode "reset" clears all existing data first; mode "increment" adds new records and skips existing IDs.',
      inputSchema: ImportDataInput
    },
    async (args) => {
      const result = await apiClient.post('/import', args);
      return {
        content: [{ type: 'text', text: `Import result: ${JSON.stringify(result, null, 2)}` }]
      };
    }
  );
}
