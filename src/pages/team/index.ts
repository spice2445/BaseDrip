import { namedLazy } from 'shared/lib/lazy-load';

import { currentRoute } from './model';
import { TeamPage } from './ui/ui';

// const TeamPage = namedLazy(async () => await import('./ui/ui'), 'TeamPage');

export const TeamRoute = {
  view: TeamPage,
  route: currentRoute
};
