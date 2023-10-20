import { createRoutesView } from 'atomic-router-react';

import { DashBoardRoute } from './dashboard';
import { FaucetsRoute } from './faucets';
import { TeamRoute } from './team';
import { SwapRoute } from './swap';
import { GardenRoute } from './garden';
import { PresaleRoute } from './presale';

export const Pages = createRoutesView({
  routes: [DashBoardRoute, PresaleRoute, FaucetsRoute, TeamRoute, SwapRoute, GardenRoute]
});
