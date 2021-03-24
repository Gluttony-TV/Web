/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import debounce from 'lodash.debounce';
import { darken, mix } from "polished";
import { FC, useMemo } from "react";
import { InputStyles } from "./Inputs";

const Searchbar: FC<{
   onChange?: (value: string) => unknown
}> = ({ onChange, children }) => {

   const onInput = useMemo(() => onChange && debounce(onChange, 300), [onChange])

   return <div>
      <Input type='text' placeholder='Search...' onChange={e => onInput?.(e.target.value)} />
      {children && <Dropdown>{children}</Dropdown>}
   </div>
}

const Dropdown = styled.ul`
   position: absolute;
   list-style: none;
   min-width: 400px;
   
   box-shadow: 4px 8px 8px 0 ${p => darken(0.9, p.theme.bg)};
   border-bottom-left-radius: 20px;
   border-bottom-right-radius: 20px;
   overflow: hidden;

   a {
      color: ${p => p.theme.text};
      text-decoration: none;
   }

   & > a {

      li::after {
         content: '';
         position: absolute;
         background: ${p => p.theme.primary};
         width: 4rem;
         height: 8rem;
         top: -1rem;
         right: -5rem;
         transition: right 0.1s linear;
         transform: rotate(20deg);
      }

      li:hover {
         color: ${p => p.theme.primary};
         &::after {
            right: -1rem;
         }
      }
      
      li {
         overflow: hidden;
         position: relative;
         background: ${p => mix(0.8, p.theme.bg, p.theme.secondary)};
         padding-right: 5rem;
         padding: 0.7rem 1rem;
         margin: 0;
      }

      &:first-of-type {
         li {
            padding-top: 1.4rem;
         }
      }

      &:last-of-type {
         li {
            padding-bottom: 1.4rem;
         }
      }

      &:nth-of-type(odd) li {
         background: ${p => mix(0.7, p.theme.bg, p.theme.secondary)};
      }
   }
`

const Input = styled.input`
   ${p => InputStyles(p.theme)};
   width: 40vw;
   padding-left: 5rem;
   padding: 1.15rem;
`

export default Searchbar