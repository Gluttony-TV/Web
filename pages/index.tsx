
import { signIn, useSession } from "next-auth/client";
import { FC } from "react";
import styled, { css } from "styled-components";
import { LinkButton } from "../components/Link";
import useStatus from "../hooks/useStatus";
import { AppStatus } from "../models";

const Home: FC = () => {
   const [session] = useSession()
   const status = useStatus()

   if (status === AppStatus.LOGGED_IN) return (
      <LoggedIn>
         <p>Welcome {session?.user.name}!</p>
      </LoggedIn>
   )

   else return (
      <LoggedOut>
         <LinkButton onClick={() => signIn()}>Login</LinkButton>
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