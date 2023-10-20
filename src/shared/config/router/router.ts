import { createHistoryRouter, createRoute, createRouterControls } from 'atomic-router';
// import { sample } from 'effector';
import { createBrowserHistory } from 'history';
import { Tokens } from '../blockchain';

// import { appStarted } from '../init';

export enum AppRoutes {
  DASHBOARD = 'dashboard',
  PRESALE = 'presale',
  FAUCETS = 'faucets',
  TEAM = 'team',
  SWAP = 'swap',
  GARDEN = 'garden'
}

export const routesList = {
  dashboard: createRoute(),
  presale: createRoute(),
  faucets: createRoute(),
  team: createRoute(),
  swap: createRoute(),
  garden: createRoute()
};

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.DASHBOARD]: '/',
  [AppRoutes.PRESALE]: '/presale',
  [AppRoutes.FAUCETS]: '/faucets',
  [AppRoutes.TEAM]: '/team',
  [AppRoutes.SWAP]: '/swap',
  [AppRoutes.GARDEN]: '/garden'
};

export const controls = createRouterControls();

export const querySwap = { tokenFirst: Tokens[0], tokenSecond: Tokens[1] };
export const routes = [
  { path: RoutePath.dashboard, route: routesList.dashboard },
  { path: RoutePath.presale, route: routesList.presale },
  { path: RoutePath.faucets, route: routesList.faucets },
  { path: RoutePath.team, route: routesList.team },
  { path: RoutePath.swap, route: routesList.swap },
  { path: RoutePath.garden, route: routesList.garden }
];

export const router = createHistoryRouter({
  routes,
  controls
});

const history = createBrowserHistory();

router.setHistory(history);

// sample({
//   clock: appStarted,
//   fn: () => createBrowserHistory(),
//   target: router.setHistory
// });
