import React from 'react';
import { TextHeaderComponent } from '../../headers/text-header/text-header.component';
import { Helmet } from 'react-helmet';

import PropTypes from 'prop-types';
import inner_error from '../../../img/inner-error.png';
import { userInDBStore } from '../../store/user-store';
import { useAuth0 } from '@auth0/auth0-react';

export function ErrorPage({ error }) {
    const { isAuthenticated, logout } = useAuth0();
    return (
        <main className='flex-grow-1 overflow-auto mx-0'>
            <Helmet>
                <title>Inner Error</title>
            </Helmet>
            <TextHeaderComponent title={'Inner Error'} />
            <div className='py-1'>
                <div className='d-flex justify-content-center'>
                    <img
                        className='w-25 h-25'
                        src={inner_error}
                        alt={'inner-error'}
                    />
                </div>
            </div>
            <div className='py-2'>
                <div className='d-flex flex-column justify-content-center text-danger'>
                    <div className='align-self-center'>
                        Error: {error.message}
                    </div>
                    {error.extraMessage ? (
                        <div className='align-self-center'>
                            {error.extraMessage}
                        </div>
                    ) : null}
                </div>
                <div className='d-flex justify-content-center py-4'>
                    Error stack: {error.stack}
                </div>
            </div>
            <div className='py-2'>
                <div className='d-flex justify-content-center'>
                    To try again refresh the page
                </div>
            </div>
            {isAuthenticated ? (
                <div className='d-flex justify-content-center'>
                    <button
                        className='btn btn-warning mt-3 mx-3 align-content-center d-flex'
                        onClick={() => {
                            userInDBStore.reset();
                            logout({
                                returnTo: window.location.origin,
                            });
                        }}>
                        Logout
                    </button>
                </div>
            ) : null}
        </main>
    );
}

ErrorPage.propTypes = {
    error: PropTypes.any.isRequired,
};
