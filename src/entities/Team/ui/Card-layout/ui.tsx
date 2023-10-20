import { Card, CardTheme } from 'shared/ui/card';
import { container, body_container, form } from './ui.module.scss';
import { SharedProps } from 'shared/config/type';
import clsx from 'clsx';
import { Root } from '@radix-ui/react-form';

interface CardLayoutProps extends SharedProps {}

export const CardLayout = ({ children }: CardLayoutProps) => {
  return (
    <Card className={container} theme={CardTheme.transparent}>
      <Card className={clsx(body_container, 'w_100')}>
        <Root className={clsx(form, 'w_100')}>{children}</Root>
      </Card>
    </Card>
  );
};
