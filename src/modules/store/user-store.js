import { createStore, createEffect, createEvent } from 'effector';
import { apiInvoker } from '../api/api-axios';

export const getUserFromDB = createEffect(async () => {
    const resp = await apiInvoker.user.get();
    return resp.data;
});

export const setUserInDBToStore = createEvent();
export const userInDBStore = createStore({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    companyName: '',
    companyId: null,
    joinedDate: '',
}).on(setUserInDBToStore, (_, newUser) => newUser);

userInDBStore.on(getUserFromDB.doneData, (state, data) => {
    if (data instanceof Error) {
        return state;
    }
    return data;
});
