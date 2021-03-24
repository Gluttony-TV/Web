declare module 'check-password-strength' {

   export interface PasswordStrength {
      contains: string[]
      length: number
      id: number
      value: string
   }

   export function passwordStrength(password: string): PasswordStrength
}