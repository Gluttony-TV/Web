import Cache from 'node-cache'

const stdTTL = process.env.NODE_ENV === 'development' ? 60 : 600

export default async function cacheOr<T>(
   key: string,
   supplier: () => T | Promise<T>,
   additionalKeys?: (t: NonNullable<T>) => string[]
): Promise<T> {
   global.cache = global.cache ?? new Cache({ stdTTL })
   const promise = `${key}#promise`

   const cached = global.cache.get<T>(key) ?? global.cache.get<Promise<T>>(promise)
   if (cached) return cached

   const supplied = supplier()
   global.cache.set(promise, supplied)
   const result = await supplied

   global.cache.set(key, result)
   if (result) additionalKeys?.(result as NonNullable<T>).map(k => global.cache.set(k, result))

   return supplied
}

export function invalidate(key: string) {
   if (global.cache) {
      global.cache.del(key)
   }
}
