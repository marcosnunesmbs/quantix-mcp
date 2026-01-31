import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerSummaryTools } from '../../src/tools/summary.js';
import { apiClient } from '../../src/services/apiClient.js';
vi.mock('../../src/services/apiClient.js', () => ({
    apiClient: {
        get: vi.fn(),
    }
}));
describe('Summary Tools', () => {
    let mockServer;
    let registeredTools = {};
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
            apiClient.get.mockResolvedValue({ income: 1000 });
            await handler({ month: '2026-03' });
            expect(apiClient.get).toHaveBeenCalledWith('/summary?month=2026-03');
        });
    });
});
//# sourceMappingURL=summary.test.js.map