import { useSession } from "next-auth/client";
import { AppStatus } from "../models";

export default function useStatus(): AppStatus {
   const [session, loading] = useSession()
   if (loading) return AppStatus.LOADING
   if (session) return AppStatus.LOGGED_IN
   return AppStatus.LOGGED_OUT
}