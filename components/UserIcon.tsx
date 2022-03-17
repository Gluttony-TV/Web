import Image from 'components/Image'
import { User } from 'generated/graphql'
import hash from 'md5'
import { ImageLoader } from 'next/image'
import { VFC } from 'react'

const gravatarLoader: ImageLoader = ({ src, width }) => {
   const normalized = src.toLowerCase().trim()
   const hashed = hash(normalized)
   return `https://www.gravatar.com/avatar/${hashed}?r=g&d=mp&size=${width}`
}

const UserIcon: VFC<{ user: Pick<User, 'email' | 'name'>; size: number }> = ({ user, size, ...props }) => (
   <Image {...props} loader={gravatarLoader} src={user.email} alt={user.name} width={size} height={size} />
)

export default UserIcon
