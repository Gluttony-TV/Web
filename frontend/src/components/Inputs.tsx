/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { lighten, transparentize } from "polished";
import { FC, InputHTMLAttributes } from "react";

const Common = (theme: Theme) => css`
   outline: none;

   &:hover {
      box-shadow: 0 0 0 1px ${theme.primary};
   }
   &:focus {
      box-shadow: 0 0 0 5px ${transparentize(0.5, theme.primary)}, 0 0 0 1px ${theme.primary};
   }
`

interface ButtonProps {
   square?: boolean
   secondary?: boolean
}
export const Button = styled.button<ButtonProps>`
   ${p => Common(p.theme)}
   padding: 0.4rem;
   border-radius: ${p => p.square ? undefined : '999px'};
   background: ${p => p.theme.primary};

   &:disabled {
      background: #444;
      color: #CCC;
   }
`

export const Input: FC<{
   value?: string
   onUpdate(value: string): unknown
   size?: number
} & InputHTMLAttributes<HTMLInputElement>> = ({ onUpdate, value, size, ...props }) => {
   const theme = useTheme()

   const style = css`
      ${Common(theme)}
      padding: ${0.5 * (size ?? 1)}rem;
      background: ${lighten(0.2, theme.bg)};
      border-radius: 999px;
   `

   return <input
      {...props}
      css={style}
      value={value ?? ''}
      onChange={e => onUpdate(e.target.value)}
   />
}