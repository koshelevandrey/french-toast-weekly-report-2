import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { userInDBStore } from '../../../store/user-store';

export function SignOutButtonComponent({ extraClasses, iconClass }) {
    const { logout } = useAuth0();
    return (
        <li className={`nav-item p-2 ${extraClasses ? extraClasses : ''}`}>
            <button
                className='nav-link'
                onClick={() => {
                    userInDBStore.reset();
                    logout({
                        returnTo: window.location.origin,
                    });
                }}>
                {iconClass ? <i className={iconClass} /> : ''}
                {iconClass ? ' ' : ''}Sign Out
            </button>
        </li>
    );
}

SignOutButtonComponent.propTypes = {
    extraClasses: PropTypes.string,
    iconClass: PropTypes.string,
};
