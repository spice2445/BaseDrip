import { useStore } from 'effector-react';

import { modalLayout, modalDelete } from './ui.module.scss';
import { modalClose, modalStore } from 'shared/lib/modal';

export const ModalComponent = () => {
  const modalState = useStore(modalStore.$modal);

  const deleteModal = () => {
    modalClose()();
  };

  if (modalState && modalState.ModalElement) {
    return (
      <div className={modalLayout}>
        <modalState.ModalElement {...modalState.dataProps} />

        {!modalState.dataProps.cannotRemove && <div onClick={deleteModal} className={modalDelete} />}
      </div>
    );
  }
};
