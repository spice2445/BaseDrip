import { RouteInstance, RouteParams, RouteQuery } from 'atomic-router';
import { ReactNode } from 'react';

export interface SharedProps {
  children: ReactNode;
  className?: string;
}

export interface LinkProps {
  text: string;
  to: RouteInstance<RouteParams> | string;
  query: undefined | RouteQuery;
}

export type LinkImageProps = Pick<LinkProps, 'to'> & { Image: string; alt: string };

export type ERROR_REVERT = {
  revert: string;
  message: string;
};
