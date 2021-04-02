/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';
import { IntlProvider } from 'react-intl';
import { renderRoutes } from "react-router-config";
import { BrowserRouter as Router } from 'react-router-dom';
import { AppStatus } from './api/models';
import { SessionProvider } from './api/session';
import { StatusProvider, useStatus } from './api/status';
import { LinkStyle } from './components/Link';
import Nav from './components/Nav';
import StatusBanner from './components/StatusBanner';
import routes from './routes';
import { ThemeProvider } from './themes';

const App: FC = () => (
  <Providers>
    <Container />
  </Providers>
)

const Container: FC = () => {
  const [status] = useStatus()

  return <AppStyle>

    <Global styles={theme => css`

        a {
          ${LinkStyle({ theme })};
        }
        
    `} />

    <Router>
      {status === AppStatus.OFFLINE && <StatusBanner />}
      <Nav />
      {renderRoutes(routes[status])}
    </Router>
  </AppStyle>
}

const AppStyle = styled.div`
  background: ${p => p.theme.bg};
  color: ${p => p.theme.text};
  min-height: 100vh;
  font-family: sans-serif;
`

const Providers: FC = ({ children }) => (
  <StatusProvider>
    <SessionProvider>
      <ThemeProvider>
        <IntlProvider defaultLocale='en' locale='en' messages={{}}>
          {children}
        </IntlProvider>
      </ThemeProvider>
    </SessionProvider>
  </StatusProvider>
)

export default App;
