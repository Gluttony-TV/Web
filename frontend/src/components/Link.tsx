/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";

export const LinkStyle = (p: { theme: Theme }) => css`
   color: ${p.theme.link.default};
   
   :visited {
      color: ${p.theme.link.visited};
   }

   :disabled {
      color: #AAA;
      cursor: not-allowed;
   }
`

export const LinkButton = styled.button`
   ${LinkStyle}
   text-decoration: underline;
   outline: none;
`