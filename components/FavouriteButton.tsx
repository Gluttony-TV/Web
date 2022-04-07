import { Heart } from '@styled-icons/fa-solid/Heart'
import {
   refetchIsFavouriteQuery,
   useAddFavouriteMutation,
   useIsFavouriteQuery,
   useRemoveFavouriteMutation,
} from 'graphql/generated/hooks'
import { Show } from 'graphql/generated/models'
import useTooltip from 'hooks/useTooltip'
import { useSession } from 'next-auth/react'
import { useCallback, VFC } from 'react'
import styled, { useTheme } from 'styled-components'

const FavouriteButton: VFC<{ show: Show['id'] }> = ({ show }) => {
   useTooltip()
   const { primary, text } = useTheme()
   const { status } = useSession()

   const { data, loading, updateQuery } = useIsFavouriteQuery({ variables: { show }, skip: status !== 'authenticated' })
   const [add] = useAddFavouriteMutation({
      variables: { shows: show },
      refetchQueries: [refetchIsFavouriteQuery({ show })],
   })
   const [remove] = useRemoveFavouriteMutation({
      variables: { shows: show },
      refetchQueries: [refetchIsFavouriteQuery({ show })],
   })

   const toggle = useCallback(() => {
      if (loading) return
      updateQuery(() => ({ isFavourite: !data?.isFavourite }))
      if (data?.isFavourite) return remove()
      else return add()
   }, [data, add, remove, loading, updateQuery])

   return (
      <Style
         size='1em'
         color={data?.isFavourite ? primary : text}
         onClick={toggle}
         data-tip={`${data?.isFavourite ? 'Remove' : 'Add'} Favourite`}
      />
   )
}

const Style = styled(Heart)`
   cursor: pointer;
`

export default FavouriteButton
