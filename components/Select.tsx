import { ChangeEvent, Dispatch, ReactNode, SelectHTMLAttributes, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { InputStyles } from './Inputs'

type Value = undefined | null | string | number
interface Entry<V> {
   value: V
   display: ReactNode
}

interface SelectProps<T> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
   values: Array<T | Entry<T>>
   value: T
   onChange: Dispatch<T>
}

function Select<T extends Value>({ values, value, onChange, ...props }: SelectProps<T>) {
   const entries = useMemo(
      () =>
         values.map(v => {
            if (typeof v === 'object') return v as Entry<T>
            return { value: v, display: v?.toString() ?? 'None' }
         }),
      [values]
   )

   const onSelect = useCallback(
      (e: ChangeEvent<HTMLSelectElement>) => {
         const index = Number.parseInt(e.target.value)
         onChange(entries[index].value)
      },
      [entries, onChange]
   )

   return (
      <Style {...props} onChange={onSelect} value={entries.findIndex(e => e.value === value)}>
         {entries.map(({ value, display }, i) => (
            <option value={`${i}`} key={value?.toString() ?? 'none'}>
               {display}
            </option>
         ))}
      </Style>
   )
}

const Style = styled.select`
   ${InputStyles};
`

export default Select
