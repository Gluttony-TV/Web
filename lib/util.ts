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
