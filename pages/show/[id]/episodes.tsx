import { NextPage } from 'next'
import styled, { css } from 'styled-components'
import Page from '../../../components/Page'
import ShowTitle from '../../../components/show/Title'
import { useEpisodesInfo } from '../../../hooks/useEpisodesInfo'
import useTranslation from '../../../hooks/useTranslation'
import { Props } from '../[id]'
export { getServerSideProps } from '../[id]'

const Show: NextPage<Props> = ({ show, ...props }) => {
   const { percentage, seasons } = useEpisodesInfo(props)

   return (
      <Style>
         <ShowTitle {...show} percentage={percentage} />

         <p>{useTranslation(show.overview, show.overviews)}</p>

         <ul>
            {seasons?.map((episodes, i) => (
               <Season key={i}>
                  <h4>Season {i + 1}</h4>
                  {episodes.map(e => (
                     <Episode key={e.id} watched={e.watched}>
                        {e.name}
                     </Episode>
                  ))}
               </Season>
            ))}
         </ul>
      </Style>
   )
}

const Episode = styled.li<{ watched?: boolean }>`
   ${p =>
      p.watched &&
      css`
         background: ${p => p.theme.primary};
      `}
`

const Season = styled.ul`
   &:not(:first-child) {
      margin-top: 2rem;
   }
`

const Style = styled(Page)`
   grid-template:
      'title'
      'seasons';
`

export default Show
