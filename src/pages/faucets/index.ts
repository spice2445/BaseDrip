import { namedLazy } from 'shared/lib/lazy-load';

import { currentRoute } from './model';
import { FaucetsPage } from './ui/ui';

// const FaucetsPage = namedLazy(async () => await import('./ui/ui'), 'FaucetsPage');

export const FaucetsRoute = {
  view: FaucetsPage,
  route: currentRoute
};
