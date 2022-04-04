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

if (process.env.NODE_ENV === 'development') {
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
}

async function populateUser(id: string) {
   await Promise.all([
      Users.findByIdAndUpdate(id, {
         settings: {} as Settings,
         joinedAt: new Date().toISOString(),
      }),

      Lists.updateOne({ primary: true, userId: id }, { name: 'Favourites' }, { upsert: true }),
   ])
}

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
         await populateUser(user.id)
      },
      async signIn({ account, profile, user }) {
         const { providerAccountId } = account
         await populateUser(user.id)
         if (profile) {
            const { name, email } = profile
            await Account.updateOne({ providerAccountId }, { name, email })
         }
      },
   },
})
