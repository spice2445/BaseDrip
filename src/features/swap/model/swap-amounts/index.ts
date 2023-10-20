import { MouseEvent as ReactMouseEvent } from 'react';

import { createEvent, sample } from 'effector';
import { routesList } from 'shared/config/router';
type OnclickElem = ReactMouseEvent<HTMLButtonElement, MouseEvent>;

export const currentRoute = routesList.swap;

const swapDone = createEvent();

sample({
  clock: swapDone,
  source: currentRoute.$query,
  fn: (query) => {
    return {
      query: { tokenFirst: query.tokenSecond, tokenSecond: query.tokenFirst },
      params: {}
    };
  },
  target: currentRoute.navigate
});

export const swap = (e: OnclickElem) => {
  e.preventDefault();
  swapDone();
};
