import { Th, ThLarge } from '@styled-icons/fa-solid'
import { initializeApollo } from 'apollo/client'
import Button from 'components/Button'
import Image from 'components/Image'
import Link from 'components/Link'
import Page from 'components/Page'
import { BaseShowFragment, ProgressWithShowFragment } from 'generated/client'
import { UserProgressesDocument } from 'generated/server'
import database from 'lib/database'
import { loginLink } from 'lib/util'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { createElement, Dispatch, FC, SetStateAction, useState } from 'react'
import styled from 'styled-components'

interface Props {
   watched: ProgressWithShowFragment[]
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()

   const session = await getSession(req)
   if (!session) return loginLink(req)

   const client = initializeApollo()
   const { data } = await client.query({ query: UserProgressesDocument })
   const watched = data.progresses ?? []

   return { props: { watched } }
}

enum View {
   BIG_CELLS = 200,
   SMALL_CELLS = 100,
}

const Watched: FC<Props> = ({ watched }) => {
   const { query } = useRouter()
   const [view, setView] = useState(query.view ? Number.parseInt(query.view.toString()) : View.BIG_CELLS)

   return (
      <Page>
         <ViewSelect value={view} onChange={setView} />
         <Grid size={view}>
            {watched.map(progress => (
               <Cell key={progress.id} size={view} {...progress} />
            ))}
         </Grid>
      </Page>
   )
}

const ViewSelect: FC<{
   onChange: Dispatch<SetStateAction<View>>
   value?: View
}> = ({ onChange, value }) => (
   <IconBar>
      {Object.entries({
         [View.BIG_CELLS]: ThLarge,
         [View.SMALL_CELLS]: Th,
      }).map(([mode, icon]) => (
         <Button key={mode} secondary={mode !== value?.toString()} onClick={() => onChange(Number.parseInt(mode))}>
            {createElement(icon, { size: 20 })}
         </Button>
      ))}
   </IconBar>
)

const IconBar = styled.div`
   background: ${p => p.theme.secondary};
   border-radius: 999px;
   width: min-content;
   display: grid;
   grid-auto-flow: column;
   margin-top: 1rem;
   margin-right: 1rem;
   margin-left: auto;
   cursor: pointer;
   gap: 0.5rem;

   button {
      padding: 1rem;
   }
`

const Cell: FC<{ size: View; show: BaseShowFragment }> = ({ show, size }) => {
   return (
      <Link href={`/show/${show.id}`}>
         <Panel>
            <Image title={show.name} src={show.image} alt={show.name} width={size} height={(size / 256) * 376} />

            <h4>{show.name}</h4>
         </Panel>
      </Link>
   )
}

const Grid = styled.ul<{ size: View }>`
   display: grid;
   justify-content: start;
   padding: 2rem;
   gap: ${p => p.size * 0.1}px;
   grid-template-columns: repeat(auto-fill, ${p => p.size}px);
   width: 90vw;
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
      //filter: drop-shadow(0 0 1rem ${p => transparentize(0.4, p.theme.primary)});

      img {
         clip-path: polygon(0 0, 100% 0, 100% calc(75% - 2rem), 0% 75%);
      }

      h4 {
         transform: translate(-50%, 0);
      }
   }
`

export default Watched
