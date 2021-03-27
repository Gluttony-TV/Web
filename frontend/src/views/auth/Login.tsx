/** @jsxImportSource @emotion/react */
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin, useUser } from "../../api/session";
import Form from "../../components/Form";
import { Button, Input } from "../../components/Inputs";

const Login: FC = () => {
   const user = useUser()
   const [username, setUsername] = useState(user?.username ?? '')
   const [password, setPassword] = useState('')
   const [error, login] = useLogin({ username, password })

   return <Form title='Log in' onSubmit={login} error={error}>

      <Input size={2} required type='text' placeholder='Username' value={username} onUpdate={setUsername} autoComplete='username' />
      <Input size={2} required type='password' placeholder='Password' value={password} onUpdate={setPassword} autoComplete='current-password' />

      <Button>Login</Button>

      <Link to='/register'>create new account</Link>
   </Form>
}

export default Login