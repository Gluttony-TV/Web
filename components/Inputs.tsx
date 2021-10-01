
import { lighten, transparentize } from "polished";
import { FC, InputHTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { useFormError } from "./Form";

export const InputStyles = css`
   outline: none;
   color: ${p => p.theme.text};

   &:hover {
      box-shadow: 0 0 0 1px ${p => p.theme.primary};
   }
   &:focus {
      box-shadow: 0 0 0 5px ${p => transparentize(0.5, p.theme.primary)}, 0 0 0 1px ${p => p.theme.primary};
   }
`

interface ButtonProps {
   square?: boolean
   secondary?: boolean
}
export const Button = styled.button<ButtonProps>`
   ${InputStyles};
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
} & InputHTMLAttributes<HTMLInputElement>> = ({ onUpdate, prefix, value, ...props }) => {

   const type = (prefix ?? '') + props.placeholder?.toLocaleLowerCase().replace(/[ _]/g, '-')
   const isError = useFormError()?.source === type

   return <Style
      {...props}
      isError={isError}
      id={type}
      type={type}
      value={value ?? ''}
      onChange={e => onUpdate(e.target.value)}
   />
}

const Style = styled.input<{ isError?: boolean, size?: number }>`
   ${InputStyles}
   padding: ${p => 0.5 * (p.size ?? 1)}rem 1.2rem;
   background: ${p => lighten(0.2, p.theme.bg)};
   border-radius: 999px;
   border: 2px solid ${p => p.isError ? p.theme.error : 'transparent'};
`