import { prefetchQueries } from 'apollo/server'
import Page from 'components/Page'
import { Title } from 'components/Text'
import { UserWatchedDocument, useUserWatchedQuery } from 'generated/graphql'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async ctx => {
   const id = ctx.query.id as string
   return prefetchQueries(ctx, async client => {
      await client.query({ query: UserWatchedDocument, variables: { id } })
   })
}

const Users: NextPage = () => {
   const id = useRouter().query.id as string
   const { data } = useUserWatchedQuery({ variables: { id } })

   return (
      <Page>
         <Title>{data?.user.name}</Title>
         <div>
            {data?.watched.map(({ show, watched }) => (
               <p key={show.id}>
                  {show.name} {watched.length}
               </p>
            ))}
         </div>
      </Page>
   )
}

export default Users
