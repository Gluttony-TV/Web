import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import theme from '../../../lib/theme'

function env(key: string) {
   const value = process.env[key]
   if (value) return value
   throw new Error(`Please define the ${key} environment variable inside .env.local`)
}

export default NextAuth({
   secret: env('JWT_SECRET'),
   theme: {
      colorScheme: 'dark',
      brandColor: theme.primary,
   },
   providers: [
      GitHub({
         clientId: env('GITHUB_CLIENT_ID'),
         clientSecret: env('GITHUB_CLIENT_SECRET'),
      }),
   ],
   callbacks: {
      async jwt({ token, account }) {
         return { ...token, provider: account?.provider }
      },
      async signIn({ user }) {
         return !!user.email
      },
   },
})
