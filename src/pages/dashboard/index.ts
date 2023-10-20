import { namedLazy } from 'shared/lib/lazy-load';

import { currentRoute } from './model';
import { DashBoardPage } from './ui/ui';

// const DashBoardPage = namedLazy(async () => await import('./ui/ui'), 'DashBoardPage');

export const DashBoardRoute = {
  view: DashBoardPage,
  route: currentRoute
};
