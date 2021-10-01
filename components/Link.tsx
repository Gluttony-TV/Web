
import NextLink from 'next/link';
import styled, { css } from "styled-components";

export const LinkStyle = css`
   color: ${p => p.theme.link.default};
   
   :visited {
      color: ${p => p.theme.link.visited};
   }

   :disabled {
      color: #AAA;
      cursor: not-allowed;
   }
`

const Link = styled(NextLink)`
   ${LinkStyle};
`

export const LinkButton = styled.button`
   ${LinkStyle};
   text-decoration: underline;
   outline: none;
`

export default Link