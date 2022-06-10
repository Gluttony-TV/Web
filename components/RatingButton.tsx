import { Star } from '@styled-icons/fa-solid'
import { useRatingQuery } from 'graphql/generated/hooks'
import { Show } from 'graphql/generated/models'
import useTooltip from 'hooks/useTooltip'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useCallback, VFC } from 'react'
import styled, { useTheme } from 'styled-components'

const RatingButton: VFC<{ show: Show['id'] }> = ({ show }) => {
   useTooltip()
   const router = useRouter()
   const { primary, text } = useTheme()
   const { status } = useSession()

   const { data } = useRatingQuery({ variables: { show }, skip: status !== 'authenticated' })

   const click = useCallback(() => {
      router.push()
   }, [router])

   return (
      <Style
         size='1em'
         color={data?.rating ? primary : text}
         onClick={click}
         data-tip={data?.rating ? 'Show Rating' : 'Rate this Show'}
      />
   )
}

const Style = styled(Star)`
   cursor: pointer;
`

export default RatingButton
