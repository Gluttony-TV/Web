/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState } from "react";
import { useLogin, useUser } from "../api/session";
import { Button, Input } from "../components/Inputs";
import { Title } from "../components/Text";

const Login: FC = () => {
   const user = useUser()
   const [username, setUsername] = useState(user?.username ?? '')
   const [password, setPassword] = useState('')
   const { error, login } = useLogin(username, password)

   const style = css`
      padding: 5rem;
      display: grid;
      justify-content: center;
      gap: 1rem;
   `

   return <form css={style} onSubmit={login}>
      <Title>Log in</Title>
      {error && <p>{error.message}</p>}
      <Input size={2} required type='text' placeholder='Username' value={username} onUpdate={setUsername} autoComplete='username' />
      <Input size={2} required type='password' placeholder='Password' value={password} onUpdate={setPassword} autoComplete='current-password' />
      <Button>Login</Button>
   </form>
}

export default Login