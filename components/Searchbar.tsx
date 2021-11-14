import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { lighten } from 'polished'
import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import styled from 'styled-components'
import useFetch from '../hooks/useFetch'
import { useRouterEvent } from '../hooks/useRouterEvent'
import useTranslation from '../hooks/useTranslation'
import { IShow } from '../models'
import { Input } from './Inputs'
import Link from './Link'

const Searchbar: FC<{ preFetch?: boolean }> = ({ children, preFetch = false }) => {
   const [search, setSearch] = useState('')
   const router = useRouter()
   const debouncedSearch = useMemo(() => debounce(setSearch, 300), [setSearch])
   const [value, setValue] = useReducer((_: string, v: string) => {
      debouncedSearch(v)
      return v
   }, search)

   const { data: results } = useFetch<IShow[]>(`/show?limit=20&search=${search}`, { enabled: preFetch && search.length > 0 })
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
      [setSearch]
   )

   return (
      <Style>
         <SearchInput onKeyPress={key} type='text' placeholder='Search...' value={value} onChange={setValue} />
         <Dropdown>
            {children}
            {visible &&
               results?.map(show => (
                  <Link key={show.id} href={`/show/${show.tvdb_id}`}>
                     <li>{useTranslation(show.name, show.translations)}</li>
                  </Link>
               ))}
         </Dropdown>
      </Style>
   )
}

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

const SearchInput = styled(Input)`
   padding-left: 5rem;
   padding: 1rem;
   height: 100%;
   margin: 0 0.5rem;
   width: 40vw;
`

export default Searchbar
