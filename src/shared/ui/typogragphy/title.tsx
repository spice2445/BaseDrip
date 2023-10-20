import clsx from 'clsx';
import { title } from './title.module.scss';
import { SharedProps } from 'shared/config/type';

export const Title = ({ children, className }: SharedProps) => {
  return <h1 className={clsx(title, className)}>{children}</h1>;
};
