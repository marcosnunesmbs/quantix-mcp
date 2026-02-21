import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerDataTools } from '../../src/tools/data.js';
import { apiClient } from '../../src/services/apiClient.js';
import { ApiClientError } from '../../src/services/apiClient.js';

vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
  ApiClientError: class ApiClientError extends Error {
    status: number;
    statusText: string;
    constructor(message: string, status: number, statusText: string) {
      super(message);
      this.name = 'ApiClientError';
      this.status = status;
      this.statusText = statusText;
    }
  }
}));

describe('Data Tools', () => {
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

  it('should register all data tools', () => {
    registerDataTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(2);
    expect(registeredTools['export_data']).toBeDefined();
    expect(registeredTools['import_data']).toBeDefined();
  });

  describe('export_data', () => {
    it('should export data', async () => {
      registerDataTools(mockServer);
      const handler = registeredTools['export_data'];
      (apiClient.get as any).mockResolvedValue({ version: '1.0', data: {} });

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/export');
      expect(result.content[0].text).toContain('Export');
    });

    it('should return API error on failure', async () => {
      registerDataTools(mockServer);
      const handler = registeredTools['export_data'];
      (apiClient.get as any).mockRejectedValue(new ApiClientError('fail', 500, 'Internal Server Error'));

      const result = await handler({});

      expect(result.content[0].text).toMatch(/^API error 500/);
    });
  });

  describe('import_data', () => {
    it('should import data', async () => {
      registerDataTools(mockServer);
      const handler = registeredTools['import_data'];
      (apiClient.post as any).mockResolvedValue({ imported: 10 });

      const input = {
        mode: 'increment',
        version: '1.0',
        exportedAt: '2026-01-01T00:00:00.000Z',
        data: { categories: [] }
      };
      const result = await handler(input);

      expect(apiClient.post).toHaveBeenCalledWith('/import', input);
      expect(result.content[0].text).toContain('Import result');
    });

    it('should return API error on failure', async () => {
      registerDataTools(mockServer);
      const handler = registeredTools['import_data'];
      (apiClient.post as any).mockRejectedValue(new ApiClientError('fail', 400, 'Bad Request'));

      const result = await handler({
        mode: 'reset',
        version: '1.0',
        exportedAt: '2026-01-01T00:00:00.000Z',
        data: {}
      });

      expect(result.content[0].text).toMatch(/^API error 400/);
    });
  });
});
