/** @jsxImportSource @emotion/react */
import { css, jsx, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Question } from '@styled-icons/fa-solid';
import { lighten } from "polished";
import { FC, useEffect, useMemo, useState } from "react";
import { matchRoutes } from "react-router-config";
import { Link, match, useLocation } from "react-router-dom";
import { useFetch } from "../api/hooks";
import { IShow } from "../api/models";
import { useStatus } from "../api/status";
import routes, { Route } from "../routes";
import Searchbar from "./Searchbar";

const NavBar: FC = () => {
   const [status] = useStatus()
   const { pathname } = useLocation()

   const [{ match }] = useMemo(() => matchRoutes(routes[status], pathname), [pathname, status])
   const [home, ...links] = routes[status].filter(r => r.display).reverse()

   const [search, setSearch] = useState('')
   const [results] = useFetch<IShow[]>('show', { search, limit: 20 }, search.length > 0)
   const [visible, setVisible] = useState(false)

   useEffect(() => setVisible(!!results), [results, setVisible])

   useEffect(() => setVisible(false), [pathname])

   return <Nav>
      {home && <Tab {...home} match={match} />}

      <Searchbar onChange={setSearch}>
         {visible && results?.map(show =>
            <Link key={show.id} to={`/shows/${show.tvdb_id}`}>
               <li>{show.name}</li>
            </Link>
         )}
      </Searchbar>

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
      padding: ${icon ? '0 1.2rem' : '1.2rem 2rem'};
      height: 100%;
      display: grid;
      align-items: center;
      justify-self: ${right ? 'end' : 'start'};

      background: ${base};

      &, &:visited {
         color: ${theme.text};
      }

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