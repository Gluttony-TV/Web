import { Check, Heart, Times } from '@styled-icons/fa-solid'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import Button, { ButtonLink } from '../../../components/Button'
import Image from '../../../components/Image'
import {} from '../../../components/Inputs'
import Page from '../../../components/Page'
import Season from '../../../components/Season'
import ShowTitle from '../../../components/show/Title'
import useFetch, { useManipulate } from '../../../hooks/useFetch'
import { useProgress } from '../../../hooks/useProgress'
import { getEpisodes, getShow } from '../../../lib/api'
import database, { serialize } from '../../../lib/database'
import { IEpisode, IProgress, IShowFull } from '../../../models'
import List, { IList } from '../../../models/List'
import Progress from '../../../models/Progress'

export interface Props {
   lists?: IList[]
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

   const [progress, lists] = session
      ? await Promise.all([
           Progress.findOne({ user: session.user.id, show: show.id }),
           List.find({ user: session.user.id, show: show.id }),
        ])
      : []

   return {
      props: serialize({ show, episodes, progress, lists }),
   }
}

const FAVOURITE_LIST = 'favourite'

const Show: NextPage<Props> = ({ show, ...props }) => {
   const { setWatched, watchAll, moveProgress, seasons, percentage, watchedAll, episodes } = useProgress(props)
   const { data: lists, refetch } = useFetch<IList[]>(`me/saved/${show.id}`)
   const { mutate } = useManipulate('put', `me/list/${FAVOURITE_LIST}`)
   const isFavourite = useMemo(() => lists?.some(it => it.slug === FAVOURITE_LIST), [lists])
   const toggleFavourite = useCallback(() => {
      const operation = isFavourite ? 'remove' : 'add'
      mutate({ [operation]: [show.id] })
      refetch()
   }, [mutate, isFavourite])

   return (
      <Style>
         <ShowTitle {...show} percentage={percentage} />

         <p>{show.overview}</p>

         <Poster src={show.image_url ?? show.image} alt={`Artwork for ${show.name}`} height={1000} width={680} />

         {episodes.length > 0 && (
            <Seasons>
               <Button secondary={watchedAll} onClick={watchAll}>
                  {watchedAll ? <Times size='80%' /> : <Check size='80%' />}
               </Button>
               <Button secondary={!isFavourite} onClick={toggleFavourite}>
                  <Heart />
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

const Poster = styled(Image)`
   grid-area: poster;
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

const Style = styled(Page)`
   grid-template:
      'title poster'
      'overview poster'
      'seasons poster'
      '. poster'
      / 2fr 1fr;
`

export default Show
