//import 'next-auth'
//import 'next-auth/jwt'
//
//declare module 'next-auth' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   export interface Session {
//      user: User & {
//      }
//   }
//
//   export interface User {
//      provider?: string
//      name: string
//      email: string
//      image?: string
//   }
//}

import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
   export interface Session {
      user: Required<DefaultSession['user']> & {
         id: string
         name: string
         email: string
      }
   }
}
