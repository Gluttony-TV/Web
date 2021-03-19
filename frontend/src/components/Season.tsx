import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { FC, useMemo } from 'react';
import { IExtendedSeason } from '../api/models';

interface SeasonProps {
   progress: number
}

const Season: FC<IExtendedSeason & SeasonProps> = ({ episodes, ...props }) => {

   const progress = useMemo(() => props.progress / episodes.length, [episodes, props.progress])

   return <Row>
      {episodes.map(({ id, number, name }) =>
         <li key={id} title={name}>
            {number}
         </li>
      )}
      <Progress progress={progress ?? 0} />
   </Row>
}

const Progress = styled.div<{ progress: number }>`
   position: absolute;
   background: ${p => transparentize(0.8, p.theme.secondary)};
   height: 100%;
   width: ${p => p.progress * 100}%;
   transition: width 0.1s linear;
   pointer-events: none;
`

const Row = styled.ul`
   position: relative;
   display: grid;
   grid-auto-flow: column;
   list-style: none;
   background: ${p => transparentize(0.8, p.theme.secondary)};
   border-radius: 999px;
   width: min-content;
   overflow: hidden;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }

   li {
      text-align: center;
      padding: 1rem;
      width: 3rem;
      border-radius: 999px;
      cursor: pointer;

      &:hover {
         background: ${p => transparentize(0.8, p.theme.secondary)};
      }
   }
`

export default Season