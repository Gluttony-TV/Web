import { mix, transparentize } from 'polished'
import { FC, Fragment, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { IEpisode, IProgress } from '../models'

export interface SeasonProps {
   progress?: IProgress
   setWatched: (episodes: IEpisode['id'][]) => unknown
   moveProgress?: (episode: IEpisode['id']) => unknown
}

const Season: FC<
   SeasonProps & {
      episodes: IEpisode[]
   }
> = ({ progress, setWatched, moveProgress, ...props }) => {
   const watched = useMemo(() => progress?.watched ?? [], [progress])
   //const percentage = useMemo(() => watched.length / episodes.length, [episodes, watched])

   const click = useCallback(
      (id: IEpisode['id'], shift: boolean) => {
         if (shift && moveProgress) {
            moveProgress(id)
         } else {
            if (watched.includes(id)) setWatched(watched.filter(e => e !== id))
            else setWatched([...watched, id])
         }
      },
      [setWatched, moveProgress, watched]
   )

   const now = Date.now()

   const episodes = useMemo(() => props.episodes.sort((a, b) => a.number - b.number), [props.episodes])
   const wrappedEpisodes = useMemo<IEpisode[][]>(() => {
      if (episodes.length < 20) return [episodes]
      return [episodes.slice(0, 10), episodes.slice(episodes.length - 10)]
   }, [episodes])

   return (
      <Row>
         {wrappedEpisodes.map((episodes, i) => (
            <Fragment key={i}>
               {i !== 0 && <Episode>...</Episode>}
               {episodes.map(({ id, number, name, aired, seasonNumber }) => (
                  <Episode
                     key={id}
                     title={`Season ${seasonNumber} - ${name}`}
                     due={!aired || new Date(aired).getTime() > now}
                     watched={watched.includes(id)}
                     onClick={e => click(id, e.shiftKey)}>
                     {number}
                  </Episode>
               ))}
            </Fragment>
         ))}
      </Row>
   )
}

const grid = (...colors: string[]) => css`
   background: repeating-linear-gradient(-25deg, ${colors.map((c, i) => `${c} ${i * 10}px,${c} ${(i + 1) * 10}px`).join()});
`

const background = (color: string) => css`
   background: linear-gradient(${transparentize(0, color)}, ${transparentize(0.3, color)});

   &:hover {
      background: linear-gradient(${transparentize(0.2, color)}, ${transparentize(0.5, color)});
   }
`

const Episode = styled.li<{ watched?: boolean; due?: boolean }>`
   text-align: center;
   padding: 0.5rem;
   font-size: 0.8rem;
   user-select: none;
   cursor: pointer;

   ${p =>
      !p.due
         ? css`
              ${background(mix(0.3, p.theme.bg, p.theme.secondary))};
              ${p.watched && background(p.theme.primary)};
           `
         : css`
              cursor: not-allowed;
              background: ${transparentize(0.9, p.theme.secondary)};
              ${grid(transparentize(0.75, p.theme.secondary), transparentize(0.8, p.theme.secondary))};
           `}

   &:last-of-type {
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
      :not(:first-of-type) {
         padding-right: 1rem;
      }
   }

   &:first-of-type {
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
      :not(:last-of-type) {
         padding-left: 1rem;
      }
   }
`

const Row = styled.ul`
   display: grid;
   grid-template-columns: repeat(auto-fill, 2rem);
   list-style: none;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }
`

export default Season
