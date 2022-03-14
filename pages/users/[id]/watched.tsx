import Page from 'components/Page'
import { Title } from 'components/Text'
import useResource from 'hooks/api/useResource'
import { serialize } from 'lib/database'
import Progress, { IProgress, withShows } from 'models/Progresses'
import { IShow } from 'models/Shows'
import User, { IUser } from 'models/Users'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

interface Props {
   user: IUser
   watched: IProgress<IShow>[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
   const id = ctx.query.id as string
   const user = await User.findOne({ _id: id, 'settings.visibility.profile': true })
   if (!user) return { notFound: true }

   if (!user.settings.visibility.progress) return { notFound: true }

   const progresses = await Progress.find({ userId: id })
   const watched = await withShows(progresses)

   return { props: serialize({ user, watched }) }
}

const Users: NextPage<Props> = ({ watched, ...props }) => {
   const { id } = useRouter().query
   const { data: user } = useResource<IUser>(`user/${id}`, { initialData: props.user })

   return (
      <Page>
         <Title>{user?.name}</Title>
         <div>
            {watched.map(({ show, watched }) => (
               <p key={show.id}>
                  {show.name} {watched.length}
               </p>
            ))}
         </div>
      </Page>
   )
}

export default Users
