import { describe, it, expect, vi } from 'vitest';
import { getServer } from '../src/index.js';

describe('Server Startup', () => {
  it('should initialize McpServer', () => {
    const server = getServer();
    expect(server).toBeDefined();
    // expect(server.server.name).toBe('quantix_mcp_server'); 
  });

  // Since we can't easily inspect registered tools without private access or running it, 
  // we'll mainly check it doesn't crash on init.
  // With McpServer from SDK, we might be able to check capabilities or similar if exposed.
});
