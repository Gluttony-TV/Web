import { Episode, Progress, Show, useProgressQuery } from 'generated/graphql'
import { IEpisode } from 'models/Episodes'
import { IProgress } from 'models/Progresses'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Dispatch, DispatchWithoutAction, SetStateAction, useCallback } from 'react'
import useSubmit from './api/useSubmit'
import { useEpisodesInfo } from './useEpisodesInfo'

type ProgressContext = ReturnType<typeof useEpisodesInfo> & {
   progress?: Progress
   setWatched?: Dispatch<SetStateAction<Progress['watched']>>
   moveProgress?: Dispatch<Episode['id']>
   watchAll?: DispatchWithoutAction
}

export function useProgress({ show, ...props }: { show?: Show['id']; episodes: Episode[] }): ProgressContext {
   const { status } = useSession()
   const { id } = useRouter().query
   const endpoint = `me/progress/${show ?? id}`

   const { data } = useProgressQuery({
      variables: { show: show ?? Number.parseInt(id as string) },
      skip: status !== 'unauthenticated',
   })
   const progress = data?.progress ?? undefined

   const { episodes, watchedAll, ...rest } = useEpisodesInfo({ ...props, progress })

   const { mutate: setProgress } = useSubmit<Partial<IProgress>>(endpoint, {
      method: 'PUT',
      mutates: { [endpoint]: update => ({ ...progress, ...update }) },
   })

   const setWatched = useCallback(
      (value: SetStateAction<IProgress['watched']>) => {
         const watched = typeof value === 'function' ? value(progress?.watched ?? []) : value
         setProgress({ watched })
      },
      [setProgress, progress]
   )

   const moveProgress = useCallback(
      (to: IEpisode['id']) => {
         const index = episodes.findIndex(e => e.id === to)
         const watched = episodes
            .filter(e => !e.ignore)
            .filter(({ id }) => episodes.findIndex(it => it.id === id) <= index)
            .map(e => e.id)
         setWatched(watched)
      },
      [episodes, setWatched]
   )

   const watchAll = useCallback(() => {
      if (watchedAll) setWatched([])
      else setWatched(episodes.filter(e => !e.ignore).map(e => e.id))
   }, [watchedAll, episodes, setWatched])

   if (status === 'authenticated')
      return { progress, setWatched, moveProgress, watchAll, episodes, watchedAll, ...rest }
   return { episodes, watchedAll, ...rest }
}
