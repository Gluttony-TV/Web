import { createElement, FC } from 'react'
import styled, { css } from 'styled-components'
import { InputStyles } from './Inputs'
import Link, { LinkProps } from './Link'

export interface ButtonProps {
   round?: boolean
   secondary?: boolean
   disabled?: boolean
}

const ButtonStyle = css<ButtonProps>`
   text-align: center;
   ${InputStyles};
   padding: 0.4em;
   border-radius: ${p => (p.round ? '9999px' : undefined)};
   background: ${p => (p.secondary ? p.theme.secondary : p.theme.primary)};

   &:disabled {
      background: #444;
      color: #ccc;
      cursor: not-allowed;
   }
`

const Button = styled.button`
   ${ButtonStyle};
`

const ButtonLinkStyle = styled(Link)`
   ${ButtonStyle};
`

export const ButtonLink: FC<LinkProps & ButtonProps> = ({ children, ...props }) =>
   createElement(props.disabled ? Button : ButtonLinkStyle, props, children)

export default Button
