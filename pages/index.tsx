import { signIn, useSession } from 'next-auth/react'
import { FC } from 'react'
import { LinkButton } from '../components/Link'
import Page from '../components/Page'
import { Colored, Title } from '../components/Text'

const Home: FC = () => {
   const { data: session } = useSession()
   const { status } = useSession()

   if (status === 'authenticated')
      return (
         <Page>
            <Title>
               Welcome <Colored>{session?.user.name}</Colored>
            </Title>
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
