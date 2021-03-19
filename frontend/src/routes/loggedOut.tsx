import { Route } from ".";
import Login from "../views/Login";

const routes: Route[] = [
  {
    display: 'Login',
    path: '/login',
    component: Login,
  },
]

export default routes