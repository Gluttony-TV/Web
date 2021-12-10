import { signIn, useSession } from 'next-auth/react'
import { FC } from 'react'
import { LinkButton } from '../components/Link'
import Page from '../components/Page'
import { Title } from '../components/Text'
import useStatus from '../hooks/useStatus'
import { AppStatus } from '../models'

const Home: FC = () => {
   const { data: session } = useSession()
   const status = useStatus()

   if (status === AppStatus.LOGGED_IN)
      return (
         <Page>
            <Title>Welcome {session?.user.email}!</Title>
         </Page>
      )
   else
      return (
         <Page>
            <LinkButton onClick={() => signIn()}>Login</LinkButton>
         </Page>
      )
}

export default Home
