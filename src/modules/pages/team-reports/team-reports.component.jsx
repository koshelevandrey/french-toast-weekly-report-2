import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TeamReportsHeader } from '../../team-reports/team-reports-header.component';
import { TeamReportsContent } from '../../team-reports/team-reports-content.component';
import { Helmet } from 'react-helmet';
import { ReportCalendar } from '../../common/components/topbar/report-calendar.component';
import { weeklyLabel } from '../../common/utils/get-week';
import { Outlet, useNavigate } from 'react-router-dom';

export function TeamReports({ previousPeriod, currentPeriod, members }) {
    let navigate = useNavigate();
    useEffect(() => {
        navigate('current');
    }, []);

    const weeks = weeklyLabel(new Date());
    return (
        <main className='flex-grow-1 overflow-auto'>
            <Helmet>
                <title>Team reports</title>
            </Helmet>
            <TeamReportsHeader members={members} />
            <div className='d-flex flex-column align-items-center w-100'>
                <ReportCalendar
                    currentPeriod={weeks.currentWeek}
                    previousPeriod={weeks.previousWeek}
                />
                <Outlet />
            </div>
        </main>
    );
}

TeamReports.propTypes = {
    previousPeriod: PropTypes.string.isRequired,
    currentPeriod: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(
        PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string.isRequired,
            avatarPath: PropTypes.string,
            weeklyInformation: PropTypes.arrayOf(
                PropTypes.shape({
                    stateName: PropTypes.string,
                    stateLevel: PropTypes.number,
                    comments: PropTypes.string,
                })
            ),
            weeklyNotations: PropTypes.arrayOf(
                PropTypes.shape({
                    text: PropTypes.string,
                    title: PropTypes.string,
                })
            ),
        })
    ),
};
