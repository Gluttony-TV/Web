import { Check, Times } from "@styled-icons/fa-solid"
import { groupBy } from "lodash"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { transparentize } from "polished"
import { FC, useCallback, useMemo } from "react"
import styled from "styled-components"
import Image from '../../components/Image'
import { Button } from "../../components/Inputs"
import Season from "../../components/Season"
import ShowName from "../../components/ShowName"
import { Title as TitleBase } from "../../components/Text"
import useFetch, { useManipulate } from "../../hooks/useFetch"
import { getEpisodes, getShow } from "../../lib/api"
import database, { serialize } from "../../lib/database"
import { IEpisode, IProgress, IShowFull } from "../../models"
import Progress from '../../models/Progress'

interface Props {
   show: IShowFull
   seasons: IEpisode[][]
   progress?: IProgress
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()
   const session = await getSession(req)

   const progress = serialize(await Progress.findOne({ user: session?.user.email }))

   const id = req.query.id as string

   const show = await getShow(id) as IShowFull
   const episodes = await getEpisodes(id)

   const seasons = Object.values(groupBy(episodes, e => e.seasonNumber))

   if (!show) return { notFound: true }

   return {
      props: { show, seasons, progress },
   }
}

const Show: FC<Props> = ({ seasons, show }) => {

   const { data: progress } = useFetch<IProgress>(`progress/${show.id}`)
   const { mutate: setProgress } = useManipulate<Partial<IProgress>>('put', `progress/${show.id}`)
   const setWatched = useCallback((watched: IProgress['watched']) => setProgress({ watched }), [setProgress])

   const episodes = useMemo(() => seasons?.reduce((a, b) => [...a, ...b], [] as IEpisode[]) ?? [], [seasons])
   const percentage = useMemo(() => (episodes.length && progress?.watched.length && (progress.watched.length / episodes.length * 100)) ?? 0, [episodes, progress])
   const watchedAll = useMemo(() => progress && episodes && progress.watched.length === episodes.length, [progress, episodes])

   const moveProgress = useCallback((to: IEpisode['id']) => {
      const watched = episodes.filter((_, i) => i <= episodes.findIndex(e => e.id === to)).map(e => e.id)
      setWatched(watched)
   }, [episodes])

   return <Container>

      <Title>
         <Name><ShowName {...show} /></Name>
         <Status>{show.status.name}</Status>
         {percentage > 0 && <ProgressSpan>{Math.round(percentage)}%</ProgressSpan>}
      </Title>

      <Poster src={show.image} alt={`Artwork for ${show.name}`} />

      {episodes.length > 0 && <Seasons>

         <Button secondary={watchedAll} onClick={() => setWatched(watchedAll ? [] : episodes.map(e => e.id))}>
            {watchedAll
               ? <Times size='80%' />
               : <Check size='80%' />
            }
         </Button>

         <ul>
            {seasons?.map((episodes, i) =>
               <Season
                  episodes={episodes}
                  key={i}
                  progress={progress}
                  setWatched={setWatched}
                  moveProgress={moveProgress}
               />
            )}
         </ul>

      </Seasons>}

   </Container>
}

const Seasons = styled.ul`
   grid-area: seasons;
   padding: 2rem;
   display: grid;
   column-gap: 2rem;
   grid-template: 
      "seasons button ." 3rem
      "seasons . ." 
      / auto 3rem 1fr;

   ul {
      grid-area: seasons;
   }
`

const Name = styled.h1`
   ${TitleBase.__emotion_styles};
   letter-spacing: 0.5rem;
   font-size: 3rem;
`

const Poster = styled.img`
   ${Image.__emotion_styles};
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
      "name progress"
      "status progress";
`

const Container = styled.section`
   display: grid;
   grid-template:
      "title poster"
      "seasons poster"
      ". poster"
      / 2fr 1fr;
`

export default Show