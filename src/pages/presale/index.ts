import { namedLazy } from 'shared/lib/lazy-load';

import { currentRoute } from './model';
import { PresalePage } from './ui/ui';

// const PresalePage = namedLazy(async () => await import('./ui/ui'), 'PresalePage');

export const PresaleRoute = {
  view: PresalePage,
  route: currentRoute
};
