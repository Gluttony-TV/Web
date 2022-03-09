import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { Session } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import database from '../../../lib/database'
import theme from '../../../lib/theme'
import { env } from '../../../lib/util'
import Account from '../../../models/Account'

export default NextAuth({
   secret: env('JWT_SECRET'),
   debug: process.env.NEXTAUTH_DEBUG === 'true',
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
   adapter: MongoDBAdapter(database().then(d => d.connection.getClient())),
   callbacks: {
      async session({ session, user }): Promise<Session> {
         session.user.id = user.id
         return session
      },
   },
   events: {
      async signIn({ account, profile }) {
         const { providerAccountId } = account
         if (profile) {
            const { name, email } = profile
            await Account.updateOne({ providerAccountId }, { name, email })
         }
      },
   },
})
