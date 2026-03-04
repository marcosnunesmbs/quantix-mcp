import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerSubscriptionTools } from '../../src/tools/subscriptions.js';
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

describe('Subscription Tools', () => {
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

  it('should register all subscription tools', () => {
    registerSubscriptionTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(8);
    expect(registeredTools['create_subscription']).toBeDefined();
    expect(registeredTools['get_subscriptions']).toBeDefined();
    expect(registeredTools['get_active_subscriptions']).toBeDefined();
    expect(registeredTools['get_subscription']).toBeDefined();
    expect(registeredTools['update_subscription']).toBeDefined();
    expect(registeredTools['deactivate_subscription']).toBeDefined();
    expect(registeredTools['delete_subscription_permanent']).toBeDefined();
    expect(registeredTools['reactivate_subscription']).toBeDefined();
  });

  describe('create_subscription', () => {
    it('should call api.post with correct data', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['create_subscription'];

      (apiClient.post as any).mockResolvedValue({ id: 'sub_1', name: 'Netflix' });

      const result = await handler({ name: 'Netflix', amount: 55.9, billingDay: 15, creditCardId: 'cc_1' });

      expect(apiClient.post).toHaveBeenCalledWith('/subscriptions', { name: 'Netflix', amount: 55.9, billingDay: 15, creditCardId: 'cc_1' });
      expect(result.content[0].text).toContain('Subscription created');
    });

    it('should return API error on failure', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['create_subscription'];
      (apiClient.post as any).mockRejectedValue(new ApiClientError('fail', 400, 'Bad Request'));

      const result = await handler({ name: 'Netflix', amount: 55.9, billingDay: 15, creditCardId: 'cc_1' });

      expect(result.content[0].text).toMatch(/^API error 400/);
    });
  });

  describe('get_subscriptions', () => {
    it('should call api.get', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['get_subscriptions'];

      (apiClient.get as any).mockResolvedValue([{ id: 'sub_1', name: 'Netflix' }]);

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/subscriptions');
      expect(result.content[0].text).toContain('Netflix');
    });
  });

  describe('get_active_subscriptions', () => {
    it('should call api.get with correct endpoint', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['get_active_subscriptions'];

      (apiClient.get as any).mockResolvedValue([{ id: 'sub_1', name: 'Netflix', active: true }]);

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/active');
      expect(result.content[0].text).toContain('Active subscriptions');
    });
  });

  describe('get_subscription', () => {
    it('should call api.get with correct id', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['get_subscription'];

      (apiClient.get as any).mockResolvedValue({ id: 'sub_1', name: 'Netflix' });

      const result = await handler({ id: 'sub_1' });

      expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/sub_1');
      expect(result.content[0].text).toContain('Netflix');
    });
  });

  describe('update_subscription', () => {
    it('should call api.patch with correct data', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['update_subscription'];

      (apiClient.patch as any).mockResolvedValue({ id: 'sub_1', name: 'Netflix Premium' });

      const result = await handler({ id: 'sub_1', name: 'Netflix Premium' });

      expect(apiClient.patch).toHaveBeenCalledWith('/subscriptions/sub_1', { name: 'Netflix Premium' });
      expect(result.content[0].text).toContain('Subscription updated');
    });
  });

  describe('deactivate_subscription', () => {
    it('should call api.delete', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['deactivate_subscription'];

      (apiClient.delete as any).mockResolvedValue({ id: 'sub_1', active: false });

      const result = await handler({ id: 'sub_1' });

      expect(apiClient.delete).toHaveBeenCalledWith('/subscriptions/sub_1');
      expect(result.content[0].text).toContain('Subscription deactivated');
    });
  });

  describe('delete_subscription_permanent', () => {
    it('should call api.delete with permanent endpoint', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['delete_subscription_permanent'];

      (apiClient.delete as any).mockResolvedValue({});

      const result = await handler({ id: 'sub_1' });

      expect(apiClient.delete).toHaveBeenCalledWith('/subscriptions/sub_1/permanent');
      expect(result.content[0].text).toContain('permanently deleted');
    });
  });

  describe('reactivate_subscription', () => {
    it('should call api.patch with reactivate endpoint', async () => {
      registerSubscriptionTools(mockServer);
      const handler = registeredTools['reactivate_subscription'];

      (apiClient.patch as any).mockResolvedValue({ id: 'sub_1', active: true });

      const result = await handler({ id: 'sub_1' });

      expect(apiClient.patch).toHaveBeenCalledWith('/subscriptions/sub_1/reactivate', {});
      expect(result.content[0].text).toContain('Subscription reactivated');
    });
  });
});