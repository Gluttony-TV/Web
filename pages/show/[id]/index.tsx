import FavouriteButton from 'components/FavouriteButton'
import Image from 'components/Image'
import Page from 'components/Page'
import Seasons from 'components/show/Seasons'
import ShowTitle from 'components/show/Title'
import { prefetchQueries } from 'graphql/apollo/server'
import { useShowQuery } from 'graphql/generated/hooks'
import { ShowDocument } from 'graphql/generated/server'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
   return prefetchQueries({ req }, async client => {
      await client.query({ query: ShowDocument, variables: { id: Number.parseInt(query.id as string) } })
   })
}

const ShowPage: NextPage = () => {
   const router = useRouter()
   const id = Number.parseInt(router.query.id as string)
   const { data } = useShowQuery({ variables: { id } })

   if (!data) return <p>Loading</p>
   const { show } = data

   return (
      <Style>
         <ShowTitle {...show}>
            <FavouriteButton show={show.id} />
         </ShowTitle>

         <p>{show.overview}</p>

         <Poster src={show.image ?? 'TODO'} alt={`Artwork for ${show.name}`} height={1000} width={680} />

         <Seasons show={show} />
      </Style>
   )
}

const Poster = styled(Image)`
   grid-area: poster;
`

const Style = styled(Page)`
   grid-template:
      'title poster'
      'overview poster'
      'seasons poster'
      '. poster'
      / 2fr 1fr;
`

export default ShowPage
