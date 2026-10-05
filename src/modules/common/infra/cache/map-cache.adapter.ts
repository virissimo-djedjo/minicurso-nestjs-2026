import { CachePort } from '../../application/ports/cache.port';

export class MapCacheAdapter implements CachePort {
  private readonly values = new Map<string, unknown>();

  public async get<T>(key: string): Promise<T | null> {
    return (this.values.get(key) as T | undefined) ?? null;
  }

  public async set<T>(key: string, value: T): Promise<void> {
    this.values.set(key, value);
  }
}
