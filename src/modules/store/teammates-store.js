import { createStore, createEffect } from 'effector';
import { apiInvoker } from '../api/api-axios';

export const getAllTeammates = createEffect(async (companyId) => {
    const resp = await apiInvoker.teamMember.getAll(companyId);
    debugger;
    return resp.data;
});

export const teammatesStore = createStore([]);
teammatesStore.on(getAllTeammates.doneData, (_, data) => {
    return data;
});
