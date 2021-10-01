import { Github } from "@styled-icons/fa-brands";
import { DateTime } from 'luxon';
import { Session } from "next-auth";
import { signOut, useSession } from 'next-auth/client';
import { transparentize } from 'polished';
import { FC } from "react";
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { LinkButton } from "../components/Link";
import { Title } from '../components/Text';

const Profile: FC = () => {
   const [session] = useSession()

   return <>
      <Title>
         <FormattedMessage
            description='Profile page title'
            defaultMessage='Your Profile'
         />
      </Title>
      {session
         ? <Info {...session} />
         : <FormattedMessage
            description='Profile page not logged in'
            defaultMessage='not logged in'
         />
      }
   </>
}

const Info: FC<Session> = ({ user }) => {
   const created = DateTime.now()

   const { name, email, provider } = user

   return <Style>
      <Panel>
         <label htmlFor='username'>Username</label>
         <p id='username'>{name}</p>
      </Panel>

      {email && <>
         <Panel>
            <label htmlFor='email'>E-Mail</label>
            <p id='email'>{email ?? 'No email provided'}</p>
         </Panel>
      </>}

      <Panel>
         <label htmlFor='created-at'>Joined at</label>
         <p id='created-at'>{created.toLocaleString()} ({created.toRelative()})</p>
      </Panel>

      <Panel>
         <label htmlFor='connections'>Connections</label>
         <Icons id='connections'>
            {provider && <Github />}
         </Icons>
      </Panel>

      <LinkButton onClick={()  => signOut()}>Logout</LinkButton>

   </Style>
}

const Style = styled.div`
   display: grid;
   margin: 0 auto;
   max-width: 800px;
   text-align: center;
   gap: 2rem;
   grid-template:
         "a a"
         "b c"
         "d e"
         / 1fr 1fr;

   & > :first-of-type {
      grid-area: a;
   }
`

const Icons = styled.ul`
   display: grid;
   grid-auto-flow: column;
   justify-content: center;
   gap: 0.6rem;
   padding: 0.6rem;
`

const Panel = styled.div`
   display: grid;
   gap: 0.5rem;
   padding: 1rem;
   border-radius: 10px;
   background: ${p => transparentize(0.9, p.theme.secondary)};

   &:hover {
      background: ${p => transparentize(0.85, p.theme.secondary)};
   }

   label {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
   }
`

export default Profile