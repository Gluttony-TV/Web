import { Dispatch, DispatchWithoutAction } from 'hoist-non-react-statics/node_modules/@types/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SetStateAction, useCallback } from 'react'
import { IEpisode, IProgress, IShow } from '../models'
import useResource from './api/useResource'
import useSubmit from './api/useSubmit'
import { useEpisodesInfo } from './useEpisodesInfo'

type ProgressContext = ReturnType<typeof useEpisodesInfo> & {
   progress?: IProgress
   setWatched?: Dispatch<SetStateAction<IProgress['watched']>>
   moveProgress?: Dispatch<IEpisode['id']>
   watchAll?: DispatchWithoutAction
}

export function useProgress({
   show,
   ...props
}: {
   show?: IShow['id']
   episodes: IEpisode[]
   progress?: IProgress
}): ProgressContext {
   const { status } = useSession()
   const { id } = useRouter().query
   const { data: progress } = useResource<IProgress>(`me/progress/${show ?? id}`, {
      initialData: props.progress,
      enabled: status === 'authenticated',
   })
   const { episodes, watchedAll, ...rest } = useEpisodesInfo({ ...props, progress })

   const { mutate: setProgress } = useSubmit<Partial<IProgress>>(`me/progress/${show ?? id}`, { method: 'PUT' })
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
