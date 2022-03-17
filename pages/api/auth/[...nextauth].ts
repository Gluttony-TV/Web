import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { Settings } from 'generated/graphql'
import database from 'lib/database'
import theme from 'lib/theme'
import { env } from 'lib/util'
import Account from 'models/Accounts'
import Lists from 'models/Lists'
import Users from 'models/Users'
import NextAuth, { Session } from 'next-auth'
import { Provider } from 'next-auth/providers'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'

const providers: Provider[] = []

providers.push(
   GitHubProvider({
      clientId: env('GITHUB_CLIENT_ID'),
      clientSecret: env('GITHUB_CLIENT_SECRET'),
   })
)

if (process.env.NODE_ENV === 'development')
   providers.push(
      CredentialsProvider({
         name: 'seeder user',
         credentials: {
            email: { label: 'email', type: 'text', placeholder: 'E-Mail' },
         },
         async authorize(credentials) {
            return await Users.findOne({ ...credentials, seeded: true })
         },
      })
   )

export default NextAuth({
   secret: env('JWT_SECRET'),
   debug: process.env.NEXTAUTH_DEBUG === 'true',
   theme: {
      colorScheme: 'dark',
      brandColor: theme.primary,
   },
   session: {
      strategy: 'jwt',
   },
   providers,
   adapter: MongoDBAdapter(database().then(d => d.connection.getClient())),
   callbacks: {
      async session({ session, user, token }): Promise<Session> {
         session.user.id = user?.id ?? token.sub
         return session
      },
   },
   events: {
      async createUser({ user }) {
         await Users.findByIdAndUpdate(user.id, {
            settings: {} as Settings,
            joinedAt: new Date().toISOString(),
         })

         await Lists.create({ primary: true, name: 'Favourites', userId: user.id })
      },
      async signIn({ account, profile }) {
         const { providerAccountId } = account
         if (profile) {
            const { name, email } = profile
            await Account.updateOne({ providerAccountId }, { name, email })
         }
      },
   },
})
