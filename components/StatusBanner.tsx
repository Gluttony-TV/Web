import useStatus from 'hooks/useStatus'
import { AppStatus } from 'models'
import { FC } from 'react'
import styled from 'styled-components'

const colors: Record<AppStatus, string> = {
   [AppStatus.LOGGED_IN]: '#74cc39',
   [AppStatus.LOGGED_OUT]: '#d1b62e',
   [AppStatus.OFFLINE]: '#222',
   [AppStatus.LOADING]: '#777',
}

const StatusBanner: FC = () => {
   const status = useStatus()

   return <Style status={status}>{status}</Style>
}

const Style = styled.div<{ status: AppStatus }>`
   background: ${p => colors[p.status]};
   padding: 0.7rem;
   text-align: center;
`

export default StatusBanner
