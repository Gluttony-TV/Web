/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled"
import { FC } from "react"
import { Link } from "react-router-dom"
import { useLoading, useQuery } from "../api/hooks"
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
   const { names } = useQuery()

   return <Link to={`/shows/${show.id}`}>
      <Panel>

         <Image title={show.name} src={show.image} alt={show.name} />

         {names !== undefined && <h4>{show.name}</h4>}

      </Panel>
   </Link>
}

const Grid = styled.ul`
   display: grid;
   grid-auto-flow: column;
   justify-content: start;
   padding: 2rem;
   gap: 2rem;
`

const Panel = styled.li`
   color: ${p => p.theme.text};
   text-decoration: none;
   cursor: pointer;

   display: grid;

   grid-template:
      "poster" ${1000 / 3}px
      "name"
      / ${680 / 3}px;

   h4 {
      margin-top: 1rem;
      text-align: center;
   }
`


export default Watched