import styled from "@emotion/styled";
import { lighten } from "polished";

export default styled.img`
   width: 100%;
   position: relative;

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