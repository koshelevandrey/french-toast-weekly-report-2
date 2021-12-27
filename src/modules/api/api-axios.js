import axios from 'axios';
import React from 'react';
import { createStore, createEvent } from 'effector';
import { setErrorToStore } from '../store/error-store';

export const setTokenToStore = createEvent();
export const tokenFromStore = createStore(null).on(
    setTokenToStore,
    (_, newToken) => newToken
);

const tokenHeader = async (config) => {
    const token = tokenFromStore.getState();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const requestErrors = (error) => {
    const status = error?.request?.status;
    // Если получили 404 при запросе пользователя, значит ему надо пройти Complete registration,
    // ошибку возвращать не надо
    if (status !== 404) {
        setErrorToStore(error);
    }
};

const responseErrors = (error) => {
    const status = error?.response?.status;
    // Если получили 404 при запросе пользователя, значит ему надо пройти Complete registration,
    // ошибку возвращать не надо
    if (status !== 404) {
        setErrorToStore(error);
    }
};

const instanceAPI = axios.create({
    //TODO create env_variable
    baseURL: 'https://localhost:5001/api/',
    timeout: 9000,
});
instanceAPI.interceptors.request.use(tokenHeader);
instanceAPI.interceptors.request.use((request) => request, requestErrors);
instanceAPI.interceptors.response.use((response) => response, responseErrors);

export const apiInvoker = {
    companies: {
        async getAll() {
            return await instanceAPI.get('companies');
        },
        async get(companyId) {
            return await instanceAPI.get(`companies/${companyId}`);
        },
        async create(companyName) {
            return await instanceAPI.post('companies', { name: companyName });
        },
        async update(companyId, companyName) {
            return await instanceAPI.put(`companies/${companyId}`, {
                name: companyName,
            });
        },
    },
    teamMember: {
        async getAll(companyId) {
            return await instanceAPI.get(`companies/${companyId}/members`);
        },
        async createMember(
            companyId,
            firstName,
            lastName,
            title,
            email,
            sub,
            companyName,
            inviteLink
        ) {
            return await instanceAPI.post(`companies/${companyId}/members`, {
                id: 0,
                firstName: firstName,
                lastName: lastName,
                title: title,
                email: email,
                sub: sub,
                companyName: companyName,
                companyId: companyId,
                inviteLink: inviteLink,
            });
        },
        async updateMember(
            companyId,
            teamMemberId,
            firstName,
            lastName,
            title
        ) {
            return await instanceAPI.put(
                `companies/${companyId}/members/${teamMemberId}`,
                {
                    id: 0,
                    firstName: firstName,
                    lastName: lastName,
                    title: title,
                    email: '',
                    sub: '',
                    companyName: '',
                    companyId: 0,
                    inviteLink: '',
                }
            );
        },
    },
    user: {
        async get() {
            return await instanceAPI.get('user');
        },
    },
    links: {
        async updateLeaders(teamMemberId, leadersIdList) {
            return await instanceAPI.put(`links/${teamMemberId}/leaders`, {
                leaders: leadersIdList,
            });
        },
        async updateFollowers(teamMemberId, followersIdList) {
            return await instanceAPI.put(`links/${teamMemberId}/followers`, {
                followers: followersIdList,
            });
        },
    },
    weeklyReport: {
        async getAll(companyId, memberId) {
            return await instanceAPI.get(
                `companies/${companyId}/members/${memberId}/reports`
            );
        },
        async getInInterval(companyId, memberId, start, end) {
            return await instanceAPI.get(
                `companies/${companyId}/members/${memberId}/reports/extended/${start}/${end}`
            );
        },
        async getOld(companyId, memberId, currentDate) {
            return await instanceAPI.get(
                `companies/${companyId}/members/${memberId}/reports/extended/old/${currentDate}`
            );
        },
        async createReport(
            companyId,
            memberId,
            moraleLevel,
            moraleCommentary,
            stressLevel,
            stressCommentary,
            workloadLevel,
            workloadCommentary,
            highThisWeek,
            lowThisWeek,
            anythingElse,
            weekStartDate,
            weekEndDate
        ) {
            return await instanceAPI.post(
                `companies/${companyId}/members/${memberId}/reports`,
                {
                    id: 0,
                    authorId: memberId,
                    moraleGradeId: 0,
                    moraleGrade: {
                        level: parseInt(moraleLevel, 10),
                        commentary: moraleCommentary,
                        id: 0,
                    },
                    stressGradeId: 0,
                    stressGrade: {
                        level: parseInt(stressLevel, 10),
                        commentary: stressCommentary,
                        id: 0,
                    },
                    workloadGradeId: 0,
                    workloadGrade: {
                        level: parseInt(workloadLevel, 10),
                        commentary: workloadCommentary,
                        id: 0,
                    },
                    highThisWeek: highThisWeek,
                    lowThisWeek: lowThisWeek,
                    anythingElse: anythingElse,
                    date: weekStartDate,
                    weekStartDate: weekStartDate,
                    weekEndDate: weekEndDate,
                }
            );
        },
    },
};
