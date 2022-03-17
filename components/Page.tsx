import { NavHeight } from 'components/Nav'
import styled from 'styled-components'

const Page = styled.section<{ maximized?: boolean }>`
   display: grid;
   justify-content: center;
   align-items: center;
   min-height: calc(${p => (p.maximized ? '100' : '60')}vh - ${NavHeight});
   padding: 80px;
   max-width: ${p => (p.maximized ? null : '1600px')};
   margin: 0 auto;
`

export default Page
