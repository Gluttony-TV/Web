import { redirect, Route } from ".";
import Logout from "../views/Logout";
import Profile from "../views/Profile";
import Sessions from "../views/Sessions";

const routes: Route[] = [
   {
      display: 'Logout',
      path: '/logout',
      component: Logout,
   },
   {
      display: 'Sessions',
      path: '/sessions',
      component: Sessions,
   },
   {
      display: 'Profile',
      path: '/profile',
      component: Profile,
   },
   {
      path: '/',
      exact: true,
      component: redirect('/profile'),
   },
]

export default routes