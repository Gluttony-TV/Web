export default class ApiError extends Error {

   public readonly source?: string

   constructor(message?: string, public readonly status?: number) {
      super(message)
   }
}
