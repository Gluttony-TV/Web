import 'next'

declare module 'next' {
   interface GetServerSidePropsResult {
      props: {
         initialApolloState?: unknown
      }
   }
}
