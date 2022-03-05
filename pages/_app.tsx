import { SessionProvider } from 'next-auth/react'
import { AppComponent } from 'next/dist/shared/lib/router/router'
import { darken } from 'polished'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { QueryClient, QueryClientProvider } from 'react-query'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import Head from '../components/Head'
import Nav from '../components/Nav'
import theme from '../lib/theme'
import '../style/reset.css'

const client = new QueryClient()

const App: AppComponent = ({ Component, pageProps }) => {
   return (
      <SessionProvider session={pageProps.session}>
         <QueryClientProvider client={client}>
            <ThemeProvider theme={theme}>
               <IntlProvider locale='en'>
                  <Head />
                  <GlobalStyles />

                  <Container>
                     <Nav />
                     <Component {...pageProps} />
                  </Container>
               </IntlProvider>
            </ThemeProvider>
         </QueryClientProvider>
      </SessionProvider>
   )
}

const Container = styled.div``

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
