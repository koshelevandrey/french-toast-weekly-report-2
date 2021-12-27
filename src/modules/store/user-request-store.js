import { createStore, createEvent } from 'effector';

export const setIsWaitingResponse = createEvent();

export const isWaitingResponse = createStore(false).on(
    setIsWaitingResponse,
    (_, status) => status
);
