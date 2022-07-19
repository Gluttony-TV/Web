import { CookieBite } from '@styled-icons/fa-solid/CookieBite'
import { Question } from '@styled-icons/fa-solid/Question'
import { StyledIcon } from '@styled-icons/styled-icon'
import Link from 'components/Link'
import LoadingIndicator from 'components/LoadingIndicator'
import Searchbar from 'components/Searchbar'
import { useRouterEvent } from 'hooks/useRouterEvent'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { lighten } from 'polished'
import { createElement, FC, useState } from 'react'
import styled, { css } from 'styled-components'
import NavDropdown from './NavDropdown'

export const NavHeight = '5rem'
const LoadingBarHeight = '1rem'

const NavBar: FC = () => {
   const [loading, setLoading] = useState(false)
   useRouterEvent('routeChangeStart', () => setLoading(true))
   useRouterEvent('routeChangeComplete', () => setLoading(false))
   const { status } = useSession()

   return (
      <Wrapper>
         <Nav>
            <Tab display={CookieBite} path='/' />
            <Searchbar />
            {status === 'authenticated' && <LoggedIn />}
            {status === 'unauthenticated' && <LoggedOut />}
            <NavDropdown />
         </Nav>
         <LoadingIndicator visible={loading} height={LoadingBarHeight} />
      </Wrapper>
   )
}

const LoggedIn: FC = () => (
   <>
      <Tab display='Watched' path='/watched' />
      <Tab display='News' path='/news' />
      <Tab display='Stats' path='/stats' />
   </>
)

const LoggedOut: FC = () => <></>

const Wrapper = styled.section`
   height: ${NavHeight};
`

const Tab: FC<{
   display: string | StyledIcon
   path: string
   right?: boolean
}> = ({ display, path, ...props }) => {
   const router = useRouter()
   const active = router.asPath === path

   const icon = typeof display !== 'string'

   return (
      <TabLink key={path} href={path} active={active} icon={icon} {...props}>
         {icon ? createElement(display ?? Question, { size: '2rem' }) : display}
      </TabLink>
   )
}

const TabStyle = (color: string) => css`
   background: ${color};
   border-bottom: solid 4px ${lighten(0.2, color)};
   &,
   &:visited {
      color: ${p => p.theme.text};
   }

   &:hover {
      background: ${lighten(0.1, color)};
      border-bottom: solid 4px ${lighten(0.2, color)};
   }
`

const TabLink = styled(Link)<{ active?: boolean; right?: boolean; icon?: boolean }>`
   text-decoration: none;
   padding: ${p => (p.icon ? '0 1.2rem' : '1.2rem 2rem')};
   height: calc(${NavHeight} - ${LoadingBarHeight});
   display: grid;
   align-items: center;
   justify-self: ${p => (p.right ? 'end' : 'start')};
   transition: background 0.4s ease;

   ${p => TabStyle(p.active ? p.theme.primary : lighten(0.1, p.theme.bg))};
`

const Nav = styled.nav`
   background: ${p => lighten(0.1, p.theme.bg)};
   border-bottom: solid 4px ${p => lighten(0.3, p.theme.bg)};
   display: grid;
   grid-auto-flow: column;
   justify-content: start;
   align-items: center;
   height: calc(${NavHeight} - ${LoadingBarHeight});
`

export default NavBar
