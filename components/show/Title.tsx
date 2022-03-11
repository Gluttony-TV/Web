import { transparentize } from 'polished'
import { FC } from 'react'
import styled from 'styled-components'
import { IShow } from '../../models/Show'
import Head from '../Head'
import { Title } from '../Text'

const ShowTitle: FC<
   IShow & {
      percentage?: number
      noTitle?: boolean
   }
> = ({ name, percentage = 0, status, noTitle, children }) => {
   return (
      <Style>
         {noTitle || <Head title={name} />}
         <Name>{name}</Name>
         <Status>{status.name}</Status>
         {percentage > 0 && <ProgressSpan>{Math.max(0, Math.min(100, Math.round(percentage)))}%</ProgressSpan>}
         <Children>{children}</Children>
      </Style>
   )
}

const Children = styled.div`
   grid-area: rest;
   font-size: 2em;
`

const ProgressSpan = styled.span`
   grid-area: progress;
   padding: 1.5rem 1rem;
   text-align: center;
   min-width: 4.2rem;
   max-width: 4.2rem;
   background: ${p => p.theme.primary};
   border-radius: 999px;
   width: min-content;
`

const Name = styled(Title)`
   font-size: 3rem;
   margin: 0;
`

const Status = styled.span`
   font-style: italic;
   grid-area: status;
   margin: 0 auto;
   padding: 0.5rem 1rem;
   background: ${p => transparentize(0.8, p.theme.secondary)};
   border-radius: 999px;
`

const Style = styled.div`
   grid-area: title;
   display: grid;
   justify-content: center;
   align-items: center;
   column-gap: 2em;
   row-gap: 1em;
   margin-bottom: 2em;
   grid-template:
      'name progress rest'
      'status progress rest';
`

export default ShowTitle
