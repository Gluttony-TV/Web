import Cache from 'node-cache'

const stdTTL = 600

export default async function cacheOr<T>(key: string, supplier: () => T | Promise<T>, ttl = stdTTL): Promise<T> {
   global.cache = global.cache ?? new Cache({ stdTTL })
   const promiseKey = `${key}#promise`

   const cached = global.cache.get<T>(key) ?? global.cache.get<Promise<T>>(promiseKey)
   if (cached) return cached

   const supplied = supplier()
   global.cache.set(promiseKey, supplied, ttl)

   try {
      const result = await supplied
      global.cache.set(key, result, ttl)
      return supplied
   } finally {
      global.cache.del(promiseKey)
   }
}

export function invalidate(key: string) {
   if (global.cache) {
      global.cache.del(key)
   }
}

export function cache(key: string, value: unknown) {
   global.cache.set(key, value)
}
