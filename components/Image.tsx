import NextImage, { ImageProps } from 'next/image'
import { FC } from 'react'

const Image: FC<ImageProps> = ({ className, ...props }) => (
   <span className={className}>
      <NextImage objectFit='cover' {...props} />
   </span>
)

export default Image
