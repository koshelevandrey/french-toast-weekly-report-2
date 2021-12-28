import React, { useState } from 'react';
import { TextHeaderComponent } from '../../headers/text-header/text-header.component';
import { Helmet } from 'react-helmet';
import { useStore } from 'effector-react';
import { userInDBStore } from '../../store/user-in-d-b-store';
import { apiInvoker } from '../../api/api-axios';
import { inviteLinks } from '../../../utils';
import { InviteYourTeamSuccessMessageComponent } from '../../invite-your-team/invite-your-team-success-message.component';
import { Form, Formik } from 'formik';
import { EditFieldComponent } from '../../common/components/edit-field/edit-field.component';
import { setInviteSuccessMessageLinkToStore } from '../../store/invite-success-message-link-store';
import emailjs from 'emailjs-com';
import { setFailedToSendEmailStore } from '../../store/failed-to-send-email-store';

export function InviteYourTeam() {
    const [showExtraMessage, setShowExtraMessage] = useState(false);
    const formInitValues = {
        firstName: '',
        lastName: '',
        email: '',
    };
    const userInDb = useStore(userInDBStore);

    const onSubmit = async (values, { setSubmitting }) => {
        let resp = await apiInvoker.companies.get(userInDb.companyId);
        const generatedLink = inviteLinks.generateLink(
            userInDb,
            resp.data.name,
            values
        );
        setInviteSuccessMessageLinkToStore(generatedLink);

        // Send email
        const emailParams = {
            to_name: values.firstName + ' ' + values.lastName,
            from_name: userInDb.firstName + ' ' + userInDb.lastName,
            invite_link: generatedLink,
            email: values.email,
        };
        try {
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                emailParams,
                process.env.REACT_APP_EMAILJS_USER_ID
            );
            setFailedToSendEmailStore(false);
        } catch (error) {
            console.log("Couldn't send email", error);
            setFailedToSendEmailStore(true);
        } finally {
            setShowExtraMessage(true);
        }

        setSubmitting(false);
    };

    return (
        <main className='flex-grow-1 overflow-auto'>
            <Helmet>
                <title>Invite your team</title>
            </Helmet>
            <TextHeaderComponent title={'Invite Your Team'} />
            <div className='p-2 container-fluid'>
                {showExtraMessage ? (
                    <InviteYourTeamSuccessMessageComponent />
                ) : null}
                <div className='form mx-auto card shadow-sm card-body'>
                    <div className='pb-2 fw-bold'>
                        Enter the team member you would like to invite.
                    </div>
                    <div className='pb-2'>
                        Don&apos;t Worry! You&apos;ll be able to add more team
                        members later.
                    </div>
                    <Formik initialValues={formInitValues} onSubmit={onSubmit}>
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
        </main>
    );
}

InviteYourTeam.propTypes = {};
