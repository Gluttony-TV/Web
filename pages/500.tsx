import Page from 'components/Page'
import { Title } from 'components/Text'
import { NextPage } from 'next'

const ErrorPage: NextPage = () => (
   <Page>
      <Title>500 - Internal Server Error</Title>
   </Page>
)

export default ErrorPage
