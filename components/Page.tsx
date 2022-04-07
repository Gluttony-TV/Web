import { NavHeight } from 'components/Nav'
import styled from 'styled-components'

const Page = styled.section<{ fullHeight?: boolean; noCentered?: boolean }>`
   display: grid;
   justify-content: ${p => (p.noCentered ? null : 'center')};
   align-items: center;
   min-height: calc(${p => (p.fullHeight ? '100' : '60')}vh - ${NavHeight});
   padding: 80px;
   width: 1600px;
   max-width: 95vw;
   margin: 0 auto;
`

export default Page
