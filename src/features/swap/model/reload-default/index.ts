import { createEvent, sample } from 'effector';
import { Tokens } from 'shared/config/blockchain';
import { routesList } from 'shared/config/router';

const currentRoute = routesList.swap;

export const reloadQueryWithDefaultValue = createEvent();

sample({
  clock: reloadQueryWithDefaultValue,
  source: currentRoute.$query,
  fn: () => {
    return {
      query: { tokenFirst: Tokens[0], tokenSecond: Tokens[1] },
      params: {}
    };
  },
  target: currentRoute.navigate
});
