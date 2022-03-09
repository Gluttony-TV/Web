import { Discord, Github, Google } from '@styled-icons/fa-brands'
import { Plug } from '@styled-icons/fa-solid'
import { DateTime } from 'luxon'
import { GetServerSideProps, NextPage } from 'next'
import { User } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'
import { transparentize } from 'polished'
import { createElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkButton } from '../components/Link'
import Page from '../components/Page'
import { Title } from '../components/Text'
import { serialize } from '../lib/database'
import { loginLink } from '../lib/util'
import Account, { IAccount } from '../models/Account'

type Props = User & { accounts: IAccount[] }

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   const session = await getSession(req)
   if (!session) return loginLink(req)

   const accounts = await Account.find({ userId: session.user.id })

   return { props: serialize({ ...session.user, accounts }) }
}

const ICONS = {
   github: Github,
   google: Google,
   discord: Discord,
}

const Profile: NextPage<Props> = ({ name, email, accounts }) => {
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
               <Icons id='connections'>
                  {accounts.map(({ provider, providerAccountId }) =>
                     createElement(ICONS[provider] ?? Plug, {
                        key: `${provider}-${providerAccountId}`,
                        size: '1em',
                        title: provider,
                     })
                  )}
               </Icons>
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
   gap: 0.6em;
   font-size: 1.5em;
   padding: 0.6em;
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
