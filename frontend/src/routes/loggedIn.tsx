import { redirect, Route } from ".";
import Logout from "../views/auth/Logout";
import Profile from "../views/Profile";
import Sessions from "../views/Sessions";
import Stats from "../views/Stats";
import Watched from "../views/Watched";

const routes: Route[] = [
   {
      display: 'Logout',
      right: true,
      path: '/logout',
      component: Logout,
   },
   {
      display: 'Sessions',
      path: '/sessions',
      component: Sessions,
   },
   {
      display: 'Stats',
      path: '/stats',
      component: Stats,
   },
   {
      display: 'Profile',
      path: '/profile',
      component: Profile,
   },
   {
      display: 'Watched',
      path: '/watched',
      component: Watched,
   },
   {
      path: '/',
      exact: true,
      component: redirect('/profile'),
   },
]

export default routes