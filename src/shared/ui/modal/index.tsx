import clsx from 'clsx';
import { bodyModal, close, content, title } from './ui.module.scss';
import { HTMLProps } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { modalClose } from 'shared/lib/modal';

const Body = (props: HTMLProps<HTMLDivElement>) => <div className={clsx(bodyModal, props.className)} {...props} />;

const Closed = (props: HTMLProps<HTMLDivElement>) => (
  <div {...props} className={clsx(close, props.className)} onClick={modalClose}>
    <Cross1Icon />
  </div>
);
const Title = (props: HTMLProps<HTMLHeadingElement>) => <h2 {...props} className={clsx(title, props.className)} />;

const Content = (props: HTMLProps<HTMLDivElement>) => <div {...props} className={clsx(content, props.className)} />;

export const ModalElements = {
  Body,
  Closed,
  Title,
  Content
};
