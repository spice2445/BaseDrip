import { SharedProps } from 'shared/config/type';
import { Link } from 'atomic-router-react';
import { RouteInstance, RouteParams, RouteQuery } from 'atomic-router';
import { link, linkActive } from './ui.module.scss';
import clsx from 'clsx';

export interface LinksUIProps extends SharedProps {
  to: string | RouteInstance<RouteParams>;
  query: undefined | RouteQuery;
}

export const LinksUI = ({ to, children, className, query }: LinksUIProps) => {
  return (
    <Link query={query} to={to} className={clsx(link, className)} activeClassName={linkActive}>
      {children}
    </Link>
  );
};
