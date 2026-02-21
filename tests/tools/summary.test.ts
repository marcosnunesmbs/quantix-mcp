import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerSummaryTools } from '../../src/tools/summary.js';
import { apiClient } from '../../src/services/apiClient.js';
import { ApiClientError } from '../../src/services/apiClient.js';

vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
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

describe('Summary Tools', () => {
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

  it('should register summary tools', () => {
    registerSummaryTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(1);
    expect(registeredTools['get_summary']).toBeDefined();
  });

  describe('get_summary', () => {
    it('should get summary', async () => {
      registerSummaryTools(mockServer);
      const handler = registeredTools['get_summary'];
      (apiClient.get as any).mockResolvedValue({ income: 1000 });

      await handler({ month: '2026-03' });

      expect(apiClient.get).toHaveBeenCalledWith('/summary?month=2026-03');
    });

    it('should return API error on failure', async () => {
      registerSummaryTools(mockServer);
      const handler = registeredTools['get_summary'];
      (apiClient.get as any).mockRejectedValue(new ApiClientError('fail', 500, 'Internal Server Error'));

      const result = await handler({});

      expect(result.content[0].text).toMatch(/^API error 500/);
    });
  });
});
