import { Episode, useProgressQuery, useSetWatchedMutation, WithEpisodesFragment } from 'generated/graphql'
import { useSession } from 'next-auth/react'
import { Dispatch, DispatchWithoutAction, useCallback, useMemo } from 'react'

type ProgressContext = {
   watched: Episode['id'][]
   watchedAll?: boolean
   toggle?: Dispatch<Episode['id']>
   moveProgress?: Dispatch<Episode['id']>
   watchAll?: DispatchWithoutAction
}

export function useProgress(show: Pick<WithEpisodesFragment, 'id' | 'seasons'>): ProgressContext {
   const { status } = useSession()

   const { data, loading } = useProgressQuery({
      variables: { show: show.id },
      skip: status !== 'authenticated',
   })

   const watched = useMemo(() => data?.progress?.watched ?? [], [data])

   const episodes = useMemo(() => show.seasons?.flatMap(it => it.episodes) ?? [], [show])
   const important = useMemo(() => episodes.filter(it => !it.due && !it.special), [episodes])
   const watchedAll = useMemo(() => important.every(it => watched.includes(it.id)), [watched, important])

   const [mutate] = useSetWatchedMutation()
   const setWatched = useCallback(
      (episodes: Episode['id'][]) => mutate({ variables: { show: show.id, episodes } }),
      [mutate, show]
   )

   const moveProgress = useCallback(
      (to: Episode['id']) => {
         const index = important.findIndex(e => e.id === to)
         const watched = important.slice(0, index).map(e => e.id)
         setWatched(watched)
      },
      [important, setWatched]
   )

   const watchAll = useCallback(() => {
      if (watchedAll) setWatched([])
      else setWatched(important.map(e => e.id))
   }, [watchedAll, important, setWatched])

   const toggle = useCallback(
      (episode: Episode['id']) => {
         if (watched.includes(episode)) setWatched(watched.filter(it => it !== episode))
         else setWatched([...watched, episode])
      },
      [watched, setWatched]
   )

   if (loading) return { watchedAll, watched }
   return { watchedAll, watched, moveProgress, watchAll, toggle }
}
