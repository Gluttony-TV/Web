import { prefetchQueries } from 'apollo/server'
import Link from 'components/Link'
import Page from 'components/Page'
import { Title } from 'components/Text'
import UserIcon from 'components/UserIcon'
import { UsersDocument, useUsersQuery } from 'generated/graphql'
import { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async ctx => {
   return prefetchQueries(ctx, async client => {
      await client.query({ query: UsersDocument })
   })
}

const Users: NextPage = () => {
   const { data } = useUsersQuery()

   return (
      <Page>
         <Title>Users</Title>
         {data?.users.map(user => (
            <Link key={user.id} href={`/users/${user.id}`}>
               {user.name}
               <UserIcon user={user} size={100} />
            </Link>
         ))}
      </Page>
   )
}

export default Users