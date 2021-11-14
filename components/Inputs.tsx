import { lighten, transparentize } from 'polished'
import { Dispatch, FC, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { useFormError } from './Form'

export const InputStyles = css<{ size?: number; error?: boolean }>`
   outline: none;
   color: ${p => p.theme.text};
   padding: ${p => 0.5 * (p.size ?? 1)}rem 1.2rem;
   background: ${p => lighten(0.2, p.theme.bg)};
   border: 2px solid ${p => (p.error ? p.theme.error : 'transparent')};

   transition: box-shadow 0.1s ease, outline 0.1s ease, background 0.1s ease;

   &:hover {
      box-shadow: 0 0 0 2px ${p => p.theme.primary};
   }
   &:focus {
      box-shadow: 0 0 0 5px ${p => transparentize(0.5, p.theme.primary)}, 0 0 0 2px ${p => p.theme.primary};
   }
`

interface ButtonProps {
   round?: boolean
   secondary?: boolean
}
export const Button = styled.button<ButtonProps>`
   ${InputStyles};
   padding: 0.4rem;
   border-radius: ${p => (p.round ? '9999px' : undefined)};
   background: ${p => (p.secondary ? p.theme.secondary : p.theme.primary)};

   &:disabled {
      background: #444;
      color: #ccc;
      cursor: not-allowed;
   }
`

export const Input: FC<
   {
      value?: string
      onChange: Dispatch<string>
      size?: number
      prefix?: string
   } & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>
> = ({ onChange, prefix, value, ...props }) => {
   const type = (prefix ?? '') + props.placeholder?.toLocaleLowerCase().replace(/[ _]/g, '-')
   const error = useFormError()?.source === type

   return <Style {...props} error={error} id={type} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} />
}

const Style = styled.input`
   ${InputStyles}
`
