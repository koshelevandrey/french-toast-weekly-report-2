import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TextWithDateHeaderComponent } from '../../headers/text-with-date-header/text-with-date-header.component';
import { TitleBlockComponent } from '../../containers/title-block/title-block.component';
import { ContentBlockComponent } from '../../containers/content-block/content-block.component';
import { EditFieldComponent } from '../../common/components/edit-field/edit-field.component';
import { Helmet } from 'react-helmet';
import { Form, Formik } from 'formik';
import { useStore } from 'effector-react';
import { apiInvoker } from '../../api/api-axios';
import { companyStore, getCompany } from '../../store/company-store';
import { userInDBStore } from '../../store/user-store';

export function MyCompanyComponent() {
    const { name: companyName, joinedDate, companyId } = useStore(companyStore);
    const userInDB = useStore(userInDBStore);
    useEffect(() => {
        getCompany(userInDB.companyId);
    }, []);

    const formInitValues = { companyName: '' };
    const onSubmit = async (values, { setSubmitting }) => {
        await apiInvoker.companies.update(
            userInDB.companyId,
            values.companyName
        );
        await getCompany(userInDB.companyId);
        setSubmitting(false);
    };

    return (
        <main className='flex-grow-1 overflow-auto'>
            <Helmet>
                <title>My company</title>
            </Helmet>
            <TextWithDateHeaderComponent
                joinedDate={joinedDate}
                companyName={companyName}
            />
            <div className='p-5 mx-5 d-flex flex-column'>
                <TitleBlockComponent
                    title={`Edit ${companyName}'s information`}>
                    You may edit the company name, as well as
                    deactivate/activate the Weekly Report tool functionality. If
                    you need to edit a team member&apos;s information, you can
                    access that information by seeing the list of team members.
                </TitleBlockComponent>
                <ContentBlockComponent title={`Rename ${companyName}`}>
                    <Formik initialValues={formInitValues} onSubmit={onSubmit}>
                        <Form>
                            <EditFieldComponent
                                label='Change company name.'
                                name='companyName'
                                width='450px'
                            />
                            <button
                                className='btn btn-outline-dark mt-2'
                                type='submit'>
                                Save name change
                            </button>
                        </Form>
                    </Formik>
                </ContentBlockComponent>
                <ContentBlockComponent
                    title={`See list of ${companyName}'s members`}>
                    <p className='mt-4'>
                        If you need to edit a particular team member, you can
                        see a complete list of team members and visit their
                        profile to make edits.{' '}
                        <b>
                            You will not be able to see a team member&apos;s
                            weekly report.
                        </b>
                    </p>
                    <Link to='/team-members'>
                        <button className='btn btn-outline-dark mt-2'>
                            See All Team Members
                        </button>
                    </Link>
                </ContentBlockComponent>
            </div>
        </main>
    );
}
