import { GetServerSideProps } from 'next'
import { FC } from 'react'
import styled from 'styled-components'
import Image from '../components/Image'
import Link from '../components/Link'
import Page from '../components/Page'
import { searchShow } from '../lib/api'
import database from '../lib/database'
import { IShow } from '../models'

interface Props {
   results: IShow[]
}

export const getServerSideProps: GetServerSideProps<Props> = async req => {
   await database()

   const by = req.query.by as string

   const results = await searchShow(by, 10)

   return { props: { results } }
}

const Search: FC<Props> = ({ results }) => {
   return (
      <Style>
         {results.map(r => (
            <Result key={r.id} {...r} />
         ))}
      </Style>
   )
}

const Result: FC<IShow> = ({ name, year, thumbnail, overview, tvdb_id }) => {
   return (
      <Link href={`/show/${tvdb_id}`}>
         <ResultStyle>
            <h3>{name}</h3>
            <Overview>{overview}</Overview>
            <span>{year}</span>
            <Thumbnail src={thumbnail} alt={name} width={140} height={200} />
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
