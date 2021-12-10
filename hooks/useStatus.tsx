import { useSession } from 'next-auth/react'
import { AppStatus } from '../models'

/**
 * @deprecated
 */
export default function useStatus(): AppStatus {
   const { status } = useSession()
   if (status === 'loading') return AppStatus.LOADING
   if (status === 'authenticated') return AppStatus.LOGGED_IN
   return AppStatus.LOGGED_OUT
}
