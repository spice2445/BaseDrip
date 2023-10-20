import * as Dialog from '@radix-ui/react-dialog';
import { controller_menu, controller_menu_item, dialogOverlay, content_menu } from './ui.module.scss';
import { Navbar } from 'widgets/Navbar';

export const MenuMobile = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={controller_menu}>
          {[1, 2, 3].map((index) => (
            <div key={index} className={controller_menu_item} />
          ))}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={dialogOverlay} />
        <Dialog.Content className={content_menu}>
          <Navbar isHeaderMenu />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
