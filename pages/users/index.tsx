import Button from 'components/Button'
import Link from 'components/Link'
import Page from 'components/Page'
import { Title } from 'components/Text'
import UserIcon from 'components/UserIcon'
import { prefetchQueries } from 'graphql/apollo/server'
import { useUsersQuery } from 'graphql/generated/hooks'
import { UsersDocument } from 'graphql/generated/server'
import { GetServerSideProps, NextPage } from 'next'
import styled from 'styled-components'

export const getServerSideProps: GetServerSideProps = async ctx => {
   return prefetchQueries(ctx, async client => {
      await client.query({ query: UsersDocument })
   })
}

const Users: NextPage = () => {
   const { data, fetchMore } = useUsersQuery()

   return (
      <Page noCentered>
         <Title>Users</Title>
         <p>{data?.users.totalCount} total users</p>
         <UserList>
            {data?.users.edges.map(({ node: user }) => (
               <Link key={user.id} href={`/users/${user.id}`}>
                  <li>
                     <UserIcon user={user} size={100} />
                     <span>{user.name}</span>
                  </li>
               </Link>
            ))}
         </UserList>
         <Button onClick={() => fetchMore({ variables: { after: data?.users.pageInfo.endCursor } })}>Load More</Button>
      </Page>
   )
}

const UserList = styled.ul`
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`

export default Users
