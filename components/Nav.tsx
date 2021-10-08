
import { Question } from '@styled-icons/fa-solid';
import { lighten } from "polished";
import { createElement, FC } from 'react';
import styled, { useTheme } from "styled-components";
import Link from './Link';
import Searchbar from "./Searchbar";

const NavBar: FC = () => {

   const pages: Page[] = [
      {
         display: '',
         path: '/',
      },
      {
         display: 'Profile',
         path: '/profile',
      }
   ]

   const [home, ...links] = pages.map(p => ({
      ...p, active: false
   }))

   return <Nav>
      {home && <Tab {...home} />}

      <Searchbar />

      {links.map(route =>
         <Tab key={route.path} {...route} />
      )}
   </Nav>
}

interface Page {
   display: string
   path: string
   active?: boolean
   right?: boolean
}

const Tab: FC<Page> = ({ display, path, active, ...props }) => {
   const theme = useTheme()

   const icon = typeof display !== 'string'
   const base = active ? theme.primary : lighten(0.1, theme.bg)

   return <TabLink key={path} href={path} base={base} {...props}>
      {icon ? createElement(display ?? Question, { size: '2rem' }) : display}
   </TabLink>
}

const TabLink = styled(Link) <{ base: string, right?: boolean, icon?: boolean }>`
   text-decoration: none;
   padding: ${p => p.icon ? '0 1.2rem' : '1.2rem 2rem'};
   height: calc(100% + 8px);
   display: grid;
   align-items: center;
   justify-self: ${p => p.right ? 'end' : 'start'};

   background: ${p => p.base};
   border-bottom: solid 4px ${p => lighten(0.2, p.base)};

   &, &:visited {
      color: ${p => p.theme.text};
   }

   &:hover {
      background: ${p => lighten(0.1, p.base)};
      border-bottom: solid 4px ${p => lighten(0.2, p.base)};
   }
`

const Nav = styled.nav`
   background: ${p => lighten(0.1, p.theme.bg)};
   border-bottom: solid 4px ${p => lighten(0.3, p.theme.bg)};
   display: grid;
   grid-auto-flow: column;
   justify-content: start;
   align-items: center;
`

export default NavBar