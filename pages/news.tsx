import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { darken } from 'polished'
import { FC } from 'react'
import styled from 'styled-components'
import Image from '../components/Image'
import Link from '../components/Link'
import Page from '../components/Page'
import { Title } from '../components/Text'
import { getEpisodes, getShow } from '../lib/api'
import database from '../lib/database'
import { exists, loginLink } from '../lib/util'
import { IExtendedEpisode } from '../models/Episode'
import Progress from '../models/Progress'
import { IShow } from '../models/Show'

interface Props {
   shows: Array<
      IShow & {
         missing: IExtendedEpisode[]
      }
   >
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   const session = await getSession(req)

   if (!session) return loginLink(req)

   const progresses = await Progress.find({ user: session.user.id })

   const shows = await Promise.all(
      progresses.map(async progress => {
         const [show, episodes] = await Promise.all([getShow(progress.show), getEpisodes(progress.show, progress)])
         if (!show || episodes.length === 0) return null

         const watched = episodes.filter(e => e.watched)
         const lastWatched = watched[watched.length - 1]

         if (!lastWatched) return null

         const missing = episodes.filter(e => {
            if (e.ignore) return false
            if (e.seasonNumber === lastWatched.seasonNumber) return e.number > lastWatched.number
            return e.seasonNumber > lastWatched.seasonNumber
         })

         if (missing.length === 0) return null

         return { ...show, missing }
      })
   )

   return { props: { shows: shows.filter(exists) } }
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
                  <Poster src={show.image} height={200} width={140} />
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
