import { Dev, Discord, Github, Google } from '@styled-icons/fa-brands'
import { Plug } from '@styled-icons/fa-solid'
import { StyledIcon, StyledIconProps } from '@styled-icons/styled-icon'
import { prefetchQueries } from 'apollo/server'
import { LinkButton } from 'components/Link'
import Page from 'components/Page'
import { Title } from 'components/Text'
import { SelfDocument, useSelfQuery } from 'generated/graphql'
import useTooltip from 'hooks/useTooltip'
import { loginLink } from 'lib/util'
import { DateTime } from 'luxon'
import { GetServerSideProps, NextPage } from 'next'
import { getSession, signOut } from 'next-auth/react'
import { transparentize } from 'polished'
import { createElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

export const getServerSideProps: GetServerSideProps = async ctx => {
   const session = await getSession(ctx)
   if (!session) return loginLink(ctx)
   return prefetchQueries(ctx, async client => {
      await client.query({ query: SelfDocument })
   })
}

const ICONS: Record<string, StyledIcon | undefined> = {
   github: Github,
   google: Google,
   discord: Discord,
}

const Profile: NextPage = () => {
   useTooltip()
   const { data } = useSelfQuery()

   if (!data) return <p>Loading...</p>

   const created = DateTime.fromMillis(data.user.joinedAt)

   return (
      <Page>
         <Title>
            <FormattedMessage description='Profile page title' defaultMessage='Your Profile' />
         </Title>
         <Panels>
            <BigPanel>
               <label htmlFor='username'>Username</label>
               <p id='username'>{data.user.name}</p>
            </BigPanel>

            {data.user.email && (
               <>
                  <Panel>
                     <label htmlFor='email'>E-Mail</label>
                     <p id='email'>{data.user.email ?? 'No email provided'}</p>
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
                  {data.user.seeded && <Dev size='1em' data-tip='Development User' />}
                  {data.user.accounts.map(({ provider, id }) =>
                     createElement(ICONS[provider] ?? Plug, {
                        'data-tip': provider,
                        key: id,
                        size: '1em',
                     } as StyledIconProps)
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
