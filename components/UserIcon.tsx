import Image from 'components/Image'
import { User } from 'graphql/generated/models'
import hash from 'md5'
import { ImageLoader } from 'next/image'
import { VFC } from 'react'
import styled from 'styled-components'

const gravatarLoader: ImageLoader = ({ src, width }) => {
   const normalized = src.toLowerCase().trim()
   const hashed = hash(normalized)
   return `https://www.gravatar.com/avatar/${hashed}?r=g&d=mp&size=${width}`
}

const UserIcon: VFC<{ user: Pick<User, 'email' | 'name'>; size: number | string }> = ({ user, size, ...props }) => (
   <Style size={size} data-tip={user.name}>
      <Image {...props} loader={gravatarLoader} src={user.email} alt={user.name} width={size} height={size} />
   </Style>
)

const Style = styled.span<{ size: string | number }>`
   width: ${p => (typeof p.size === 'number' ? `${p.size}px` : p.size)};
   height: ${p => (typeof p.size === 'number' ? `${p.size}px` : p.size)};
   border-radius: 0.5rem;
   overflow: hidden;
`

export default UserIcon
