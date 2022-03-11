import { GetServerSideProps, NextPage } from 'next'
import Link from '../../components/Link'
import Page from '../../components/Page'
import { Title } from '../../components/Text'
import UserIcon from '../../components/UserIcon'
import useResource from '../../hooks/api/useResource'
import { serialize, Serialized } from '../../lib/database'
import User, { IUser } from '../../models/User'

interface Props {
   users: Serialized<IUser>[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
   const users = await User.find({ 'settings.visibility.profile': true })
   return { props: serialize({ users }) }
}

const Users: NextPage<Props> = props => {
   const { data: users } = useResource<Serialized<IUser>[]>('user', { initialData: props.users })

   return (
      <Page>
         <Title>Users</Title>
         {users?.map(user => (
            <Link key={user.id} href={`/users/${user.id}`}>
               {user.name}
               <UserIcon {...user} size={100} />
            </Link>
         ))}
      </Page>
   )
}

export default Users
