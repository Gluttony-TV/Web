import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { FC, Fragment, useCallback, useMemo } from 'react';
import { IEpisode, IExtendedSeason, IProgress } from '../api/models';

export interface SeasonProps {
   progress?: IProgress
   setWatched: (episodes: IEpisode['id'][]) => unknown
   moveProgress?: (episode: IEpisode['id']) => unknown
}

const Season: FC<IExtendedSeason & SeasonProps> = ({ progress, episodes, setWatched, moveProgress }) => {

   const watched = useMemo(() => progress?.watched ?? [], [progress])
   //const percentage = useMemo(() => watched.length / episodes.length, [episodes, watched])

   const click = useCallback((id: IEpisode['id'], shift: boolean) => {
      if (shift && moveProgress) {
         moveProgress(id)
      } else {
         if (watched.includes(id)) setWatched(watched.filter(e => e !== id))
         else setWatched([...watched, id])
      }
   }, [setWatched, moveProgress, watched])

   const split = 25
   const now = new Date().getTime()

   return <Row split={split}>
      {episodes.map(({ id, number, name, aired}) =>
         <Fragment key={id}>
            <Episode
               title={name}
               due={new Date(aired).getTime() > now}
               watched={watched.includes(id)}
               onClick={e => click(id, e.shiftKey)}>
               {number}
            </Episode>
            {/* i > 0 && i % (split - 1) === 0 && <p /> */}
         </Fragment>
      )}
      {/* <Progress width={percentage ?? 0} />*/}
   </Row>
}

/*
const Progress = styled.div<{ width: number }>`
   position: absolute;
   background: ${p => transparentize(0.8, p.theme.secondary)};
   height: 100%;
   width: ${p => p.width * 100}%;
   transition: width 0.1s linear;
   pointer-events: none;
`
*/

const grid = (...colors: string[]) => css`
   background: repeating-linear-gradient(-25deg, ${colors.map(
      (c, i) => `${c} ${i * 10}px,${c} ${(i + 1) * 10}px`
   ).join()});
`

const Episode = styled.li<{ watched?: boolean, due?: boolean }>`
   text-align: center;
   padding: 1rem;
   width: 3rem;
   user-select: none;
   cursor: pointer;
      
   background: ${p => transparentize(0.8, p.theme.secondary)};

   ${p => p.watched && css`
      background: ${transparentize(0.6, p.theme.secondary)};
   `}
   
   ${p => p.due && css`
      cursor: not-allowed;
      background: ${transparentize(0.9, p.theme.secondary)};
      ${grid(transparentize(0.75, p.theme.secondary), transparentize(0.8, p.theme.secondary))};
   `}

   ${p => !p.due && css`
      &:hover {
         background: ${transparentize(p.watched ? 0.5 : 0.7, p.theme.secondary)};
      }
   `}

   &:last-of-type {
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
   }

   &:first-of-type {
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
   }
`

const Row = styled.ul<{ split: number }>`
   position: relative;
   display: grid;
   grid-template-columns: repeat(${p => p.split}, 1fr);
   list-style: none;
   width: min-content;
   //border-radius: 999px;
   //overflow: hidden;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }
`

export default Season