import { DateTime } from 'luxon'
import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import Page from '../../../components/Page'
import Select from '../../../components/Select'
import ShowTitle from '../../../components/show/Title'
import { useEpisodesInfo } from '../../../hooks/useEpisodesInfo'
import { striped } from '../../../style/styles'
import { Props } from '../[id]'
export { getServerSideProps } from '../[id]'

const Show: NextPage<Props> = ({ show, ...props }) => {
   const { percentage, seasons } = useEpisodesInfo(props)
   const [season, setSeason] = useState<string>()
   const visible = useMemo(() => {
      if (season) return seasons.filter(s => s.number === season)
      return seasons
   }, [seasons, season])

   return (
      <Style>
         <ShowTitle {...show} percentage={percentage} />

         <label htmlFor='season-select'>Season</label>
         <Select
            id='season-select'
            values={[
               { display: 'All', value: undefined },
               ...seasons.map(({ number }) => ({ value: number, display: `Season ${number}` })),
            ]}
            value={season}
            onChange={setSeason}
         />

         <div>
            {visible?.map(({ episodes, number }, i) => (
               <Season key={i}>
                  <h4>Season {number}</h4>
                  {episodes.map(e => (
                     <Episode key={e.id} watched={e.watched} due={e.due}>
                        {console.log(e)}
                        <span>{e.name}</span>
                        <span>{e.aired && DateTime.fromISO(e.aired).toLocaleString()}</span>
                     </Episode>
                  ))}
               </Season>
            ))}
         </div>
      </Style>
   )
}

const Episode = styled.li<{ watched?: boolean; due?: boolean }>`
   padding: 0.5rem;
   display: grid;
   grid-auto-flow: column;
   justify-content: space-between;

   ${p =>
      p.watched &&
      css`
         background: ${p => p.theme.primary};
      `}

   ${p =>
      p.due &&
      css`
         ${striped(p.theme.secondary, { width: 25, deg: 40 })};
         &:nth-child(2n + 1) {
            background-position-x: 40px;
         }
      `};
`

const Season = styled.ul`
   margin-top: 2rem;
   list-style: none;
`

const Style = styled(Page)`
   grid-template:
      'title'
      'seasons';
`

export default Show
