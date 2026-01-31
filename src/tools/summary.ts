import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GetSummaryInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';

export function registerSummaryTools(server: McpServer) {
  server.registerTool(
    'get_summary',
    {
      title: 'Get Financial Summary',
      description: 'Get monthly financial summary including income, expenses, and balance',
      inputSchema: GetSummaryInput
    },
    async ({ month }) => {
      const summary = await apiClient.get(`/summary?month=${month}`);
      return {
        content: [{ type: 'text', text: `Summary for ${month}: ${JSON.stringify(summary, null, 2)}` }]
      };
    }
  );
}
