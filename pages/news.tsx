import { orderBy } from 'lodash'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { darken } from 'polished'
import { FC } from 'react'
import styled from 'styled-components'
import Image from '../components/Image'
import Link from '../components/Link'
import Page from '../components/Page'
import { Title } from '../components/Text'
import useTranslation from '../hooks/useTranslation'
import { getEpisodes, getShow } from '../lib/api'
import database from '../lib/database'
import { exists, loginLink } from '../lib/util'
import { IShow } from '../models'
import Progress from '../models/Progress'

interface Props {
   shows: Array<
      IShow & {
         missing: number
      }
   >
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   const session = await getSession(req)

   if (!session) return loginLink(req)

   const progress = await Progress.find({ user: session.user.email })

   const shows = await Promise.all(
      progress.map(async p => {
         const [show, episodes] = await Promise.all([getShow(p.show), getEpisodes(p.show)])
         if (!show) return null
         const watched = episodes.filter(e => p.watched.includes(e.id))
         const [lastWatched] = orderBy(watched, e => new Date(e.aired), 'desc')
         const missing = episodes.filter(e => {
            if (e.seasonNumber === lastWatched.seasonNumber) return e.number > lastWatched.number
            return e.seasonNumber > lastWatched.seasonNumber
         }).length

         if (missing === 0) return null

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
                  <h3>{useTranslation(show.name, show.translations)}</h3>
                  <i>{show.missing} missing episodes</i>
                  <Image src={show.image} />
               </ShowPanel>
            ))}
         </Grid>
      </Page>
   )
}

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

   ${Image} {
      grid-area: img;
      height: 200px;
   }
`

export default Watched
