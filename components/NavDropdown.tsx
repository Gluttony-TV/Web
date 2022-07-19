import { useRouterEvent } from 'hooks/useRouterEvent'
import { signIn, useSession } from 'next-auth/react'
import { darken } from 'polished'
import { FC, useState } from 'react'
import ClickAway from 'react-click-away-listener'
import styled from 'styled-components'
import Link, { LinkButton } from './Link'
import UserIcon from './UserIcon'

const NavDropdown: FC = () => {
   const { data: session } = useSession()
   const [visible, setVisible] = useState(false)

   useRouterEvent('routeChangeStart', () => setVisible(false))

   if (!session)
      return (
         <Style>
            <LinkButton onClick={() => signIn()}>Login</LinkButton>
         </Style>
      )

   return (
      <ClickAway onClickAway={() => setVisible(false)}>
         <Style>
            <Icon role='button' onClick={() => setVisible(v => !v)} user={session.user} size='2em' />
            {visible && (
               <Dropdown>
                  <Link underline='hover' href='/profile'>
                     Profile
                  </Link>
                  <Link underline='hover' href='/settings'>
                     Settings
                  </Link>
               </Dropdown>
            )}
         </Style>
      </ClickAway>
   )
}

const Dropdown = styled.div`
   background: ${p => darken(0.05, p.theme.bg)};
   border: solid 1px ${p => darken(0.1, p.theme.bg)};
   border-radius: 0.5em;

   position: absolute;
   right: -1em;
   top: 120%;
   z-index: 555;

   text-align: center;
   padding: 1em 2em;
   display: grid;
   gap: 0.5em;

   &::after {
      content: '';
      position: absolute;
      top: -1em;
      right: 1.5em;
      border: solid 0.5em transparent;
      border-bottom-color: ${p => darken(0.05, p.theme.bg)};
   }
`

const Icon = styled(UserIcon)`
   border-radius: 9999px;
   cursor: pointer;
`

const Style = styled.div`
   position: relative;
   justify-self: end;
`

export default NavDropdown
