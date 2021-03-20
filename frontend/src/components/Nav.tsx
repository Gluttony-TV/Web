/** @jsxImportSource @emotion/react */
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Question } from '@styled-icons/fa-solid';
import { lighten } from "polished";
import { FC, useMemo } from "react";
import { matchRoutes } from "react-router-config";
import { Link, match, useLocation } from "react-router-dom";
import { useStatus } from "../api/status";
import routes, { Route } from "../routes";

const NavBar: FC = () => {
   const [status] = useStatus()
   const { pathname } = useLocation()

   const [{ match }] = useMemo(() => matchRoutes(routes[status], pathname), [pathname, status])

   const links = routes[status].filter(r => r.display).reverse()

   return <Nav>
      {links.map(route =>
         <Tab key={route.path} {...route} match={match} />
      )}
   </Nav>
}

const Tab: FC<Route & {
   match: match
}> = ({ display, path, match, right }) => {
   const theme = useTheme()

   const active = match.path === path
   const icon = typeof display !== 'string'

   const base = active ? theme.primary : lighten(0.1, theme.bg)

   const style = css`
      text-decoration: none;
      color: ${theme.text};
      padding: ${icon ? '0 1.2rem' : '1.2rem 2rem'};
      height: 100%;
      display: grid;
      align-items: center;
      justify-self: ${right ? 'end' : 'start'};

      background: ${base};

      &:hover {
         background: ${lighten(0.1, base)}
      }
   `

   return <Link key={path} to={path} css={style} >
      {icon ? jsx(display ?? Question, { size: '2rem' }) : display}
   </Link>
}

const Nav = styled.nav`
   background: ${p => lighten(0.1, p.theme.bg)};
   display: grid;
   grid-auto-flow: column;
   justify-content: start;
   align-items: center;
`

export default NavBar