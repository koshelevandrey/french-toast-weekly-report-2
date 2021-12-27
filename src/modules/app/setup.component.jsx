import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { setTokenToStore } from '../api/api-axios';
import { getUserFromDB } from '../store/user-store';
import { setIsWaitingResponse } from '../store/user-request-store';

// Currently not used
export function Initialisation() {
    const { getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        (async () => {
            const token = await getAccessTokenSilently();
            if (token !== '') {
                setIsWaitingResponse(true);
                try {
                    setTokenToStore(token);
                    await getUserFromDB();
                } catch (error) {
                    console.error(error);
                    return error;
                } finally {
                    setIsWaitingResponse(false);
                }
            }
        })();
    }, [getAccessTokenSilently]);
    return null;
}
