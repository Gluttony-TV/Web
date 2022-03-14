import { initializeApollo } from 'apollo/client'
import Link from 'components/Link'
import Page from 'components/Page'
import { Title } from 'components/Text'
import UserIcon from 'components/UserIcon'
import { useUsersQuery } from 'generated/client'
import { BaseUserFragment, UsersDocument } from 'generated/server'
import { Serialized } from 'lib/database'
import { GetServerSideProps, NextPage } from 'next'

interface Props {
   users: Serialized<BaseUserFragment>[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
   const client = initializeApollo()
   const { data } = await client.query({ query: UsersDocument })
   const users = data?.users ?? []
   return { props: { users } }
}

const Users: NextPage<Props> = () => {
   const { data } = useUsersQuery()

   return (
      <Page>
         <Title>Users</Title>
         {data?.users.map(user => (
            <Link key={user.id} href={`/users/${user.id}`}>
               {user.name}
               <UserIcon {...user} size={100} />
            </Link>
         ))}
      </Page>
   )
}

export default Users
