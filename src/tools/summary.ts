import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { GetSummaryInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerSummaryTools(server: McpServer) {
  server.registerTool(
    'get_summary',
    {
      title: 'Get Financial Summary',
      description: 'Get financial summary (income, expenses, balance, credit cards, category breakdowns). Provide either month (YYYY-MM) or startDate+endDate (YYYY-MM-DD).',
      inputSchema: GetSummaryInput
    },
    async ({ month, startDate, endDate }) => {
      try {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const summary = await apiClient.get(`/summary?${params.toString()}`);
        return {
          content: [{ type: 'text', text: `Summary: ${JSON.stringify(summary, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}
