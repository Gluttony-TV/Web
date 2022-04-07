import Image from 'components/Image'
import { User } from 'graphql/generated/models'
import hash from 'md5'
import { ImageLoader, ImageProps } from 'next/image'
import { VFC } from 'react'
import styled from 'styled-components'

const gravatarLoader: ImageLoader = ({ src, width }) => {
   const normalized = src.toLowerCase().trim()
   const hashed = hash(normalized)
   return `https://www.gravatar.com/avatar/${hashed}?r=g&d=mp&size=${width}`
}

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'size' | 'layout'> & {
   user: Pick<User, 'email' | 'name' | 'image'>
   size: string | number
}

const UserIcon: VFC<Props> = ({ user, size, ...props }) => (
   <Style size={size} data-tip={user.name}>
      {user.image ? (
         <img {...props} src={user.image} alt={user.name} />
      ) : (
         <Image {...props} loader={gravatarLoader} src={user.email} alt={user.name} width={size} height={size} />
      )}
   </Style>
)

const Style = styled.span<{ size: string | number }>`
   &,
   & > img {
      width: ${p => (typeof p.size === 'number' ? `${p.size}px` : p.size)};
      height: ${p => (typeof p.size === 'number' ? `${p.size}px` : p.size)};
   }
   border-radius: 0.5rem;
   overflow: hidden;
`

export default UserIcon
