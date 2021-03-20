import { StyledIcon } from '@styled-icons/styled-icon';
import { RouteConfig } from "react-router-config";
import { Redirect } from "react-router-dom";
import { AppStatus } from "../api/models";
import loggedIn from "./loggedIn";
import loggedOut from "./loggedOut";
import online from "./online";

export interface Route extends RouteConfig {
   path: string
   display?: string | StyledIcon
   right?: boolean
}

export function redirect(to: string) {
   return () => <Redirect to={to} />
}

const routes: Record<AppStatus, Route[]> = {

   [AppStatus.LOGGED_IN]: [
      ...loggedIn,
      ...online,
   ],

   [AppStatus.LOGGED_OUT]: [
      ...loggedOut,
      ...online
   ],

   [AppStatus.OFFLINE]: [
      {
         path: '*',
         component: () => <p>Server offline :/</p>,
      }
   ],

   [AppStatus.LOADING]: [
      {
         path: '*',
         component: () => <p>...</p>,
      }
   ],

};

export default routes