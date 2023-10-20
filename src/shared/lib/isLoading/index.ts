import { createEvent, createStore } from 'effector';

export const $isLoading = createStore<boolean>(false);
export const setStatusLoading = createEvent<boolean>();

$isLoading.on(setStatusLoading, (_, value) => value);
