import React, { useState } from 'react';
import { InviteYourTeamSuccessMessageComponent } from './invite-your-team-success-message.component';
import { EditFieldComponent } from '../common/components/edit-field/edit-field.component';
import { Form, Formik } from 'formik';
import { inviteLinks } from '../../utils';
import { userInDBStore } from '../store/user-store';
import { useStore } from 'effector-react';
import { companyStore, getCompany } from '../store/company-store';
import { apiInvoker } from '../api/api-axios';

export function InviteYourTeamContent() {
    const [showSuccess, setShowSuccess] = useState(false);
    const formInitValues = {
        firstName: '',
        lastName: '',
        email: '',
    };
    const userInDb = useStore(userInDBStore);
    const company = useStore(companyStore);
    const onSubmit = async (values, { setSubmitting }) => {
        setTimeout(async () => {
            let resp = await apiInvoker.companies.get(userInDb.companyId);
            console.log(resp.data.name);
            console.log(company.name);
            //
            console.log(
                inviteLinks.generateLink(userInDb, resp.data.name, values)
            );
            //
            alert(
                `This link should be sent to ${values.email} with the title "Accept invite":\n` +
                    `${inviteLinks.generateLink(
                        userInDb,
                        resp.data.name,
                        values
                    )}`
            );
            setSubmitting(false);
        }, 400);
    };
    return (
        <div>
            {showSuccess ? <InviteYourTeamSuccessMessageComponent /> : null}
            <div className='p-2 container-fluid'>
                <div className='form mx-auto'>
                    <div className='card shadow-sm'>
                        <div className='card-body'>
                            <div className='pb-2'>
                                <strong>
                                    Enter the team member you would like to
                                    invite.
                                </strong>
                            </div>
                            <div className='pb-2'>
                                Don&apos;t Worry! You&apos;ll be able to add
                                more team members later.
                            </div>
                            <Formik
                                initialValues={formInitValues}
                                onSubmit={onSubmit}>
                                <Form>
                                    <EditFieldComponent label={'First Name'} />
                                    <EditFieldComponent label={'Last Name'} />
                                    <EditFieldComponent label={'Email'} />
                                    <button className='btn btn-warning mt-3'>
                                        Invite
                                    </button>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
