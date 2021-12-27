import React from 'react';
import loadingImg from '../../../../img/loading.svg';
import { setErrorToStore } from '../../../store/error-store';
import { setUserInDBToStore } from '../../../store/user-store';
import { getUserWithFetch } from '../../../../utils';
import { setTriedToGetUserFromDBToStore } from '../../../store/tride-to-get-user-from-db-store';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenToStore } from '../../../api/api-axios';

// Currently not used
export function LoadingUserFromDB() {
    const { getAccessTokenSilently } = useAuth0();
    const getUserFromDBToUserStore = async () => {
        try {
            const token = await getAccessTokenSilently();
            setTokenToStore(token);
            const { user, error, responseStatus } = await getUserWithFetch(
                token
            );
            if (responseStatus && responseStatus === 404) {
                // Если получили 404 при запросе пользователя, значит ему надо пройти Complete registration,
                // ошибку возвращать не надо
                return;
            }
            if (error !== null) {
                setErrorToStore(error);
            } else {
                setUserInDBToStore(user);
            }
        } catch (error) {
            console.error(error);
            return error;
        } finally {
            setTriedToGetUserFromDBToStore(true);
        }
    };

    return (
        <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
            <div className='d-flex justify-content-center'>
                Please wait, loading...
            </div>
            <div>
                <div className='spinner'>
                    <img src={loadingImg} alt='Loading...' />
                </div>
            </div>
            {(async () => {
                await getUserFromDBToUserStore();
            })()
                ? null
                : null}
        </div>
    );
}
