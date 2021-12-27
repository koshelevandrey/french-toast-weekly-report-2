import React from 'react';
import { TextHeaderComponent } from '../../headers/text-header/text-header.component';
import { Helmet } from 'react-helmet';
import { useAuth0 } from '@auth0/auth0-react';
import { setTokenToStore } from '../../api/api-axios';
import { setIsWaitingResponse } from '../../store/user-request-store';

export function LoginPage() {
    const { getAccessTokenSilently, loginWithPopup } = useAuth0();

    const onClick = async () => {
        await loginWithPopup();
        setIsWaitingResponse(true);
        try {
            const token = await getAccessTokenSilently();
            await setTokenToStore(token);
        } catch (error) {
            console.error(error);
            return error;
        } finally {
            setIsWaitingResponse(false);
        }
    };

    return (
        <main className='flex-grow-1 overflow-auto mx-0'>
            <Helmet>
                <title>Log in</title>
            </Helmet>
            <TextHeaderComponent title={'Please Log In'} />
            <div>
                <div className='d-flex justify-content-center align-items-center py-5'>
                    <button
                        className='btn btn-lg btn-warning mt-3 mx-3 d-flex'
                        onClick={onClick}>
                        Log In
                    </button>
                </div>
            </div>
        </main>
    );
}
