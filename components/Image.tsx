import NextImage, { ImageProps } from 'next/image'
import { VFC } from 'react'

const Image: VFC<ImageProps> = ({ className, ...props }) => (
   <span className={className}>
      <NextImage objectFit='cover' {...props} />
   </span>
)

export default Image
