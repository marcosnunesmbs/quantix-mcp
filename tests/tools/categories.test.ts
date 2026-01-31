import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerCategoryTools } from '../../src/tools/categories.js';
import { apiClient } from '../../src/services/apiClient.js';

// Mock apiClient
vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Category Tools', () => {
  let mockServer: any;
  let registeredTools: Record<string, Function> = {};

  beforeEach(() => {
    registeredTools = {};
    mockServer = {
      registerTool: vi.fn((name, def, handler) => {
        registeredTools[name] = handler;
      })
    };
    vi.clearAllMocks();
  });

  it('should register category tools', () => {
    registerCategoryTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(3);
    expect(registeredTools['create_category']).toBeDefined();
    expect(registeredTools['get_categories']).toBeDefined();
    expect(registeredTools['delete_category']).toBeDefined();
  });

  describe('create_category', () => {
    it('should call api.post with correct data', async () => {
      registerCategoryTools(mockServer);
      const handler = registeredTools['create_category'];
      
      (apiClient.post as any).mockResolvedValue({ id: 'cat_1', name: 'Test' });

      const result = await handler({ name: 'Test', type: 'EXPENSE' });

      expect(apiClient.post).toHaveBeenCalledWith('/categories', { name: 'Test', type: 'EXPENSE' });
      expect(result.content[0].text).toContain('Category created');
      expect(result.content[0].text).toContain('Test');
    });
  });

  describe('get_categories', () => {
    it('should call api.get', async () => {
      registerCategoryTools(mockServer);
      const handler = registeredTools['get_categories'];
      
      (apiClient.get as any).mockResolvedValue([{ id: 'cat_1', name: 'Test' }]);

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/categories');
      expect(result.content[0].text).toContain('Test');
    });
  });

  describe('delete_category', () => {
    it('should call api.delete', async () => {
      registerCategoryTools(mockServer);
      const handler = registeredTools['delete_category'];
      
      (apiClient.delete as any).mockResolvedValue({});

      const result = await handler({ id: 'cat_1' });

      expect(apiClient.delete).toHaveBeenCalledWith('/categories/cat_1');
      expect(result.content[0].text).toContain('Category deleted');
    });
  });
});
