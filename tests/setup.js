import { vi } from 'vitest';
// Define the global fetch if not already (Vitest/Node should have it, but for explicit typing)
global.fetch = vi.fn();
export const mockFetch = global.fetch;
export function resetMocks() {
    mockFetch.mockReset();
}
// Basic mocks for config to ensure tests don't fail on missing env
vi.mock('../src/config.js', () => ({
    config: {
        QUANTIX_API_URL: 'https://test-api.quantix.com',
        QUANTIX_API_KEY: 'test-key',
        MCPPORT: '3000',
        NODE_ENV: 'test'
    }
}));
//# sourceMappingURL=setup.js.map