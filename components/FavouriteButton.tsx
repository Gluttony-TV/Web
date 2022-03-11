import { Heart } from '@styled-icons/fa-solid'
import { useSession } from 'next-auth/react'
import { VFC } from 'react'
import styled, { useTheme } from 'styled-components'
import useSubmit from '../hooks/api/useSubmit'
import useTransformed from '../hooks/api/useTransformed'
import useTooltip from '../hooks/useTooltip'
import { IList } from '../models/List'
import { IShow } from '../models/Show'

const FAVOURITE_LIST = 'favourite'

const FavouriteButton: VFC<{ show: IShow['id'] }> = ({ show }) => {
   useTooltip()
   const { primary, text } = useTheme()

   const { status } = useSession()
   const { data: isFavourite } = useTransformed<IList[], boolean>(
      `me/saved/${show}`,
      lists => lists.some(it => it.slug === FAVOURITE_LIST),
      { key: `me/favourite/${show}`, enabled: status === 'authenticated' }
   )

   const toggleFavourite = useSubmit(`me/list/${FAVOURITE_LIST}`, {
      method: 'PUT',
      data: { [isFavourite ? 'remove' : 'add']: [show] },
      mutates: {
         [`me/favourite/${show}`]: () => !isFavourite,
      },
   })

   return (
      <Style
         size='1em'
         color={isFavourite ? primary : text}
         onClick={toggleFavourite.mutate}
         data-tip={isFavourite ? 'Unsave' : 'Save'}
      />
   )
}

const Style = styled(Heart)`
   cursor: pointer;
`

export default FavouriteButton
