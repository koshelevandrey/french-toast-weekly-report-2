import { createStore, createEvent } from 'effector';

export const setTriedToGetUserFromDBToStore = createEvent();
export const triedToGetUserFromDBStore = createStore(false).on(
    setTriedToGetUserFromDBToStore,
    (_, newTriedGetUserFromDB) => newTriedGetUserFromDB
);
