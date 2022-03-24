import { BaseEpisodeFragment, Episode } from 'generated/graphql'
import useTooltip from 'hooks/useTooltip'
import { Dispatch, Fragment, useCallback, useMemo, useState, VFC } from 'react'
import styled from 'styled-components'
import EpisodePanel from './EpisodePanel'

const SeasonRow: VFC<{
   episodes: BaseEpisodeFragment[]
   toggle?: Dispatch<Episode['id']>
   moveProgress?: Dispatch<Episode['id']>
   watched?: Episode['id'][]
   editing?: boolean
}> = ({ toggle, moveProgress, episodes, editing, watched }) => {
   useTooltip()

   const click = useCallback(
      (episode: Episode['id'], shift: boolean) => {
         if (!editing) return
         if (shift && moveProgress) {
            moveProgress(episode)
         } else if (toggle) {
            toggle(episode)
         }
      },
      [toggle, moveProgress, editing]
   )

   const [expanded, setExpanded] = useState(false)

   const wrappedEpisodes = useMemo(() => {
      if (expanded || episodes.length < 20) return [episodes]
      return [episodes.slice(0, 12), episodes.slice(episodes.length - 12)]
   }, [episodes, expanded])

   return (
      <Style>
         {wrappedEpisodes.map((episodePacket, i) => (
            <Fragment key={i}>
               {i !== 0 && (
                  <EpisodePanel data-tip='expand episodes' onClick={() => setExpanded(true)}>
                     ...
                  </EpisodePanel>
               )}
               {episodePacket.map(({ number, name, due, id }) => (
                  <EpisodePanel
                     key={id}
                     disabled={due}
                     watched={watched?.includes(id)}
                     editing={editing}
                     onClick={e => click(id, e.shiftKey)}>
                     <div data-tip={name}>{number}</div>
                  </EpisodePanel>
               ))}
            </Fragment>
         ))}
      </Style>
   )
}

const Style = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, 2rem);
   list-style: none;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }
`

export default SeasonRow
