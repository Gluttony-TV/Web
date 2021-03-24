import styled from "@emotion/styled";
import { transparentize } from "polished";
import { FC } from "react";
import ApiError from "../api/ApiError";

export class FormError extends ApiError {
   constructor(message?: string, public readonly source?: string) {
      super(message, 400);
   }
}

const ErrorField: FC<{
   children?: ApiError | null
}> = ({ children }) => (
   <Field visible={!!children}>
      {children?.message ?? '.'}
   </Field>
)

const Field = styled.p<{ visible: boolean }>`
   text-align: center;
   padding: 1rem;
   border-radius: 0.5rem;
   border: dashed 1px ${p => p.theme.error};
   background: ${p => transparentize(0.7, p.theme.error)};
   opacity: ${p => p.visible ? 1 : 0};
`

export default ErrorField