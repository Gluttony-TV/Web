import { useRouter } from 'next/router'
import { SetStateAction, useCallback } from 'react'
import { IEpisode, IProgress, IShow } from '../models'
import { useEpisodesInfo } from './useEpisodesInfo'
import useFetch, { useManipulate } from './useFetch'

export function useProgress({ show, ...props }: { show?: IShow['id']; episodes: IEpisode[]; progress?: IProgress }) {
   const { id } = useRouter().query
   const { data: progress } = useFetch<IProgress>(`progress/${show ?? id}`, { initialData: props.progress })
   const { episodes, watchedAll, ...rest } = useEpisodesInfo({ ...props, progress })

   const { mutate: setProgress } = useManipulate<Partial<IProgress>>('put', `progress/${show ?? id}`)
   const setWatched = useCallback(
      (value: SetStateAction<IProgress['watched']>) => {
         const watched = typeof value === 'function' ? value(progress?.watched ?? []) : value
         console.log(watched)
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
      [episodes]
   )

   const watchAll = useCallback(() => {
      if (watchedAll) setWatched([])
      else setWatched(episodes.filter(e => !e.ignore).map(e => e.id))
   }, [watchedAll, episodes])

   return { progress, setWatched, moveProgress, watchAll, episodes, watchedAll, ...rest }
}
