/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { createContext, FC, FormHTMLAttributes, useContext } from "react";
import ApiError from "../api/ApiError";
import ErrorField from "./ErrorField";
import { Title } from "./Text";

const StyledForm = styled.form`
   padding: 5rem;
   display: grid;
   justify-content: center;
   gap: 1rem;

   a {
      text-align: center;
   }
`

const ErrorContext = createContext<ApiError | undefined>(undefined)

export function useFormError() {
   return useContext(ErrorContext)
}

const Form: FC<FormHTMLAttributes<HTMLFormElement> & {
   error?: ApiError
   title?: string
}> = ({ children, error, title, ...props }) => (
   <ErrorContext.Provider value={error}>
      <StyledForm {...props}>
         <Title>{title}</Title>
         <ErrorField>{error}</ErrorField>
         {children}
      </StyledForm>
   </ErrorContext.Provider >
)

export default Form