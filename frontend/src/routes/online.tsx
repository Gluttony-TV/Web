import { Home as HomeIcon } from '@styled-icons/fa-solid'
import { redirect, Route } from "."
import Home from "../views/Home"
import Show from "../views/Show"

const routes: Route[] = [
  {
    display: HomeIcon,
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/shows/:id',
    component: Show,
  },
  {
    path: '*',
    component: redirect('/'),
  }
]

export default routes