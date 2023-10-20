import { RouterProvider } from 'atomic-router-react';
import { ReactNode } from 'react';
import { router } from 'shared/config/router';

export const withRouting = (component: () => ReactNode) => () => {
  return <RouterProvider router={router}>{component()}</RouterProvider>;
};
