import { prefetchQueries } from 'apollo/server'
import Page from 'components/Page'
import Select from 'components/Select'
import ShowTitle from 'components/show/Title'
import { Season, ShowDocument, useShowQuery } from 'generated/graphql'
import { DateTime } from 'luxon'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { striped } from 'style/styles'
import styled, { css } from 'styled-components'

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
   return prefetchQueries({ req }, async client => {
      await client.query({ query: ShowDocument, variables: { id: Number.parseInt(query.id as string) } })
   })
}

const EpisodesPage: NextPage = () => {
   const router = useRouter()
   const id = Number.parseInt(router.query.id as string)
   const { data } = useShowQuery({ variables: { id } })

   const [season, setSeason] = useState<Season['number']>()
   const visible = useMemo(() => {
      if (season) return data?.show.seasons.filter(s => s.number === season)
      return data?.show.seasons
   }, [data, season])

   if (!data) return null

   return (
      <Style>
         <ShowTitle {...data.show} />

         <label htmlFor='season-select'>Season</label>
         <Select
            id='season-select'
            values={[
               { display: 'All', value: undefined },
               ...data.show.seasons.map(({ number }) => ({ value: number, display: `Season ${number}` })),
            ]}
            value={season}
            onChange={setSeason}
         />

         <div>
            {visible?.map(({ episodes, number, name }, i) => (
               <SeasonWrapper key={i}>
                  <h4>
                     Season {number} - {name}
                  </h4>
                  {episodes.map(e => (
                     <Episode key={e.id} watched={false} due={e.due}>
                        <span>{e.name}</span>
                        <span>{e.aired && DateTime.fromISO(e.aired).toLocaleString()}</span>
                     </Episode>
                  ))}
               </SeasonWrapper>
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

const SeasonWrapper = styled.ul`
   margin-top: 2rem;
   list-style: none;
`

const Style = styled(Page)`
   grid-template:
      'title'
      'seasons';
`

export default EpisodesPage
