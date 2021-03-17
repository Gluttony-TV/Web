import styled from '@emotion/styled';
import { transparentize } from 'polished';
import { FC, useMemo } from 'react';
import { useFetch } from '../api/hooks';
import { IExtendedSeason, ISeason } from '../api/models';

const Season: FC<ISeason> = ({ id, number }) => {
   const [season] = useFetch<IExtendedSeason>(`season/${id}`)

   if (season) return <Episodes {...season} />
   else return <p>Season {number}</p>
}

const Episodes: FC<IExtendedSeason> = props => {

   //TODO workaround because of duplicate id bug
   const episodes = useMemo(() => props.episodes.filter((e1, i1, a) => !a.some((e2, i2) => i1 > i2 && e1.id === e2.id)), [props])

   return <Row>
      {episodes.map(({ id, number, name }) =>
         <li key={id} title={name}>
            {number}
         </li>
      )}
   </Row>
}

const Row = styled.ul`
   display: grid;
   grid-auto-flow: column;
   list-style: none;
   background: ${p => transparentize(0.8, p.theme.secondary)};
   border-radius: 999px;
   width: min-content;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }

   li {
      text-align: center;
      padding: 0.5rem;
      width: 2.2rem;
      border-radius: 999px;
      cursor: pointer;

      &:hover {
         background: ${p => transparentize(0.8, p.theme.secondary)};
      }
   }
`

export default Season