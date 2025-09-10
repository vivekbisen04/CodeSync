// Cache utilities that work in all environments without Redis dependencies during build
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    // Always return null - no caching during build or development
    return null;
  },

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // No-op - no caching during build or development
    return;
  },

  async del(key: string): Promise<void> {
    // No-op - no caching during build or development
    return;
  },

  async exists(key: string): Promise<boolean> {
    // Always return false - no caching during build or development
    return false;
  },
};