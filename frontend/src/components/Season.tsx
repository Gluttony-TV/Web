import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { FC, useMemo } from 'react';
import { IExtendedSeason, IProgress } from '../api/models';

interface SeasonProps {
   progress?: IProgress
}

const Season: FC<IExtendedSeason & SeasonProps> = ({ episodes, progress }) => {

   const watched = useMemo(() => progress?.watched ?? [], [progress])
   //const percentage = useMemo(() => watched.length / episodes.length, [episodes, watched])

   return <Row>
      {episodes.map(({ id, number, name }) =>
         <Episode key={id} title={name} watched={watched.includes(id)}>
            {number}
         </Episode>
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

const Episode = styled.li<{ watched?: boolean }>`
   text-align: center;
   padding: 1rem;
   width: 3rem;
   cursor: pointer;
      
   background: ${p => transparentize(p.watched ? 0.6 : 0.8, p.theme.secondary)};

   &:hover {
      background: ${p => transparentize(p.watched ? 0.5 : 0.7, p.theme.secondary)};
   }

   &:last-of-type {
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
   }

   &:first-of-type {
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
   }
`

const Row = styled.ul`
   position: relative;
   display: grid;
   grid-auto-flow: column;
   list-style: none;
   width: min-content;
   //border-radius: 999px;
   //overflow: hidden;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }
`

export default Season