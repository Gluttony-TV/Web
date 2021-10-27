import { darken, lighten } from 'polished'
import styled, { keyframes } from 'styled-components'

const animate = keyframes`
   from {
      background-position-x: 0;
   } 
   to {
      background-position-x: 100vw;
   }
`

const Bar = styled.div<{ visible: boolean; height: string }>`
   width: 100%;
   text-align: right;
   position: relative;

   transition: height 0.5s ease;
   height: ${p => (p.visible ? p.height : '0')};

   animation: ${animate} 2s linear infinite;
   background: linear-gradient(
      70deg,
      ${p => darken(0.1, p.theme.primary)},
      ${p => p.theme.primary},
      ${p => lighten(0.3, p.theme.primary)},
      ${p => p.theme.primary},
      ${p => darken(0.1, p.theme.primary)}
   );
`

export default Bar
