import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerAccountTools } from '../../src/tools/accounts.js';
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

describe('Account Tools', () => {
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

  it('should register all account tools', () => {
    registerAccountTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(7);
    expect(registeredTools['create_account']).toBeDefined();
    expect(registeredTools['get_accounts']).toBeDefined();
    expect(registeredTools['get_account']).toBeDefined();
    expect(registeredTools['update_account']).toBeDefined();
    expect(registeredTools['delete_account']).toBeDefined();
    expect(registeredTools['get_account_balance']).toBeDefined();
  });

  describe('create_account', () => {
    it('should post new account data', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['create_account'];
      (apiClient.post as any).mockResolvedValue({ id: 'acc_1', name: 'My Bank' });

      const input = { name: 'My Bank', type: 'BANK_ACCOUNT', initialBalance: 1000 };
      const result = await handler(input);

      expect(apiClient.post).toHaveBeenCalledWith('/accounts', input);
      expect(result.content[0].text).toContain('My Bank');
    });

    it('should return API error on failure', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['create_account'];
      (apiClient.post as any).mockRejectedValue(new ApiClientError('fail', 400, 'Bad Request'));

      const result = await handler({ name: 'My Bank', type: 'BANK_ACCOUNT' });

      expect(result.content[0].text).toMatch(/^API error 400/);
    });
  });

  describe('get_accounts', () => {
    it('should list accounts', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['get_accounts'];
      (apiClient.get as any).mockResolvedValue([{ id: 'acc_1', name: 'My Bank' }]);

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/accounts');
      expect(result.content[0].text).toContain('My Bank');
    });

    it('should return API error on failure', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['get_accounts'];
      (apiClient.get as any).mockRejectedValue(new ApiClientError('fail', 500, 'Internal Server Error'));

      const result = await handler({});

      expect(result.content[0].text).toMatch(/^API error 500/);
    });
  });

  describe('get_account', () => {
    it('should get account details', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['get_account'];
      (apiClient.get as any).mockResolvedValue({ id: 'acc_1', name: 'My Bank' });

      const result = await handler({ id: 'acc_1' });

      expect(apiClient.get).toHaveBeenCalledWith('/accounts/acc_1');
      expect(result.content[0].text).toContain('My Bank');
    });
  });

  describe('update_account', () => {
    it('should update account', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['update_account'];
      (apiClient.patch as any).mockResolvedValue({ id: 'acc_1', name: 'Updated Name' });

      const input = { id: 'acc_1', name: 'Updated Name' };
      const result = await handler(input);

      expect(apiClient.patch).toHaveBeenCalledWith('/accounts/acc_1', { name: 'Updated Name' });
      expect(result.content[0].text).toContain('Updated Name');
    });
  });

  describe('delete_account', () => {
    it('should delete account', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['delete_account'];
      (apiClient.delete as any).mockResolvedValue({});

      const result = await handler({ id: 'acc_1' });

      expect(apiClient.delete).toHaveBeenCalledWith('/accounts/acc_1');
      expect(result.content[0].text).toContain('deleted successfully');
    });

    it('should return API error on failure', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['delete_account'];
      (apiClient.delete as any).mockRejectedValue(new ApiClientError('fail', 404, 'Not Found'));

      const result = await handler({ id: 'acc_1' });

      expect(result.content[0].text).toMatch(/^API error 404/);
    });
  });

  describe('get_account_balance', () => {
    it('should get account balance', async () => {
      registerAccountTools(mockServer);
      const handler = registeredTools['get_account_balance'];
      (apiClient.get as any).mockResolvedValue({ accountId: 'acc_1', currentBalance: 500 });

      const result = await handler({ id: 'acc_1' });

      expect(apiClient.get).toHaveBeenCalledWith('/accounts/acc_1/balance');
      expect(result.content[0].text).toContain('500');
    });
  });
});
