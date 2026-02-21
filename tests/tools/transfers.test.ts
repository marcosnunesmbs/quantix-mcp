import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerTransferTools } from '../../src/tools/transfers.js';
import { apiClient } from '../../src/services/apiClient.js';
import { ApiClientError } from '../../src/services/apiClient.js';

vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
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

describe('Transfer Tools', () => {
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

  it('should register all transfer tools', () => {
    registerTransferTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(5);
    expect(registeredTools['create_transfer']).toBeDefined();
    expect(registeredTools['get_transfers']).toBeDefined();
    expect(registeredTools['get_transfer']).toBeDefined();
    expect(registeredTools['update_transfer']).toBeDefined();
    expect(registeredTools['delete_transfer']).toBeDefined();
  });

  describe('create_transfer', () => {
    it('should create a transfer', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['create_transfer'];
      (apiClient.post as any).mockResolvedValue({ id: 'tr_1' });

      const input = {
        sourceAccountId: 'acc_1',
        destinationAccountId: 'acc_2',
        amount: 100,
        date: '2026-03-01'
      };
      const result = await handler(input);

      expect(apiClient.post).toHaveBeenCalledWith('/transfers', input);
      expect(result.content[0].text).toContain('Transfer created');
    });

    it('should return API error on failure', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['create_transfer'];
      (apiClient.post as any).mockRejectedValue(new ApiClientError('fail', 400, 'Bad Request'));

      const result = await handler({
        sourceAccountId: 'acc_1',
        destinationAccountId: 'acc_2',
        amount: 100,
        date: '2026-03-01'
      });

      expect(result.content[0].text).toMatch(/^API error 400/);
    });
  });

  describe('get_transfers', () => {
    it('should list transfers', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['get_transfers'];
      (apiClient.get as any).mockResolvedValue([{ id: 'tr_1' }]);

      const result = await handler({ month: '2026-03' });

      expect(apiClient.get).toHaveBeenCalledWith('/transfers?month=2026-03');
      expect(result.content[0].text).toContain('Transfers');
    });

    it('should return API error on failure', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['get_transfers'];
      (apiClient.get as any).mockRejectedValue(new ApiClientError('fail', 500, 'Internal Server Error'));

      const result = await handler({});

      expect(result.content[0].text).toMatch(/^API error 500/);
    });
  });

  describe('get_transfer', () => {
    it('should get a transfer by ID', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['get_transfer'];
      (apiClient.get as any).mockResolvedValue({ id: 'tr_1', amount: 100 });

      const result = await handler({ id: 'tr_1' });

      expect(apiClient.get).toHaveBeenCalledWith('/transfers/tr_1');
      expect(result.content[0].text).toContain('tr_1');
    });
  });

  describe('delete_transfer', () => {
    it('should delete a transfer', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['delete_transfer'];
      (apiClient.delete as any).mockResolvedValue({});

      const result = await handler({ id: 'tr_1' });

      expect(apiClient.delete).toHaveBeenCalledWith('/transfers/tr_1');
      expect(result.content[0].text).toContain('tr_1');
    });

    it('should return API error on failure', async () => {
      registerTransferTools(mockServer);
      const handler = registeredTools['delete_transfer'];
      (apiClient.delete as any).mockRejectedValue(new ApiClientError('fail', 404, 'Not Found'));

      const result = await handler({ id: 'tr_1' });

      expect(result.content[0].text).toMatch(/^API error 404/);
    });
  });
});
