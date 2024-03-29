import { Check } from '@styled-icons/fa-solid/Check'
import { Pen } from '@styled-icons/fa-solid/Pen'
import { Times } from '@styled-icons/fa-solid/Times'
import Button, { ButtonLink } from 'components/Button'
import { WithSeasonsFragment } from 'graphql/generated/operations'
import { useProgress } from 'hooks/useProgress'
import { useSession } from 'next-auth/react'
import { createElement, FC, useReducer } from 'react'
import styled from 'styled-components'
import SeasonRow from './SeasonRow'

const Seasons: FC<{ show: Pick<WithSeasonsFragment, 'seasons' | 'id'> }> = ({ show }) => {
   const { status } = useSession()
   const { watchAll, watchedAll, ...seasonProps } = useProgress(show)

   const [editing, toggleEdit] = useReducer((b: boolean) => !b, false)

   return (
      <Style>
         {status === 'authenticated' && (
            <>
               <Button secondary={editing} onClick={toggleEdit}>
                  {createElement(editing ? Check : Pen, { size: '1em' })}
               </Button>
               {editing && (
                  <Button secondary={watchedAll} onClick={watchAll}>
                     {createElement(watchedAll ? Times : Check, { size: '1em' })}
                  </Button>
               )}
            </>
         )}

         <ul>
            {show.seasons.map((season, i) => (
               <SeasonRow {...season} key={i} editing={editing} {...seasonProps} />
            ))}
         </ul>

         <More href={`/show/${show.id}/episodes`}>More</More>
      </Style>
   )
}

const More = styled(ButtonLink)`
   grid-area: more;
   padding: 0.4em 2em;
   justify-self: center;
`

const Style = styled.ul`
   grid-area: seasons;
   padding: 2rem;
   display: grid;
   gap: 2rem;
   grid-template:
      'seasons button' 3rem
      'seasons .'
      'more more'
      / minmax(20vw, 1000px) 3rem;

   ul {
      grid-area: seasons;
   }
`

export default Seasons
