/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled"
import { FC } from "react"
import { Link } from "react-router-dom"
import { useLoading } from "../api/hooks"
import { IProgress, IShow } from "../api/models"
import Image from '../components/Image'

const Watched: FC = () => {
   return useLoading<IProgress<IShow>[]>('progress/extended', watched =>
      <Grid>
         {watched.map(progress =>
            <Cell key={progress.id} {...progress} />
         )}
      </Grid>
   )
}

const Cell: FC<IProgress<IShow>> = ({ show }) => {
   return <Link to={`/shows/${show.id}`}>
      <Panel>

         <Image title={show.name} src={show.image} alt={show.name} />

         <h4>{show.name}</h4>

      </Panel>
   </Link>
}

const Grid = styled.ul`
   display: grid;
   justify-content: start;
   padding: 2rem;
   gap: 2rem;
   grid-template-columns: repeat(7, 1fr);
   list-style: none;
`

const Panel = styled.li`
   position: relative;
   color: ${p => p.theme.text};
   text-decoration: none;
   cursor: pointer;
   overflow: hidden;

   h4 {
      position: absolute;
      text-align: center;
      background: ${p => p.theme.primary};
      width: 100%;
      top: calc(100% - 6rem);
      padding-top: 3rem;
      padding-bottom: 3rem;
      left: 50%;

      clip-path: polygon(0 2rem, 100% 0, 100% 100%, 0% 100%);

      display: grid;
      align-items: center;

      transform: translate(-50%, 6rem);
      transition: transform 0.1s linear;
   }

   img {
      transition: clip-path 0.1s linear;
         clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
   }

   &:hover {
      img {
         clip-path: polygon(0 0, 100% 0, 100% calc(75% - 2rem), 0% 75%);
      }
     
      h4 {
         transform: translate(-50%, 0);
      }
   }
`


export default Watched