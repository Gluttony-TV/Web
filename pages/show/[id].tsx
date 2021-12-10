import { Check, Times } from '@styled-icons/fa-solid'
import { groupBy } from 'lodash'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { transparentize } from 'polished'
import { FC, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import Image from '../../components/Image'
import { Button } from '../../components/Inputs'
import Page from '../../components/Page'
import Season from '../../components/Season'
import { Title as TitleBase } from '../../components/Text'
import useFetch, { useManipulate } from '../../hooks/useFetch'
import useTranslation from '../../hooks/useTranslation'
import { getEpisodes, getShow } from '../../lib/api'
import database, { serialize } from '../../lib/database'
import { IEpisode, IProgress, IShowFull } from '../../models'
import Progress from '../../models/Progress'

interface Props {
   show: IShowFull
   seasons: IEpisode[][]
   progress?: IProgress
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   const session = await getSession(req)

   const progress = (session && (await Progress.findOne({ user: session.user.email }))) ?? undefined

   const id = req.query.id as string

   const show = await getShow(id)
   const episodes = await getEpisodes(id)

   const seasons = Object.values(groupBy(episodes, e => e.seasonNumber))

   if (!show) return { notFound: true }

   return {
      props: serialize({ show, seasons, progress }),
   }
}

const Show: FC<Props> = ({ seasons, show }) => {
   const { data: progress } = useFetch<IProgress>(`progress/${show.id}`)
   const { mutate: setProgress } = useManipulate<Partial<IProgress>>('put', `progress/${show.id}`)
   const setWatched = useCallback((watched: IProgress['watched']) => setProgress({ watched }), [setProgress])

   const episodes = useMemo(() => seasons?.reduce((a, b) => [...a, ...b], [] as IEpisode[]) ?? [], [seasons])
   const aired = useMemo(
      () => episodes.filter(({ aired }) => aired && new Date(aired).getTime() <= Date.now()),
      [episodes]
   )
   const watchable = useMemo(
      () => aired.filter(({ seasonNumber, id }) => seasonNumber > 0 || progress?.watched.includes(id)),
      [aired, progress]
   )

   const percentage = useMemo(
      () => (aired.length && progress?.watched.length && (progress.watched.length / aired.length) * 100) ?? 0,
      [aired, progress]
   )

   const watchedAll = useMemo(
      () => progress && watchable && progress.watched.length >= watchable.length,
      [progress, watchable]
   )

   const moveProgress = useCallback(
      (to: IEpisode['id']) => {
         const index = episodes.findIndex(e => e.id === to)
         const watched = watchable
            .filter(({ id }) => episodes.findIndex(it => it.id === id) <= index)
            .filter(e => e.seasonNumber > 0 || progress?.watched.includes(e.id))
            .map(e => e.id)
         setWatched(watched)
      },
      [episodes]
   )

   return (
      <Style>
         <Title>
            <Name>{useTranslation(show.name, show.translations)}</Name>
            <Status>{show.status.name}</Status>
            {percentage > 0 && <ProgressSpan>{Math.round(percentage)}%</ProgressSpan>}
         </Title>

         <p>{useTranslation(show.overview, show.overviews)}</p>

         <Poster src={show.image_url ?? show.image} alt={`Artwork for ${show.name}`} />

         {episodes.length > 0 && (
            <Seasons>
               <Button secondary={watchedAll} onClick={() => setWatched(watchedAll ? [] : watchable.map(e => e.id))}>
                  {watchedAll ? <Times size='80%' /> : <Check size='80%' />}
               </Button>

               <ul>
                  {seasons?.map((episodes, i) => (
                     <Season
                        episodes={episodes}
                        key={i}
                        progress={progress}
                        setWatched={setWatched}
                        moveProgress={moveProgress}
                     />
                  ))}
               </ul>
            </Seasons>
         )}
      </Style>
   )
}

const Seasons = styled.ul`
   grid-area: seasons;
   padding: 2rem;
   display: grid;
   column-gap: 2rem;
   grid-template:
      'seasons button' 3rem
      'seasons .'
      / minmax(20vw, 1000px) 3rem;

   ul {
      grid-area: seasons;
   }
`

const Name = styled(TitleBase)`
   letter-spacing: 0.2rem;
   font-size: 3rem;
`

const Poster = styled(Image)`
   grid-area: poster;
`

const Status = styled.span`
   font-style: italic;
   grid-area: status;
   margin: 0 auto;
   padding: 0.5rem 1rem;
   background: ${p => transparentize(0.8, p.theme.secondary)};
   border-radius: 999px;
`

const ProgressSpan = styled.span`
   grid-area: progress;
   padding: 1.5rem 1rem;
   text-align: center;
   min-width: 4.2rem;
   max-width: 4.2rem;
   background: ${p => p.theme.primary};
   border-radius: 999px;
   width: min-content;
`

const Title = styled.div`
   grid-area: title;
   display: grid;
   justify-content: center;
   align-items: center;
   column-gap: 2rem;
   grid-template:
      'name progress'
      'status progress';
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
