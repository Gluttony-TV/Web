import { NextPage } from 'next'
import Page from '../../components/Page'
import { Title } from '../../components/Text'
import useResource from '../../hooks/api/useResource'
import { IUser } from '../../models/User'

interface Props {
   users: IUser[]
}

const Users: NextPage<Props> = props => {
   const { data: users } = useResource<IUser[]>('user', { initialData: props.users })

   return (
      <Page>
         <Title>Users</Title>
         <pre>{JSON.stringify(users, null, 2)}</pre>
      </Page>
   )
}

export default Users
