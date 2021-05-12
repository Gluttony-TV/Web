/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Discord } from "@styled-icons/fa-brands";
import { DateTime } from 'luxon';
import { transparentize } from 'polished';
import { FC } from "react";
import { FormattedMessage } from 'react-intl';
import { useRequest } from "../api/hooks";
import { IUser } from "../api/models";
import { useUser } from '../api/session';
import { LinkButton } from '../components/Link';
import { Title } from '../components/Text';

const Profile: FC = () => {
   const user = useUser()

   return <>
      <Title>
         <FormattedMessage
            description='Profile page title'
            defaultMessage='Your Profile'
         />
      </Title>
      {user
         ? <Info {...user} />
         : <FormattedMessage
            description='Profile page not logged in'
            defaultMessage='not logged in'
         />
      }
   </>
}

const Info: FC<IUser> = ({ timestamps, username, verified, email }) => {
   const created = DateTime.fromISO(timestamps.created)

   const style = css`
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

   const reset = useRequest('POST', 'auth/reset')

   return <div css={style}>
      <Panel>
         <label htmlFor='username'>Username</label>
         <p id='username'>{username}</p>
      </Panel>

      {email && <>
         <Panel>
            <label htmlFor='email'>E-Mail</label>
            <p id='email'>{email ?? 'No email provided'}</p>
         </Panel>

         <Panel>
            <label htmlFor='password'>Password</label>
            <p id='password'>***********</p>
            <LinkButton
               title={verified ? undefined : 'You need a verified email to reset your password'}
               disabled={!verified} onClick={reset.send}>
               Reset password
            </LinkButton>
         </Panel>
      </>}

      <Panel>
         <label htmlFor='created-at'>Joined at</label>
         <p id='created-at'>{created.toLocaleString()} ({created.toRelative()})</p>
      </Panel>

      <Panel>
         <label htmlFor='connections'>Connections</label>
         <Icons id='connections'>
            <Discord size='2rem' />
            <Discord size='2rem' />
         </Icons>
      </Panel>

   </div>
}

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