import { describe, it, expect, vi } from 'vitest';
import { registerCategoryTools } from '../src/tools/categories.js';
import { apiClient } from '../src/services/apiClient.js';

vi.mock('../src/services/apiClient.js', () => ({
  apiClient: {
    get: vi.fn(),
  }
}));

describe('Performance Benchmark', () => {
    // This is a rough benchmark, mostly verifying it's not super slow due to overhead
    it('should execute tool handler with low overhead (<20ms)', async () => {
        const registeredTools: Record<string, Function> = {};
        const mockServer = {
            registerTool: (name: string, def: any, handler: Function) => {
                registeredTools[name] = handler;
            }
        };

        // Setup
        registerCategoryTools(mockServer as any);
        const handler = registeredTools['get_categories'];
        (apiClient.get as any).mockResolvedValue([]);

        // Warmup
        await handler({});

        // Measure
        const start = performance.now();
        await handler({});
        const end = performance.now();
        const duration = end - start;

        console.log(`Tool execution overhead: ${duration.toFixed(3)}ms`);
        expect(duration).toBeLessThan(20); 
    });
});
