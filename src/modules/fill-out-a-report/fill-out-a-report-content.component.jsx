import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RadioSmileContainer } from './radio-smile-container.component';
import { TextAreaCounter } from './text-area-counter.component';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Form, Formik, Field, useFormikContext } from 'formik';
import { useStore } from 'effector-react';
import { userInDBStore } from '../store/user-store';
import { createReport } from '../store/weekly-report-store';

export function FillOutAReportContent({ firstName }) {
    const userInDB = useStore(userInDBStore);

    const [dateState, setDateState] = useState({
        startDate: moment()
            .subtract(7, 'days')
            .set('hour', 12)
            .set('minute', 0),
        endDate: moment().set('hour', 12).set('minute', 0),
    });

    const [dateLabel, setDateLabel] = useState(
        dateState.startDate.format('MMMM D, YYYY') +
            ' - ' +
            dateState.endDate.format('MMMM D, YYYY')
    );

    const handleDateCallback = (startDate, endDate) => {
        let newDateState = {
            startDate: startDate.set('hour', 12).set('minute', 0),
            endDate: endDate.set('hour', 12).set('minute', 0),
        };
        setDateState(newDateState);
    };

    useEffect(() => {
        setDateLabel(
            dateState.startDate.format('MMMM D, YYYY') +
                ' - ' +
                dateState.endDate.format('MMMM D, YYYY')
        );
    }, [dateState]);

    let containerLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];
    let maxTextAreaLength = 600;

    const initFormValues = {
        moraleInput: '0',
        moraleCommentTextarea: '',
        stressInput: '0',
        stressCommentTextarea: '',
        workloadInput: '0',
        workloadCommentTextarea: '',
        highTextarea: '',
        lowTextarea: '',
        elseTextarea: '',
        date: '',
    };

    const onSubmit = async (values, { resetForm }) => {
        let createdReport = await createReport({
            companyId: userInDB.companyId,
            memberId: userInDB.id,
            moraleLevel: values.moraleInput,
            moraleCommentary: values.moraleCommentTextarea,
            stressLevel: values.stressInput,
            stressCommentary: values.stressCommentTextarea,
            workloadLevel: values.workloadInput,
            workloadCommentary: values.workloadCommentTextarea,
            highThisWeek: values.highTextarea,
            lowThisWeek: values.lowTextarea,
            anythingElse: values.elseTextarea,
            weekStartDate: dateState.startDate,
            weekEndDate: dateState.endDate,
        });
        alert('Report was successfully sent');
        // Reset Formik form
        resetForm();
        setDateState({
            startDate: moment()
                .subtract(7, 'days')
                .set('hour', 12)
                .set('minute', 0),
            endDate: moment().set('hour', 12).set('minute', 0),
        });
    };

    return (
        <div className='d-flex flex-column align-items-center w-100 text-center'>
            <h1 className='big-title brush-bg fw-bold w-100'>
                Welcome back,
                <br />
                {userInDB.firstName}.
            </h1>
            <div className='p-4'>
                Let your leader know where you&apos;re winning and struggling
                this week – in less than 10 minutes.
            </div>
            <Formik
                initialValues={initFormValues}
                onSubmit={onSubmit}
                enableReinitialize={true}>
                <Form>
                    <div className='mx-auto'>
                        <RadioSmileContainer
                            mainLabel={'How was your morale this week?'}
                            containerInputName={'moraleInput'}
                            containerLabels={containerLabels}
                            commentTextareaId={'moraleCommentTextarea'}
                        />
                        <RadioSmileContainer
                            mainLabel={'How was your stress this week?'}
                            containerInputName={'stressInput'}
                            containerLabels={containerLabels}
                            commentTextareaId={'stressCommentTextarea'}
                        />
                        <RadioSmileContainer
                            mainLabel={'How was your workload this week?'}
                            containerInputName={'workloadInput'}
                            containerLabels={containerLabels}
                            commentTextareaId={'workloadCommentTextarea'}
                        />
                        <TextAreaCounter
                            labelText={'What was your high this week?'}
                            placeholderText={
                                "What was your personal or professional high this week? What's the one thing you accomplished at work this week?"
                            }
                            idText={'whats-high-textarea'}
                            textareaName={'highTextarea'}
                            maxLength={maxTextAreaLength}
                        />
                        <TextAreaCounter
                            labelText={'What was your low this week?'}
                            placeholderText={
                                'What was your personal low this week?'
                            }
                            idText={'whats-low-textarea'}
                            textareaName={'lowTextarea'}
                            maxLength={maxTextAreaLength}
                        />
                        <TextAreaCounter
                            labelText={'Anything else?'}
                            placeholderText={
                                'Is there anything else you would like to share with your leader? *Optional'
                            }
                            idText={'anything-else-textarea'}
                            textareaName={'elseTextarea'}
                            maxLength={maxTextAreaLength}
                        />
                    </div>
                    <div className='mt-5 mb-5 small-block'>
                        <h2 className='content-block-title fw-bold p-4'>
                            Date range
                        </h2>
                        <div className='mt-3 mb-5'>
                            <div className='text-start mb-1'>
                                <label>Choose date</label>
                            </div>
                            <div className='input-group d-flex flex-row'>
                                <Field
                                    type='text'
                                    name='date'
                                    className='form-control date-range-picker-input bg-white'
                                    id='datepickerId'
                                    value={dateLabel}
                                    aria-label="Recipient's username"
                                    aria-describedby='button-addon2'
                                />
                                <DateRangePicker
                                    initialSettings={{
                                        startDate: dateState.startDate.toDate(),
                                        endDate: dateState.endDate.toDate(),
                                    }}
                                    onCallback={handleDateCallback}>
                                    <button
                                        className='btn btn-outline-secondary'
                                        type='button'
                                        id='button-addon2'>
                                        ↕
                                    </button>
                                </DateRangePicker>
                            </div>
                        </div>
                    </div>
                    <div className='mb-5 small-block'>
                        <p className='text-danger fw-bold'>
                            All fields are required unless marked as optional.
                        </p>
                        <button
                            type='submit'
                            className='btn btn-primary w-100 send-report-button bg-dark'>
                            Send Weekly Report
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}

FillOutAReportContent.propTypes = {
    firstName: PropTypes.string.isRequired,
};
