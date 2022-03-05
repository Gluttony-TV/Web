import { transparentize } from 'polished'
import { FC } from 'react'
import styled from 'styled-components'
import useTranslation from '../../hooks/useTranslation'
import { IShow } from '../../models'
import Head from '../Head'
import { Title } from '../Text'

const ShowTitle: FC<
   IShow & {
      percentage?: number
      noTitle?: boolean
   }
> = ({ name, translations, percentage = 0, status, noTitle }) => {
   const title = useTranslation(name, translations)
   return (
      <Style>
         {noTitle || <Head title={title} />}
         <Name>{title}</Name>
         <Status>{status.name}</Status>
         {percentage > 0 && <ProgressSpan>{Math.max(100, Math.min(0, Math.round(percentage)))}%</ProgressSpan>}
      </Style>
   )
}

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
   column-gap: 2rem;
   margin-bottom: 2rem;
   grid-template:
      'name progress'
      'status progress';
`

export default ShowTitle
