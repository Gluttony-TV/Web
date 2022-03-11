import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { ButtonLink } from '../../../components/Button'
import Page from '../../../components/Page'
import { Title } from '../../../components/Text'
import useResource from '../../../hooks/api/useResource'
import { serialize, Serialized } from '../../../lib/database'
import User, { IUser } from '../../../models/User'

interface Props {
   user: Serialized<IUser>
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
   const id = ctx.query.id as string
   const user = await User.findOne({ _id: id, 'settings.visibility.profile': true })
   if (!user) return { notFound: true }
   return { props: serialize({ user }) }
}

const Users: NextPage<Props> = props => {
   const { id } = useRouter().query
   const { data: user } = useResource<Serialized<IUser>>(`user/${id}`, { initialData: props.user })

   return (
      <Page>
         <Title>{user?.name}</Title>
         <ButtonLink href={`/users/${id}/watched`} disabled={!user?.settings?.visibility?.progress}>
            Watched
         </ButtonLink>
      </Page>
   )
}

export default Users
