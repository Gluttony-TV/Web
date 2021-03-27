import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FC } from "react";
import { Link } from "react-router-dom";
import { AppStatus } from "../api/models";
import { useUser } from "../api/session";
import { useStatus } from "../api/status";

const Home: FC = () => {
   const user = useUser()
   const [status] = useStatus()

   if (status === AppStatus.LOGGED_IN) return (
      <LoggedIn>
         <p>Welcome {user?.username}!</p>
      </LoggedIn>
   )

   else return (
      <LoggedOut>
         <Link to='/login'>Login</Link>
      </LoggedOut>
   )

}

const Grid = css`
   display: grid;
   justify-content: center;
   align-items: center;
   padding: 3rem;
`

const LoggedIn = styled.div`
   ${Grid};
`

const LoggedOut = styled.div`
   ${Grid};
`

export default Home