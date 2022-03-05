import Cache from 'node-cache'

const stdTTL = 600

export default async function cacheOr<T>(key: string, supplier: () => T | Promise<T>, ttl = stdTTL): Promise<T> {
   global.cache = global.cache ?? new Cache({ stdTTL })
   const promise = `${key}#promise`

   const cached = global.cache.get<T>(key) ?? global.cache.get<Promise<T>>(promise)
   if (cached) return cached

   const supplied = supplier()
   global.cache.set(promise, supplied, ttl)
   const result = await supplied

   global.cache.set(key, result, ttl)

   return supplied
}

export function invalidate(key: string) {
   if (global.cache) {
      global.cache.del(key)
   }
}

export function cache(key: string, value: unknown) {
   global.cache.set(key, value)
}
