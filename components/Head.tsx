import NextHead from 'next/head'
import { FC } from 'react'

const Head: FC<{ title?: string }> = ({ title }) => {
   return (
      <NextHead>
         <title>Gluttony{title ? ` - ${title}` : ''}</title>
      </NextHead>
   )
}

export default Head
