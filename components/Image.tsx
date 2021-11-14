import { lighten } from "polished";
import styled from "styled-components";

export default styled.img`
   height: 100%;
   width: 100%;
   position: relative;
   object-fit: contain;

   &::before {
      content: '';
      position: absolute;
      background: ${p => lighten(0.2, p.theme.bg)};
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
   }

   &::after {
      position: absolute;
      content: attr(alt);
      color: ${p => p.theme.text};
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-style: italic;
   }
`