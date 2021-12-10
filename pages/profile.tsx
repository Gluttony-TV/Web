import { Github } from '@styled-icons/fa-brands'
import { DateTime } from 'luxon'
import { GetServerSideProps, NextPage } from 'next'
import { User } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'
import { transparentize } from 'polished'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkButton } from '../components/Link'
import Page from '../components/Page'
import { Title } from '../components/Text'
import { loginLink } from '../lib/util'

export const getServerSideProps: GetServerSideProps<User> = async req => {
   const session = await getSession(req)
   if (!session) return loginLink(req)
   return { props: session.user }
}

const Profile: NextPage<User> = ({ name, email, provider }) => {
   const created = DateTime.now()

   return (
      <Page>
         <Title>
            <FormattedMessage description='Profile page title' defaultMessage='Your Profile' />
         </Title>
         <Panels>
            <BigPanel>
               <label htmlFor='username'>Username</label>
               <p id='username'>{name}</p>
            </BigPanel>

            {email && (
               <>
                  <Panel>
                     <label htmlFor='email'>E-Mail</label>
                     <p id='email'>{email ?? 'No email provided'}</p>
                  </Panel>
               </>
            )}

            <Panel>
               <label htmlFor='created-at'>Joined at</label>
               <p id='created-at'>
                  {created.toLocaleString()} ({created.toRelative()})
               </p>
            </Panel>

            <Panel>
               <label htmlFor='connections'>Connections</label>
               <Icons id='connections'>{provider && <Github />}</Icons>
            </Panel>

            <LinkButton onClick={() => signOut()}>Logout</LinkButton>
         </Panels>
      </Page>
   )
}

const Panels = styled.section`
   display: grid;
   gap: 2rem;
   grid-template: repeat(1fr, 2);
`

const Icons = styled.ul`
   display: grid;
   grid-auto-flow: column;
   justify-content: center;
   gap: 0.6rem;
   padding: 0.6rem;
`

const Panel = styled.div`
   text-align: center;
   display: grid;
   gap: 0.5rem;
   padding: 1rem;
   border-radius: 10px;
   background: ${p => transparentize(0.9, p.theme.secondary)};

   &:hover {
      background: ${p => transparentize(0.85, p.theme.secondary)};
   }

   label {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
   }
`

const BigPanel = styled(Panel)`
   grid-column: 1 / 3;
`

export default Profile
