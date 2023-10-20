import clsx from 'clsx';
import { text } from '../typogragphy';
import { container_info, content_info } from './ui.module.scss';
import { ReactNode } from 'react';

export interface ColumnsI {
  title: string;
  info?: string;
  useInfo?: () => string;
}

interface ColumnsProps {
  className?: string;
  children: ReactNode;
}

export const Columns = ({ className, children }: ColumnsProps) => {
  return <div className={clsx(container_info, className)}>{children}</div>;
};

export const Column = ({ title, info, useInfo }: ColumnsI) => {
  const getInfo = useInfo?.();
  return (
    <div key={title} className={content_info}>
      <h3 className={text.text_sm}>{title}</h3>
      <p>{getInfo ?? info}</p>
    </div>
  );
};

interface ColumnsListProps {
  columns: ColumnsI[];
  className?: string;
}

export const ColumnsList = ({ columns, className }: ColumnsListProps) => {
  return (
    <div className={clsx(container_info, className)}>
      {columns.map((info) => (
        <Column key={info.title} {...info} />
      ))}
    </div>
  );
};
