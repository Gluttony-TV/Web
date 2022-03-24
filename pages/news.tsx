import { prefetchQueries } from 'apollo/server'
import Image from 'components/Image'
import Link from 'components/Link'
import Page from 'components/Page'
import { Title } from 'components/Text'
import { BaseEpisodeFragment, BaseShowFragment, WatchedEpisodesDocument } from 'generated/graphql'
import database from 'lib/database'
import { loginLink } from 'lib/util'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { darken } from 'polished'
import { FC } from 'react'
import styled from 'styled-components'

interface Props {
   shows: Array<
      BaseShowFragment & {
         missing: BaseEpisodeFragment[]
      }
   >
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   const session = await getSession(req)
   if (!session) return loginLink(req)
   return prefetchQueries(req, async client => {
      const { data } = await client.query({ query: WatchedEpisodesDocument })
      const shows = data.progresses
         .map(progress => {
            const { episodes, ...show } = progress.show
            const important = episodes.filter(it => !it.due && !it.special)
            const missing = important.filter(it => !progress.watched.includes(it.id))
            return { ...show, missing }
         })
         .filter(it => it.missing.length > 0)

      return { shows }
   })
}

const Watched: FC<Props> = ({ shows }) => {
   return (
      <Page>
         <Title>News</Title>

         <Grid>
            {shows.map(show => (
               <ShowPanel href={`/show/${show.id}`} key={show.id}>
                  <h3>{show.name}</h3>
                  <i title={show.missing.map(e => e.name).join()}>{show.missing.length} missing episodes</i>
                  <Poster src={show.image ?? 'TODO'} height={200} width={140} />
               </ShowPanel>
            ))}
         </Grid>
      </Page>
   )
}

const Poster = styled(Image)`
   grid-area: img;
`

const Grid = styled.div`
   display: grid;
   gap: 2rem;
`

const ShowPanel = styled(Link)`
   padding-left: 1rem;
   gap: 1rem;
   background: ${p => darken(0.05, p.theme.bg)};

   display: grid;
   justify-content: space-between;
   align-items: center;
   grid-template:
      'name img'
      'info img';
`

export default Watched
