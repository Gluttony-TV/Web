import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

if (!GITHUB_CLIENT_ID) throw new Error('Please define the GITHUB_CLIENT_ID environment variable inside .env.local')
if (!GITHUB_CLIENT_SECRET) throw new Error('Please define the GITHUB_CLIENT_SECRET environment variable inside .env.local')

export default NextAuth({
   theme: 'dark',
   providers: [
      Providers.GitHub({
         clientId: GITHUB_CLIENT_ID,
         clientSecret: GITHUB_CLIENT_SECRET,
         scope: 'user:email',
      }),
   ],
   callbacks: {
      async jwt(token, user, account, profile) {
         return { ...token, provider: account?.provider! }
      }
   }
})
