import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'


function env(key: string) {
   const value = process.env[key]
   if (value) return value
   throw new Error(`Please define the ${value} environment variable inside .env.local`)
}

export default NextAuth({
   theme: 'dark',
   providers: [
      Providers.GitHub({
         clientId: env('GITHUB_CLIENT_ID'),
         clientSecret: env('GITHUB_CLIENT_SECRET'),
      }),
   ],
   callbacks: {
      async jwt(token, _user, account) {
         return { ...token, provider: account?.provider }
      }
   },
   jwt: {
      signingKey: env('JWT_SIGNING_KEY'),
   }
})
