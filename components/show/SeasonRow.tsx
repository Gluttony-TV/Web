import { BaseEpisodeFragment, Episode } from 'generated/graphql'
import useTooltip from 'hooks/useTooltip'
import { mix } from 'polished'
import { Dispatch, Fragment, useCallback, useMemo, VFC } from 'react'
import { gradient, striped } from 'style/styles'
import styled, { css } from 'styled-components'

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

   const wrappedEpisodes = useMemo(() => {
      if (episodes.length < 20) return [episodes]
      return [episodes.slice(0, 10), episodes.slice(episodes.length - 10)]
   }, [episodes])

   return (
      <Row>
         {wrappedEpisodes.map((episodes, i) => (
            <Fragment key={i}>
               {i !== 0 && <EpisodePanel>...</EpisodePanel>}
               {episodes.map(({ number, name, due, seasonNumber, id }) => (
                  <EpisodePanel
                     key={id}
                     data-tip={name}
                     title={`Season ${seasonNumber} - ${name}`}
                     disabled={due}
                     watched={watched?.includes(id)}
                     editing={editing}
                     onClick={e => click(id, e.shiftKey)}>
                     {number}
                  </EpisodePanel>
               ))}
            </Fragment>
         ))}
      </Row>
   )
}

const EpisodePanel = styled.button<{ watched?: boolean; disabled?: boolean; editing?: boolean }>`
   text-align: center;
   padding: 0.5rem;
   font-size: 0.8rem;
   user-select: none;
   cursor: ${p => (p.editing ? 'pointer' : 'default')};

   ${p =>
      p.disabled
         ? css`
              cursor: not-allowed;
              ${striped(p.theme.secondary)};
              ${p.watched && gradient(p.theme.error)};
           `
         : css`
              ${gradient(mix(0.3, p.theme.bg, p.theme.secondary))};
              ${p.watched && gradient(p.theme.primary)};
           `}

   &:last-of-type {
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
      :not(:first-of-type) {
         padding-right: 1rem;
      }
   }

   &:first-of-type {
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
      :not(:last-of-type) {
         padding-left: 1rem;
      }
   }
`

const Row = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, 2rem);
   list-style: none;

   &:not(:last-of-type) {
      margin-bottom: 0.5rem;
   }
`

export default SeasonRow
