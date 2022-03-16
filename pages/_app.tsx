import { ApolloProvider } from '@apollo/client'
import { useApollo } from 'apollo/client'
import Head from 'components/Head'
import Nav from 'components/Nav'
import Tooltip from 'components/Tooltip'
import theme from 'lib/theme'
import { SessionProvider } from 'next-auth/react'
import { AppComponent } from 'next/dist/shared/lib/router/router'
import { darken } from 'polished'
import React, { Suspense } from 'react'
import { IntlProvider } from 'react-intl'
import 'style/reset.css'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

const App: AppComponent = ({ Component, pageProps }) => {
   const apollo = useApollo(pageProps.initialApolloState)

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
                     <Suspense fallback={Loading}>
                        <Component {...pageProps} />
                     </Suspense>
                  </Container>
               </IntlProvider>
            </ThemeProvider>
         </ApolloProvider>
      </SessionProvider>
   )
}

const Container = styled.section``

const Loading = () => <p>Loading...</p>

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
