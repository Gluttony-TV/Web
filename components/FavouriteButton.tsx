import { Heart } from '@styled-icons/fa-solid'
import {
   Show,
   UntypedisFavouriteDocument,
   useAddFavouriteMutation,
   useIsFavouriteQuery,
   useRemoveFavouriteMutation,
} from 'generated/graphql'
import useTooltip from 'hooks/useTooltip'
import { useSession } from 'next-auth/react'
import { useCallback, VFC } from 'react'
import styled, { useTheme } from 'styled-components'

const FavouriteButton: VFC<{ show: Show['id'] }> = ({ show }) => {
   useTooltip()
   const { primary, text } = useTheme()
   const { status } = useSession()

   const { data, loading, updateQuery } = useIsFavouriteQuery({ variables: { show }, skip: status !== 'authenticated' })
   const [add] = useAddFavouriteMutation({ variables: { shows: show }, refetchQueries: [UntypedisFavouriteDocument] })
   const [remove] = useRemoveFavouriteMutation({
      variables: { shows: show },
      refetchQueries: [UntypedisFavouriteDocument],
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
