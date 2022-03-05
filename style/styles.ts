import { transparentize } from 'polished'
import { css } from 'styled-components'

export const striped = (color: string, { width = 10, deg = 25 }: { width?: number; deg?: number } = {}) => css`
   background: repeating-linear-gradient(
      -${deg}deg,
      ${[0.75, 0.8]
         .map(amount => transparentize(amount, color))
         .map((c, i) => `${c} ${i * width}px,${c} ${(i + 1) * width}px`)
         .join()}
   );
`

export const gradient = (color: string) => css`
   background: linear-gradient(${transparentize(0, color)}, ${transparentize(0.3, color)});

   &:hover {
      background: linear-gradient(${transparentize(0.2, color)}, ${transparentize(0.5, color)});
   }
`
