import { Route } from ".";
import Login from "../views/auth/Login";
import Register from "../views/auth/Register";

const routes: Route[] = [
  {
    display: 'Login',
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
]

export default routes