/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";
import { PasswordStrength, passwordStrength } from 'check-password-strength';
import { mix } from "polished";
import { FC, useMemo, useState } from "react";
import { useLogin, useUser } from "../../api/session";
import { FormError } from "../../components/ErrorField";
import Form from "../../components/Form";
import { Button, Input } from "../../components/Inputs";

const Register: FC = () => {
   const user = useUser()
   const [username, setUsername] = useState(user?.username ?? '')
   const [password, setPassword] = useState('')
   const [repeatedPassword, setRepeatedPassword] = useState('')
   const [email, setEmail] = useState('')
   const [authError, register] = useLogin({ username, password, email }, 'auth/register')

   const strength = useMemo(() => passwordStrength(password), [password])

   const error = useMemo(() => {
      if (authError) return authError
      if (repeatedPassword && password !== repeatedPassword) return new FormError('Password not identical', 'password')
      if (password && strength.id < 2) return new FormError('Password to weak', 'password')
   }, [authError, password, repeatedPassword, strength])

   return <Form title='Register' onSubmit={register} error={error}>

      <Input size={2} required type='text' placeholder='Username' value={username} onUpdate={setUsername} autoComplete='username' />

      <Input size={3} required type='password' placeholder='Password' value={password} onUpdate={setPassword} autoComplete='current-password' />
      <StrengthBar strength={strength} />
      <Input size={2} required type='password' placeholder='Repeat password' value={repeatedPassword} onUpdate={setRepeatedPassword} autoComplete='current-password' />

      <Input size={2} required type='text' placeholder='E-Mail' value={email} onUpdate={setEmail} autoComplete='email' />

      <Button disabled={false}>Register</Button>
   </Form>
}

const colors = (t: Theme) => [t.error, t.warning, t.ok, t.ok]
const StrengthBar: FC<{ strength: PasswordStrength }> = ({ strength }) => (
   <>
      <div css={theme => css`
         position: relative;
         margin: 0 auto;
         margin-top: -1.4rem;
         height: ${strength.length ? 1 : 0}rem;
         border-radius: 999px;
         background: ${mix(0.6, theme.bg, theme.secondary)};
         width: 90%;
         transition: height 0.1s linear;

         &::before {
            content: '';
            position: absolute;
            border-radius: 999px;
            height: 100%;
            background: ${colors(theme)[strength.id]};
            width: ${((1 + strength.id) / 4) * 100}%;
         }
      `} />
   </>
)

export default Register