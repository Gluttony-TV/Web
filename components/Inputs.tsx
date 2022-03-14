import { useFormError } from 'components/Form'
import { lighten, transparentize } from 'polished'
import { Dispatch, FC, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export const InputStyles = css<{ size?: number; error?: boolean }>`
   color: ${p => p.theme.text};
   padding: ${p => 0.5 * (p.size ?? 1)}rem 1.2rem;
   background: ${p => lighten(0.2, p.theme.bg)};
   border: 2px solid ${p => (p.error ? p.theme.error : 'transparent')};

   transition: box-shadow 0.2s ease, outline 0.2s ease, background 0.2s ease;

   &:hover,
   &:focus-visible {
      outline: solid 2px ${p => p.theme.primary};
   }

   &:focus-visible {
      box-shadow: 0 0 0 5px ${p => transparentize(0.5, p.theme.primary)};
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

   return (
      <Style
         {...props}
         error={error}
         id={type}
         type={type}
         value={value ?? ''}
         onChange={e => onChange(e.target.value)}
      />
   )
}

const Style = styled.input`
   ${InputStyles}
`
