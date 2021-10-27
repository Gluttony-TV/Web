import { debounce } from 'lodash'
import { lighten } from 'polished'
import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useFetch from '../hooks/useFetch'
import { useRouterEvent } from '../hooks/useRouterEvent'
import { IShow } from '../models'
import { InputStyles } from './Inputs'
import Link from './Link'
import ShowName from './ShowName'

const Searchbar: FC = ({ children }) => {
   const [search, setSearch] = useState('')
   const { data: results } = useFetch<IShow[]>(`/show?limit=20&search=${search}`, undefined, { enabled: search.length > 0 })
   const [visible, setVisible] = useState(false)

   useEffect(() => setVisible(!!results), [results, setVisible])
   useRouterEvent('routeChangeStart', () => setVisible(false))

   const onInput = useMemo(() => debounce(setSearch, 300), [setSearch])

   const key = useCallback(
      (e: KeyboardEvent) => {
         if (e.code === 'Enter') setSearch?.(v => v)
      },
      [setSearch]
   )

   return (
      <Style>
         <Input onKeyPress={key} type='text' placeholder='Search...' onChange={e => onInput?.(e.target.value)} />
         <Dropdown>
            {children}
            {visible &&
               results?.map(show => (
                  <Link key={show.id} href={`/show/${show.tvdb_id}`}>
                     <li>
                        <ShowName {...show} />
                     </li>
                  </Link>
               ))}
         </Dropdown>
      </Style>
   )
}

const Style = styled.div`
   position: relative;
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

const Input = styled.input`
   ${InputStyles};
   width: 40vw;
   padding-left: 5rem;
   padding: 1rem;
   margin: 0.5rem;
   height: calc(100% - 1.5rem);
`

export default Searchbar
