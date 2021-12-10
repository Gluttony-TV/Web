import { mix, transparentize } from 'polished'
import { Dispatch, FC, Fragment, SetStateAction, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { IExtendedEpisode } from '../hooks/useEpisodesInfo'
import { IEpisode } from '../models'

const Season: FC<{
   setWatched: Dispatch<SetStateAction<IEpisode['id'][]>>
   moveProgress?: Dispatch<IEpisode['id']>
   episodes: IExtendedEpisode[]
}> = ({ setWatched, moveProgress, episodes }) => {
   const click = useCallback(
      (episode: Pick<IExtendedEpisode, 'id' | 'watched' | 'due'>, shift: boolean) => {
         if (episode.due) return
         if (shift && moveProgress) {
            moveProgress(episode.id)
         } else {
            if (episode.watched) setWatched(w => w.filter(e => e !== episode.id))
            else setWatched(w => [...w, episode.id])
         }
      },
      [setWatched, moveProgress]
   )

   const now = Date.now()

   const wrappedEpisodes = useMemo<IExtendedEpisode[][]>(() => {
      if (episodes.length < 20) return [episodes]
      return [episodes.slice(0, 10), episodes.slice(episodes.length - 10)]
   }, [episodes])

   return (
      <Row>
         {wrappedEpisodes.map((episodes, i) => (
            <Fragment key={i}>
               {i !== 0 && <Episode>...</Episode>}
               {episodes.map(({ number, name, aired, seasonNumber, ...episode }) => (
                  <Episode
                     key={episode.id}
                     title={`Season ${seasonNumber} - ${name}`}
                     disabled={new Date(aired).getTime() > now}
                     watched={episode.watched}
                     onClick={e => click(episode, e.shiftKey)}>
                     {number}
                  </Episode>
               ))}
            </Fragment>
         ))}
      </Row>
   )
}

const grid = (...colors: string[]) => css`
   background: repeating-linear-gradient(
      -25deg,
      ${colors.map((c, i) => `${c} ${i * 10}px,${c} ${(i + 1) * 10}px`).join()}
   );
`

const background = (color: string) => css`
   background: linear-gradient(${transparentize(0, color)}, ${transparentize(0.3, color)});

   &:hover {
      background: linear-gradient(${transparentize(0.2, color)}, ${transparentize(0.5, color)});
   }
`

const Episode = styled.button<{ watched?: boolean; disabled?: boolean }>`
   text-align: center;
   padding: 0.5rem;
   font-size: 0.8rem;
   user-select: none;
   cursor: pointer;

   ${p =>
      p.disabled
         ? css`
              cursor: not-allowed;
              background: ${transparentize(0.9, p.theme.secondary)};
              ${grid(transparentize(0.75, p.theme.secondary), transparentize(0.8, p.theme.secondary))};
              ${p.watched && background(p.theme.error)};
           `
         : css`
              ${background(mix(0.3, p.theme.bg, p.theme.secondary))};
              ${p.watched && background(p.theme.primary)};
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

const Row = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, 2rem);
   list-style: none;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }
`

export default Season
