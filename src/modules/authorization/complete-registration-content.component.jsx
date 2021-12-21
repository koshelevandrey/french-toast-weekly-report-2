import React from 'react';
import { EditFieldComponent } from '../common/components/edit-field/edit-field.component';
import { Form, Formik } from 'formik';
import { createCompany } from '../store/company-store';
import { createMember } from '../store/team-member-store';
import { useAuth0 } from '@auth0/auth0-react';
import { userStore } from '../store/user-store';

export function CompleteRegistrationContent() {
    const initFormValues = {
        firstName: '',
        lastName: '',
        companyName: '',
        title: '',
    };
    const { user, logout } = useAuth0();
    const onSubmit = async (values) => {
        let createdCompany = await createCompany(values.companyName);

        let createdMember = await createMember({
            companyId: createdCompany.id,
            firstName: values.firstName,
            lastName: values.lastName,
            title: values.title,
            email: user.email,
            sub: user.sub,
            companyName: createdCompany.name,
            //TODO: add invite link generation
            inviteLink: 'example.com',
        });

        window.location.reload();
    };

    return (
        <div>
            <div className='p-2 container-fluid'>
                <div className='form mx-auto'>
                    <div className='card shadow-sm'>
                        <div className='card-body d-flex flex-column'>
                            <p>
                                To continue using the service you must complete
                                registration.
                            </p>
                            <Formik
                                initialValues={initFormValues}
                                onSubmit={onSubmit}>
                                <Form>
                                    <EditFieldComponent label='First name' />
                                    <EditFieldComponent label='Last name' />
                                    <EditFieldComponent
                                        label='New company name'
                                        name='companyName'
                                    />
                                    <EditFieldComponent label='Title' />
                                    <button
                                        type='submit'
                                        className='btn btn-warning mt-3'>
                                        Complete registration
                                    </button>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <button
                    className='btn btn-warning mt-3 mx-3 align-content-center d-flex'
                    onClick={() => {
                        userStore.reset();
                        logout({
                            returnTo: window.location.origin,
                        });
                    }}>
                    Logout
                </button>
            </div>
        </div>
    );
}
