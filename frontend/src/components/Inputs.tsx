/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { lighten, transparentize } from "polished";
import { FC, InputHTMLAttributes } from "react";
import { useFormError } from "./Form";

export const InputStyles = (theme: Theme) => css`
   outline: none;
   color: ${theme.text};

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
   ${p => InputStyles(p.theme)}
   padding: 0.4rem;
   border-radius: ${p => p.square ? undefined : '999px'};
   background: ${p => p.secondary ? p.theme.secondary : p.theme.primary};

   &:disabled {
      background: #444;
      color: #CCC;
      cursor: not-allowed;
   }
`

export const Input: FC<{
   value?: string
   onUpdate(value: string): unknown
   size?: number
   prefix?: string
} & InputHTMLAttributes<HTMLInputElement>> = ({ onUpdate, prefix, value, size, ...props }) => {
   const theme = useTheme()
   
   const type = (prefix ?? '') + props.placeholder?.toLocaleLowerCase().replace(/[ _]/g, '-')
   const isError = useFormError()?.source === type

   const style = css`
      ${InputStyles(theme)}
      padding: ${0.5 * (size ?? 1)}rem 1.2rem;
      background: ${lighten(0.2, theme.bg)};
      border-radius: 999px;
      border: 2px solid ${isError ? theme.error : 'transparent'};
   `

   return <input
      id={type}
      type={type}
      {...props}
      css={style}
      value={value ?? ''}
      onChange={e => onUpdate(e.target.value)}
   />
}