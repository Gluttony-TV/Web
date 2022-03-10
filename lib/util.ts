import { GetServerSidePropsContext } from 'next'

export function exists<T>(t: T | null | undefined): t is T {
   return (t ?? null) !== null
}

export async function loginLink(_req: GetServerSidePropsContext) {
   return {
      redirect: {
         destination: `/api/auth/signin`,
         permanent: false,
      },
   }
}

export function env(key: string) {
   const value = process.env[key]
   if (value) return value
   throw new Error(`Please define the ${key} environment variable inside .env.local`)
}

export type DeepPartial<T> = {
   [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
}
