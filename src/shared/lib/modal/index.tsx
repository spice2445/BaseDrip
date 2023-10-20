import { createEvent, createStore } from 'effector';
import type { ModalI } from './type';

function modalState<PropsT>() {
  const createModal = createEvent<ModalI<PropsT> | null>();
  const $modal = createStore<ModalI<PropsT> | null>(null);

  $modal.on(createModal, (_, value) => value);

  return { createModal, $modal };
}

export const modalStore = modalState<any>();

export const modalClose = () => () => {
  modalStore.createModal(null);
};
