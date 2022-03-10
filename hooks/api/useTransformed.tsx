import { useQuery } from 'react-query'
import useFetch, { RequestError } from './useFetch'
import { ResourceOptions } from './useResource'

export default function useTransformed<Response, Out>(
   url: string,
   transform: (data: Response) => Out,
   { key, query = {}, responseType, method, ...options }: ResourceOptions<Out> = {}
) {
   const fetcher = useFetch<Response>(url, { responseType, method, query })
   return useQuery<Out, RequestError, Out>(
      key || url,
      async () => {
         const result = await fetcher()
         if (transform) return transform(result)
         else return result as unknown as Out
      },
      options
   )
}
