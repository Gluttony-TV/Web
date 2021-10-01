import 'next-auth';
import 'next-auth/jwt';

interface AdditionalJWT {
   provider: string
   name: string
   email?: string
   image?: string
}

declare module 'next-auth/jwt' {

   // eslint-disable-next-line @typescript-eslint/no-empty-interface
   export interface JWT extends AdditionalJWT { }

}

declare module 'next-auth' {

   export interface Session {
      user: AdditionalJWT
   }

}