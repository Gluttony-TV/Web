import { Heart } from '@styled-icons/fa-solid'
import { Show, useAddFavouriteMutation, useIsFavouriteQuery, useRemoveFavouriteMutation } from 'generated/graphql'
import useTooltip from 'hooks/useTooltip'
import { useSession } from 'next-auth/react'
import { useCallback, VFC } from 'react'
import styled, { useTheme } from 'styled-components'

const FavouriteButton: VFC<{ show: Show['id'] }> = ({ show }) => {
   useTooltip()
   const { primary, text } = useTheme()
   const { status } = useSession()

   const { data, loading } = useIsFavouriteQuery({ variables: { show }, skip: status !== 'authenticated' })
   const [add] = useAddFavouriteMutation({ variables: { shows: show } })
   const [remove] = useRemoveFavouriteMutation({ variables: { shows: show } })
   const toggle = useCallback(() => {
      if (loading) return
      if (data?.isFavourite) return add()
      else return remove()
   }, [data, add, remove, loading])

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
