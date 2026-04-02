import { Redis } from '@upstash/redis'
export const redis = Redis.fromEnv(); // ✅ Correct


await redis.set("foo", "bar");
await redis.get("foo");