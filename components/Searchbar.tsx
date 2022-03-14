import { Input } from 'components/Inputs'
import Link from 'components/Link'
import { useSearchQuery } from 'generated/client'
import { useRouterEvent } from 'hooks/useRouterEvent'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { lighten } from 'polished'
import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import styled from 'styled-components'

const Searchbar: FC<{ preFetch?: boolean }> = ({ children, preFetch = false }) => {
   const [search, setSearch] = useState('')
   const router = useRouter()
   const debouncedSearch = useMemo(() => debounce(setSearch, 300), [setSearch])
   const [value, setValue] = useReducer((_: string, v: string) => {
      debouncedSearch(v)
      return v
   }, search)

   const { data } = useSearchQuery({
      skip: !preFetch || search.length === 0,
   })
   const results = data?.results

   const [visible, setVisible] = useState(false)

   useEffect(() => setVisible(!!results), [results, setVisible])
   useRouterEvent('routeChangeStart', () => {
      setSearch('')
      setVisible(false)
   })

   const key = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
         if (e.code === 'Enter') {
            router.push({
               pathname: '/search',
               query: { by: e.currentTarget.value },
            })
            setSearch?.(v => {
               return v
            })
         }
      },
      [setSearch, router]
   )

   return (
      <Style>
         <SearchInput onKeyPress={key} type='text' placeholder='Search...' value={value} onChange={setValue} />
         <Highlight />
         <Dropdown>
            {children}
            {visible &&
               results?.map(show => (
                  <Link key={show.id} href={`/show/${show.tvdb_id}`}>
                     <li>{show.name}</li>
                  </Link>
               ))}
         </Dropdown>
      </Style>
   )
}

const Highlight = styled.div`
   position: absolute;
   z-index: 1;
   width: 0;
   height: 0;
   background: ${p => p.theme.primary};
   left: 0;
   top: 100%;
   transition: height 0.1s linear, width 0.1s linear;

   input:focus-visible + & {
      transition: width 0.4s ease-out;
      height: 4px;
      width: 100%;
   }
`

const Style = styled.div`
   align-self: flex-start;
   position: relative;
   height: calc(100% - 4px);
   margin-right: 2rem;
`

const Dropdown = styled.ul`
   position: absolute;
   left: 10px;
   z-index: 2;
   list-style: none;
   min-width: 400px;

   box-shadow: 4px 8px 8px 0 #0002;

   border-bottom-left-radius: 20px;
   border-bottom-right-radius: 20px;

   background: ${p => lighten(0.15, p.theme.bg)};

   li {
      padding: 1rem;
   }
`

const SearchInput = styled(Input).attrs({ autoComplete: 'off' })`
   position: relative;
   padding-left: 5rem;
   padding: 1rem;
   height: 100%;
   width: 40vw;

   ::placeholder {
      color: ${p => lighten(0.5, p.theme.bg)};
   }

   outline: none !important;
   box-shadow: none !important;

   &:hover,
   &:focus-visible {
      background: ${p => lighten(0.3, p.theme.bg)};
   }
`

export default Searchbar
