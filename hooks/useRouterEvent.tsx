import { RouterEvent, useRouter } from 'next/router'
import { DispatchWithoutAction, useEffect } from 'react'

export function useRouterEvent(event: RouterEvent, callback: DispatchWithoutAction) {
   const { events } = useRouter()
   useEffect(() => {
      events.on(event, callback)
      return () => events.off(event, callback)
   }, [callback, events])
}
