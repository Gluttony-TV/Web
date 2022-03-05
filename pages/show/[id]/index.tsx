import { Check, Times } from '@styled-icons/fa-solid'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import styled from 'styled-components'
import Button, { ButtonLink } from '../../../components/Button'
import Image from '../../../components/Image'
import { } from '../../../components/Inputs'
import Page from '../../../components/Page'
import Season from '../../../components/Season'
import ShowTitle from '../../../components/show/Title'
import { useProgress } from '../../../hooks/useProgress'
import useTranslation from '../../../hooks/useTranslation'
import { getEpisodes, getShow } from '../../../lib/api'
import database, { serialize } from '../../../lib/database'
import { IEpisode, IProgress, IShowFull } from '../../../models'
import Progress from '../../../models/Progress'
export interface Props {
   show: IShowFull
   episodes: IEpisode[]
   progress?: IProgress
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   const session = await getSession(req)

   const id = req.query.id as string

   const [show, episodes] = await Promise.all([getShow(id), getEpisodes(id)])

   if (!show) return { notFound: true }

   const progress = (session && (await Progress.findOne({ user: session.user.email, show: show.id }))) ?? undefined

   return {
      props: serialize({ show, episodes, progress }),
   }
}

const Show: NextPage<Props> = ({ show, ...props }) => {
   const { setWatched, watchAll, moveProgress, seasons, percentage, watchedAll, episodes } = useProgress(props)

   return (
      <Style>
         <ShowTitle {...show} percentage={percentage} />

         <p>{useTranslation(show.overview, show.overviews)}</p>

         <Poster src={show.image_url ?? show.image} alt={`Artwork for ${show.name}`} />

         {episodes.length > 0 && (
            <Seasons>
               <Button secondary={watchedAll} onClick={watchAll}>
                  {watchedAll ? <Times size='80%' /> : <Check size='80%' />}
               </Button>

               <ul>
                  {seasons?.map((season, i) => (
                     <Season {...season} key={i} setWatched={setWatched} moveProgress={moveProgress} />
                  ))}
               </ul>

               <More href={`/show/${show.id}/episodes`}>More</More>
            </Seasons>
         )}
      </Style>
   )
}

const More = styled(ButtonLink)`
   grid-area: more;
   padding: 0.4em 2em;
   justify-self: center;
`

const Seasons = styled.ul`
   grid-area: seasons;
   padding: 2rem;
   display: grid;
   gap: 2rem;
   grid-template:
      'seasons button' 3rem
      'seasons .'
      'more more'
      / minmax(20vw, 1000px) 3rem;

   ul {
      grid-area: seasons;
   }
`

const Poster = styled(Image)`
   grid-area: poster;
`

const Style = styled(Page)`
   grid-template:
      'title poster'
      'overview poster'
      'seasons poster'
      '. poster'
      / 2fr 1fr;
`

export default Show
