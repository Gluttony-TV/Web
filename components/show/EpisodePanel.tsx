import { mix } from 'polished'
import { gradient, striped } from 'style/styles'
import styled, { css } from 'styled-components'

interface Props {
   watched?: boolean
   disabled?: boolean
   editing?: boolean
}

const EpisodePanel = styled.button<Props>`
   text-align: center;
   font-size: 0.8rem;
   user-select: none;
   cursor: ${p => (p.editing ? 'pointer' : 'default')};

   & > div {
      padding: 0.5rem;
   }

   ${p => (p.disabled ? disabledStyle : enabledStyle)}

   &:last-of-type {
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
      :not(:first-of-type) > div {
         padding-right: 1rem;
      }
   }

   &:first-of-type {
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
      :not(:last-of-type) > div {
         padding-left: 1rem;
      }
   }
`

const disabledStyle = css<Props>`
   cursor: ${p => (p.editing ? 'not-allowed' : 'default')};
   ${p => striped(p.theme.secondary)};
   ${p => p.watched && gradient(p.theme.error)};
`

const enabledStyle = css<Props>`
   ${p => gradient(mix(0.3, p.theme.bg, p.theme.secondary))};
   ${p => p.watched && gradient(p.theme.primary)};
`

export default EpisodePanel
