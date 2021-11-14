import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

function env(key: string) {
   const value = process.env[key]
   if (value) return value
   throw new Error(`Please define the ${key} environment variable inside .env.local`)
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
      },
      async signIn(user) {
         return !!user.email
      },
   },
   jwt: {
      signingKey: process.env.JWT_SIGNING_KEY,
   },
})
