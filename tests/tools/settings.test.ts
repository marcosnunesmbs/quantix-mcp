import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerSettingsTools } from '../../src/tools/settings.js';
import { apiClient } from '../../src/services/apiClient.js';
import { ApiClientError } from '../../src/services/apiClient.js';

vi.mock('../../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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

describe('Settings Tools', () => {
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

  it('should register all settings tools', () => {
    registerSettingsTools(mockServer);
    expect(mockServer.registerTool).toHaveBeenCalledTimes(3);
    expect(registeredTools['create_settings']).toBeDefined();
    expect(registeredTools['get_settings']).toBeDefined();
    expect(registeredTools['update_settings']).toBeDefined();
  });

  describe('create_settings', () => {
    it('should create settings', async () => {
      registerSettingsTools(mockServer);
      const handler = registeredTools['create_settings'];
      (apiClient.post as any).mockResolvedValue({ userName: 'Alice', language: 'en-US', currency: 'USD' });

      const input = { userName: 'Alice', language: 'en-US', currency: 'USD' };
      const result = await handler(input);

      expect(apiClient.post).toHaveBeenCalledWith('/settings', input);
      expect(result.content[0].text).toContain('Settings created');
    });

    it('should return API error on failure', async () => {
      registerSettingsTools(mockServer);
      const handler = registeredTools['create_settings'];
      (apiClient.post as any).mockRejectedValue(new ApiClientError('fail', 409, 'Conflict'));

      const result = await handler({ userName: 'Alice', language: 'en-US', currency: 'USD' });

      expect(result.content[0].text).toMatch(/^API error 409/);
    });
  });

  describe('get_settings', () => {
    it('should get settings', async () => {
      registerSettingsTools(mockServer);
      const handler = registeredTools['get_settings'];
      (apiClient.get as any).mockResolvedValue({ userName: 'Alice', language: 'en-US', currency: 'USD' });

      const result = await handler({});

      expect(apiClient.get).toHaveBeenCalledWith('/settings');
      expect(result.content[0].text).toContain('Alice');
    });

    it('should return API error on failure', async () => {
      registerSettingsTools(mockServer);
      const handler = registeredTools['get_settings'];
      (apiClient.get as any).mockRejectedValue(new ApiClientError('fail', 404, 'Not Found'));

      const result = await handler({});

      expect(result.content[0].text).toMatch(/^API error 404/);
    });
  });

  describe('update_settings', () => {
    it('should update settings', async () => {
      registerSettingsTools(mockServer);
      const handler = registeredTools['update_settings'];
      (apiClient.put as any).mockResolvedValue({ userName: 'Bob', language: 'pt-BR', currency: 'BRL' });

      const input = { userName: 'Bob' };
      const result = await handler(input);

      expect(apiClient.put).toHaveBeenCalledWith('/settings', input);
      expect(result.content[0].text).toContain('Settings updated');
    });

    it('should return API error on failure', async () => {
      registerSettingsTools(mockServer);
      const handler = registeredTools['update_settings'];
      (apiClient.put as any).mockRejectedValue(new ApiClientError('fail', 500, 'Internal Server Error'));

      const result = await handler({ userName: 'Bob' });

      expect(result.content[0].text).toMatch(/^API error 500/);
    });
  });
});
