import React from 'react';
import { TextHeaderComponent } from '../../headers/text-header/text-header.component';
import { Helmet } from 'react-helmet';
import { EditFieldComponent } from '../../common/components/edit-field/edit-field.component';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { getUserFromDB, userInDBStore } from '../../store/user-store';
import { createMember } from '../../store/team-member-store';
import { useAuth0 } from '@auth0/auth0-react';
import { inviteLinks } from '../../../utils';
import { apiInvoker, setTokenToStore } from '../../api/api-axios';
import { setIsWaitingResponse } from '../../store/user-request-store';

export function AcceptInviteComponent({ inviterName, company }) {
    const userInDB = useStore(userInDBStore);
    let { hashedParams } = useParams();
    const {
        user,
        logout,
        isAuthenticated,
        getAccessTokenSilently,
        loginWithPopup,
    } = useAuth0();
    const navigate = useNavigate();
    let isRegistered = userInDB.id !== null;

    let linkIsValid = true;
    let linkParams;
    try {
        linkParams = inviteLinks.parseLinkParams(hashedParams);
    } catch (e) {
        linkIsValid = false;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const formInitValues = {
        firstName: searchParams.get('firstName'),
        lastName: searchParams.get('lastName'),
        title: searchParams.get('title'),
    };
    const onSubmit = async (values, { setSubmitting }) => {
        await createMember({
            companyId: linkParams.company.id,
            firstName: values.firstName,
            lastName: values.lastName,
            title: values.title,
            email: user.email,
            sub: user.sub,
            companyName: linkParams.company.name,
            inviteLink: 'example.com',
        });
        await getUserFromDB();
        console.log(userInDB);
        debugger;
        await apiInvoker.links.updateLeaders(
            userInDB.id,
            linkParams.inviter.id
        );
        navigate('/');
    };

    let content;

    const login = async () => {
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

    if (!isAuthenticated) {
        content = (
            <>
                <p className='mx-auto'>
                    You should login or sign up to accept invite
                </p>
                <button
                    className='btn btn-lg btn-warning mt-3 mx-3 d-flex'
                    onClick={login}>
                    Log In
                </button>
            </>
        );
    } else if (!linkIsValid) {
        content = <p className='mx-auto'>Error: invalid invite link</p>;
    } else if (isRegistered) {
        content = (
            <p className='mx-auto'>
                Error: registered users can&apos;t accept invites
            </p>
        );
    } else {
        content = (
            <>
                <p className='mx-auto'>
                    {linkParams.inviter.name} invited you to{' '}
                    {linkParams.company.name}.
                </p>
                <Formik initialValues={formInitValues} onSubmit={onSubmit}>
                    {({ isSubmitting }) => (
                        <Form className='mx-auto'>
                            <EditFieldComponent
                                label='First name'
                                width='600px'
                            />
                            <EditFieldComponent
                                label='Last name'
                                width='600px'
                            />
                            <EditFieldComponent label='Title' width='600px' />
                            <div className='text-center'>
                                <button
                                    type='submit'
                                    className='btn btn-warning m-3'
                                    disabled={isSubmitting}>
                                    Accept invite
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }
    return (
        <main className='flex-grow-1 overflow-auto mx-0'>
            <Helmet>
                <title>Accept invite</title>
            </Helmet>
            <TextHeaderComponent title={'Accept Invite'} />
            <div className='p-5 mx-5 d-flex flex-column justify-content-center'>
                {content}
            </div>
        </main>
    );
}

AcceptInviteComponent.propTypes = {
    inviterName: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    hashedParams: PropTypes.string,
};
