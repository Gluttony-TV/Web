/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { transparentize } from "polished"
import { FC, useMemo } from "react"
import { useParams } from "react-router"
import { useFetch, useLoading } from "../api/hooks"
import { IExtendedSeason, IProgress, IShowFull } from "../api/models"
import Image from '../components/Image'
import Season from "../components/Season"
import { Title as TitleBase } from "../components/Text"

const Show: FC = () => {
   const params = useParams<{ id: string }>()

   const [seasons] = useFetch<IExtendedSeason[]>(`show/${params.id}/seasons`)
   const [progress] = useFetch<IProgress>(`progress/${params.id}`)

   const totalEpisodes = useMemo(() => seasons?.reduce((t, s) => t + s.episodes.length, 0), [seasons])
   const percentage = useMemo(() => totalEpisodes && progress && (progress.watched.length / totalEpisodes * 100), [totalEpisodes, progress])

   return useLoading<IShowFull>(`show/${params.id}`, show =>
      <Container>
         <Title>
            <Name>{show.name}</Name>
            <Status>{show.status.name}</Status>
            {percentage && <Progress>{Math.round(percentage)}%</Progress>}
         </Title>
         <Poster src={show.image} alt={`Artwork for ${show.name}`} />
         <Seasons progress={progress} seasons={seasons} />
      </Container>
   )
}

const Seasons: FC<{
   progress?: IProgress
   seasons?: IExtendedSeason[]
}> = ({ seasons, progress }) => {

   const style = css`
      grid-area: seasons;
      padding: 2rem;
   `

   return <ul css={style}>
      {seasons?.map((s, i) => <Season key={s.id} progress={progress} {...s} />)}
   </ul>
}

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