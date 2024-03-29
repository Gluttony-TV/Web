import { ApolloProvider } from '@apollo/client'
import Head from 'components/Head'
import Nav from 'components/Nav'
import Tooltip from 'components/Tooltip'
import { useApollo } from 'graphql/apollo/client'
import { useRouterEvent } from 'hooks/useRouterEvent'
import theme from 'lib/theme'
import { Settings } from 'luxon'
import { NextComponentType } from 'next'
import { SessionProvider } from 'next-auth/react'
import { AppContext, AppProps } from 'next/app'
import { darken } from 'polished'
import React from 'react'
import { IntlProvider } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import 'style/reset.css'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

Settings.defaultLocale = 'en-US'

const App: NextComponentType<AppContext, AppProps, AppProps> = ({ Component, pageProps }) => {
   const apollo = useApollo(pageProps.initialApolloState)
   useRouterEvent('routeChangeComplete', ReactTooltip.rebuild)

   return (
      <SessionProvider session={pageProps.session}>
         <ApolloProvider client={apollo}>
            <ThemeProvider theme={theme}>
               <IntlProvider locale='en'>
                  <Head />
                  <GlobalStyles />

                  <Container>
                     <Nav />
                     <Tooltip />
                     <Component {...pageProps} />
                  </Container>
               </IntlProvider>
            </ThemeProvider>
         </ApolloProvider>
      </SessionProvider>
   )
}

const Container = styled.section``

const GlobalStyles = createGlobalStyle`
   html, body {
      font-family: sans-serif;
      background: ${theme.bg};
      color: ${theme.text};
   }

   ::-webkit-scrollbar {
      width: auto;
   }

   ::-webkit-scrollbar-track {
      background: linear-gradient(
         transparent,
         ${darken(0.02, theme.bg)} 5%,
         ${darken(0.02, theme.bg)} 95%,
         transparent
      );
   }

   ::-webkit-scrollbar-thumb {
      background: ${darken(0.1, theme.bg)};
      border-radius: 6px;
   }

   ::-webkit-scrollbar-thumb:hover {
      background: ${darken(0.07, theme.bg)};
   }

   ul, ol {
      list-style: none;
   }
`

export default App
