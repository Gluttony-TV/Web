import { prefetchQueries } from 'apollo/server'
import { ButtonLink } from 'components/Button'
import Page from 'components/Page'
import { Title } from 'components/Text'
import { UserDocument, useUserQuery } from 'generated/graphql'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
   return prefetchQueries({ req }, async client => {
      await client.query({ query: UserDocument, variables: { id: query.id as string } })
   })
}

const Users: NextPage = () => {
   const router = useRouter()
   const id = router.query.id as string
   const { data } = useUserQuery({ variables: { id } })

   if (!data) return <p>loading...</p>

   return (
      <Page>
         <Title>{data.user.name}</Title>
         <p>{data.user.email}</p>
         <ButtonLink href={`/users/${id}/watched`} disabled={!data?.user?.settings?.visibility?.progress}>
            Watched
         </ButtonLink>
      </Page>
   )
}

export default Users
