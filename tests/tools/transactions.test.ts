import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerTransactionTools } from '../../src/tools/transactions.js';
import { apiClient } from '../../src/services/apiClient.js';

vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Transaction Tools', () => {
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

  it('should register transaction tools', () => {
    registerTransactionTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(7); // create, get_all, get_one, update, pay, unpay, delete
  });

  describe('create_transaction', () => {
    it('should create transaction', async () => {
      registerTransactionTools(mockServer);
      const handler = registeredTools['create_transaction'];
      (apiClient.post as any).mockResolvedValue({ id: 'tx_1' });

      const input = { type: 'EXPENSE', name: 'Lunch', amount: 20, date: '2026-03-01' };
      const result = await handler(input);

      expect(apiClient.post).toHaveBeenCalledWith('/transactions', expect.objectContaining(input));
      expect(result.content[0].text).toContain('Transaction created');
    });
  });

  describe('get_transactions', () => {
    it('should get transactions list', async () => {
      registerTransactionTools(mockServer);
      const handler = registeredTools['get_transactions'];
      (apiClient.get as any).mockResolvedValue([]);

      await handler({ month: '2026-03' });

      expect(apiClient.get).toHaveBeenCalledWith('/transactions?month=2026-03');
    });
  });

  describe('pay_transaction', () => {
    it('should pay transaction', async () => {
      registerTransactionTools(mockServer);
      const handler = registeredTools['pay_transaction'];
      (apiClient.patch as any).mockResolvedValue({});

      await handler({ id: 'tx_1' });

      expect(apiClient.patch).toHaveBeenCalledWith('/transactions/tx_1/pay');
    });
  });

  describe('delete_transaction', () => {
    it('should delete transaction', async () => {
      registerTransactionTools(mockServer);
      const handler = registeredTools['delete_transaction'];
      (apiClient.delete as any).mockResolvedValue({});

      await handler({ id: 'tx_1' });

      expect(apiClient.delete).toHaveBeenCalledWith('/transactions/tx_1');
    });
  });
});
