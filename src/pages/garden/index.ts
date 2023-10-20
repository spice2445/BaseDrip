import { namedLazy } from 'shared/lib/lazy-load';

import { currentRoute } from './model';
import { GardenPage } from './ui/ui';

// const GardenPage = namedLazy(async () => await import('./ui/ui'), 'GardenPage');

export const GardenRoute = {
  view: GardenPage,
  route: currentRoute
};
