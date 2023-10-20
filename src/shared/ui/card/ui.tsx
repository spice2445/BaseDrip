import { SharedProps } from 'shared/config/type';
import style, { card } from './ui.module.scss';
import clsx from 'clsx';

export enum CardTheme {
  primary = 'card',
  transparent = 'transparent'
}

export interface CardProps extends SharedProps {
  theme?: CardTheme;
}

export const Card = ({ children, className, theme }: CardProps) => {
  return <div className={clsx(card, className, style[theme ?? 'card'])}>{children}</div>;
};
