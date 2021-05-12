/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled"
import { Check, Times } from "@styled-icons/fa-solid"
import { transparentize } from "polished"
import { FC, useCallback, useMemo } from "react"
import { useParams } from "react-router"
import { useCached, useFetch, useLoading } from "../api/hooks"
import { IEpisode, IExtendedSeason, IProgress, IShowFull } from "../api/models"
import Image from '../components/Image'
import { Button } from "../components/Inputs"
import Season from "../components/Season"
import ShowName from "../components/ShowName"
import { Title as TitleBase } from "../components/Text"

const Show: FC = () => {
   const params = useParams<{ id: string }>()

   const [seasons] = useFetch<IExtendedSeason[]>(`show/${params.id}/seasons`)
   const [progress, setProgress] = useCached<IProgress>(`progress/${params.id}`)

   const episodes = useMemo(() => seasons?.reduce((a, s) => [...a, ...s.episodes], [] as IEpisode[]) ?? [], [seasons])
   const percentage = useMemo(() => (episodes.length && progress?.watched.length && (progress.watched.length / episodes.length * 100)) ?? 0, [episodes, progress])
   const watchedAll = useMemo(() => progress && episodes && progress.watched.length === episodes.length, [progress, episodes])

   const moveProgress = useCallback((to: IEpisode['id']) => {
      const watched = episodes.filter((_, i) => i <= episodes.findIndex(e => e.id === to)).map(e => e.id)
      setProgress({ watched })
   }, [setProgress, episodes])

   return useLoading<IShowFull>(`show/${params.id}`, show =>
      <Container>

         <Title>
            <Name><ShowName {...show} /></Name>
            <Status>{show.status.name}</Status>
            {percentage > 0 && <Progress>{Math.round(percentage)}%</Progress>}
         </Title>

         <Poster src={show.image} alt={`Artwork for ${show.name}`} />

         {episodes.length > 0 && <Seasons>

            <Button secondary={watchedAll} onClick={() => setProgress({ watched: watchedAll ? [] : episodes.map(e => e.id) })}>
               {watchedAll
                  ? <Times size='80%' />
                  : <Check size='80%' />
               }
            </Button>

            <ul>
               {seasons?.map(s =>
                  <Season
                     {...s}
                     key={s.id}
                     progress={progress}
                     setWatched={watched => setProgress({ watched })}
                     moveProgress={moveProgress}
                  />
               )}
            </ul>

         </Seasons>}

      </Container>
   )
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

const Progress = styled.span`
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
      "status progress"
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