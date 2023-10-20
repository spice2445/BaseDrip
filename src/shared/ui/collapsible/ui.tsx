import * as CollapsibleUI from '@radix-ui/react-collapsible';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { SharedProps } from 'shared/config/type';

interface CollapsibleProps extends SharedProps {
  trigger: ReactNode;
}

export const Collapsible = ({ trigger, children, className }: CollapsibleProps) => {
  const [open, setOpen] = useState(false);

  return (
    <CollapsibleUI.Root className={clsx(className)} open={open} onOpenChange={setOpen}>
      <CollapsibleUI.Trigger asChild>{trigger}</CollapsibleUI.Trigger>

      <CollapsibleUI.Content>{children}</CollapsibleUI.Content>
    </CollapsibleUI.Root>
  );
};
