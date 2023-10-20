import { namedLazy } from 'shared/lib/lazy-load';

import { currentRoute } from './model';
import { SwapPage } from './ui/ui';

// const SwapPage = namedLazy(async () => await import('./ui/ui'), 'SwapPage');

export const SwapRoute = {
  view: SwapPage,
  route: currentRoute
};
