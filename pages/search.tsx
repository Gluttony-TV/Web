import { prefetchQueries } from 'apollo/server'
import Image from 'components/Image'
import Link from 'components/Link'
import Page from 'components/Page'
import { BaseShowFragment, SearchDocument, useSearchQuery } from 'generated/graphql'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import styled from 'styled-components'

interface Props {
   by: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
   const by = ctx.query.by as string
   return prefetchQueries(ctx, async client => {
      await client.query({ query: SearchDocument, variables: { by } })
      return { by }
   })
}

const Search: FC<Props> = ({ by }) => {
   const { data } = useSearchQuery({ variables: { by } })

   return (
      <Style>
         {data?.results.map(r => (
            <Result key={r.id} {...r} />
         ))}
      </Style>
   )
}

const Result: FC<BaseShowFragment> = ({ name, year, thumbnail, overview, id }) => {
   return (
      <Link href={`/show/${id}`}>
         <ResultStyle>
            <h3>{name}</h3>
            <Overview>{overview}</Overview>
            <span>{year}</span>
            {thumbnail ? <Thumbnail src={thumbnail} alt={name} width={140} height={200} /> : <NoThumnail />}
         </ResultStyle>
      </Link>
   )
}

const Overview = styled.div`
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   line-clamp: 4;
   -webkit-line-clamp: 4;
   -webkit-box-orient: vertical;
`

const NoThumnail = styled.div`
   grid-area: image;
`

const Thumbnail = styled(Image)`
   justify-self: end;
   width: unset;
   grid-area: image;
   margin: -2rem;
`

const ResultStyle = styled.div`
   background: #0001;
   padding: 2rem;
   display: grid;
   grid-template:
      'name image'
      'overview image'
      'year image'
      / 3fr 1fr;
   align-items: center;
`

const Style = styled(Page)`
   display: grid;
   gap: 20px;
`

export default Search
