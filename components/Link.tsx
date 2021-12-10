import NextLink, { LinkProps as BaseProps } from 'next/link'
import { FC } from 'react'
import styled, { css } from 'styled-components'

interface StyleProps {
   underline?: 'always' | 'hover' | 'none'
}

export interface LinkProps extends BaseProps, StyleProps {}

const Style = styled.a<StyleProps>`
   text-decoration: ${p => (p.underline === 'always' ? 'underline' : 'none')};
   color: ${p => p.theme.text};
   cursor: pointer;

   ${p =>
      p.underline === 'hover' &&
      css`
         &:hover {
            text-decoration: underline;
         }
      `}
`

const Link: FC<LinkProps> = ({ children, href, as, underline = 'none', ...props }) => (
   <NextLink {...props} as={as} href={href} passHref>
      <Style {...props} underline={underline}>
         {children}
      </Style>
   </NextLink>
)

export const LinkButton = styled.button`
   ${Style};
   text-decoration: underline;
   outline: none;
`

export default Link
