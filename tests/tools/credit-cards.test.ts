import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerCreditCardTools } from '../../src/tools/credit-cards.js';
import { apiClient } from '../../src/services/apiClient.js';

vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('Credit Card Tools', () => {
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

  it('should register all credit card tools', () => {
    registerCreditCardTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(4);
    expect(registeredTools['create_credit_card']).toBeDefined();
    expect(registeredTools['get_credit_cards']).toBeDefined();
    expect(registeredTools['get_statement']).toBeDefined();
    expect(registeredTools['pay_statement']).toBeDefined();
  });

  describe('create_credit_card', () => {
    it('should post new card data', async () => {
      registerCreditCardTools(mockServer);
      const handler = registeredTools['create_credit_card'];
      (apiClient.post as any).mockResolvedValue({ id: 'cc_1', name: 'Visa' });

      const input = { name: 'Visa', limitAmount: 5000, closingDay: 10, dueDay: 20 };
      const result = await handler(input);

      expect(apiClient.post).toHaveBeenCalledWith('/credit-cards', input);
      expect(result.content[0].text).toContain('Visa');
    });
  });

  describe('get_credit_cards', () => {
    it('should list cards', async () => {
      registerCreditCardTools(mockServer);
      const handler = registeredTools['get_credit_cards'];
      (apiClient.get as any).mockResolvedValue([{ id: 'cc_1', name: 'Visa' }]);

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/credit-cards');
      expect(result.content[0].text).toContain('Visa');
    });
  });

  describe('get_statement', () => {
    it('should get statement for month', async () => {
      registerCreditCardTools(mockServer);
      const handler = registeredTools['get_statement'];
      (apiClient.get as any).mockResolvedValue({ total: 100 });

      await handler({ id: 'cc_1', month: '2026-03' });

      expect(apiClient.get).toHaveBeenCalledWith('/credit-cards/cc_1/statement?month=2026-03');
    });
  });

  describe('pay_statement', () => {
    it('should pay statement', async () => {
      registerCreditCardTools(mockServer);
      const handler = registeredTools['pay_statement'];
      (apiClient.post as any).mockResolvedValue({});

      await handler({ cardId: 'cc_1', month: '2026-03', paymentAccountId: 'acc_1' });

      // Note: Assuming endpoint matches spec: /credit-cards/{id}/pay-statement
      expect(apiClient.post).toHaveBeenCalledWith('/credit-cards/cc_1/pay-statement', { 
        month: '2026-03',
        paymentAccountId: 'acc_1'
      }); 
    });
  });
});
