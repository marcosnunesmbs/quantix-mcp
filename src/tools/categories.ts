import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/schemas.js';
import { apiClient } from '../services/apiClient.js';
import { handleToolError } from '../utils/toolHelpers.js';

export function registerCategoryTools(server: McpServer) {
  server.registerTool(
    'create_category',
    {
      title: 'Create Category',
      description: 'Create a new financial category (INCOME or EXPENSE)',
      inputSchema: CreateCategoryInput
    },
    async (args) => {
      try {
        const category = await apiClient.post('/categories', args);
        return {
          content: [{ type: 'text', text: `Category created: ${JSON.stringify(category, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_categories',
    {
      title: 'Get Categories',
      description: 'List all financial categories',
      inputSchema: z.object({})
    },
    async () => {
      try {
        const categories = await apiClient.get('/categories');
        return {
          content: [{ type: 'text', text: `Categories: ${JSON.stringify(categories, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'get_category',
    {
      title: 'Get Category',
      description: 'Get a category by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        const category = await apiClient.get(`/categories/${id}`);
        return {
          content: [{ type: 'text', text: `Category: ${JSON.stringify(category, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'update_category',
    {
      title: 'Update Category',
      description: 'Update a category',
      inputSchema: UpdateCategoryInput
    },
    async ({ id, ...data }) => {
      try {
        const category = await apiClient.patch(`/categories/${id}`, data);
        return {
          content: [{ type: 'text', text: `Category updated: ${JSON.stringify(category, null, 2)}` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );

  server.registerTool(
    'delete_category',
    {
      title: 'Delete Category',
      description: 'Delete a category by ID',
      inputSchema: z.object({ id: z.string() })
    },
    async ({ id }) => {
      try {
        await apiClient.delete(`/categories/${id}`);
        return {
          content: [{ type: 'text', text: `Category deleted successfully (ID: ${id})` }]
        };
      } catch (error) {
        return handleToolError(error);
      }
    }
  );
}
