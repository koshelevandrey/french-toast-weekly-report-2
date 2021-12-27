import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { WeeklyReportHistoryHeader } from '../../headers/weekly-report-hisory-header/weekly-report-hisory-header.component';
import { SelectingReportCharacteristics } from '../../weekly-report-history/selecting-report-characteristics.component';
import { SectionLabel } from '../../common/components/labels/section-label.component';
import { WeeklyLabels } from '../../weekly-report-history/weekly-labels.component';
import { ReportCalendar } from '../../common/components/topbar/report-calendar.component';
import { ReportEmotionalCard } from '../../weekly-report-history/report-card.component';
import { Helmet } from 'react-helmet';
import { weeklyLabel } from '../../common/utils/get-week';
import {
    extendReports,
    getOldExtendReports,
} from '../../store/extended-reports-store';
import { userInDBStore } from '../../store/user-store';
import { useStore } from 'effector-react';

export function WeeklyReportHistory({
    previousPeriod,
    currentPeriod,
    totalMood,
    membersMood,
}) {
    const [showingTotalMood, setShowingTotalMood] = useState('overall');
    const userInDB = useStore(userInDBStore);
    const oldReports = useStore(extendReports);
    useEffect(() => {
        let currentDate = new Date();
        //TODO use records for report
        getOldExtendReports({
            companyId: userInDB.companyId,
            memberId: userInDB.id,
            currentDate: +currentDate,
        });
    }, []);

    const allGradeLevels = [];
    const average = (arr, index) => {
        const tags = ['moraleLevel', 'stressLevel', 'workloadLevel'];
        let divider = 0;
        let sum = tags.reduce((res, key) => {
            divider = arr[key][index] !== 0 ? divider + 1 : divider;
            return res + arr[key][index];
        }, 0);
        return divider > 0 ? Math.round(sum / divider) : 0;
    };
    let membersEmotionalConsist = oldReports.map((oldReport, index) => {
        let moods;
        switch (showingTotalMood) {
            case 'morale':
                moods = oldReport.moraleLevel;
                break;
            case 'stress':
                moods = oldReport.stressLevel;
                break;
            case 'workload':
                moods = oldReport.workloadLevel;
                break;
            case 'overall':
                moods = oldReport.moraleLevel.map((el, idx) => {
                    return average(oldReport, idx);
                });
                break;
        }
        allGradeLevels.push(moods);
        return (
            <ReportEmotionalCard
                memberName={`${oldReport.firstName} ${oldReport.firstName}`}
                mood={moods}
                key={index}
            />
        );
    });

    let totalmood;
    if (oldReports.length > 0) {
        let mood;
        switch (showingTotalMood) {
            case 'morale':
                mood = 'moraleLevel';
                break;
            case 'stress':
                mood = 'stressLevel';
                break;
            case 'workload':
                mood = 'workloadLevel';
                break;
            case 'overall':
                mood = 'overall';
                break;
        }

        let averageMood = new Array(10);
        averageMood.fill(0);
        oldReports.forEach((oldReport) => {
            if (allGradeLevels.length > 0) {
                for (let i = 0; i < 10; i++) {
                    let sum = 0;
                    let div = 0;
                    for (let k = 0; k < oldReports.length; k++) {
                        div = allGradeLevels[k][i] !== 0 ? div + 1 : div;
                        sum += allGradeLevels[k][i];
                    }
                    averageMood[i] = div !== 0 ? Math.round(sum / div) : 0;
                }
            }
        });

        totalmood = (
            <ReportEmotionalCard
                memberName={totalMood[showingTotalMood].memberName}
                mood={averageMood}
            />
        );
    }

    const weeks = weeklyLabel(new Date());

    return (
        <main className='main-background flex-grow-1 overflow-auto'>
            <Helmet>
                <title>Weekly report history</title>
            </Helmet>
            <WeeklyReportHistoryHeader />
            <div className='d-flex flex-column align-items-center w-100'>
                <ReportCalendar
                    currentPeriod={weeks.currentWeek}
                    previousPeriod={weeks.previousWeek}
                />
                <SelectingReportCharacteristics
                    setStateLink={setShowingTotalMood}
                />
                <SectionLabel labelText={'extended team average'} />
                <WeeklyLabels />
                {totalmood}
                <SectionLabel labelText={'extended team'} />
                <WeeklyLabels />
                {membersEmotionalConsist}
            </div>
        </main>
    );
}

WeeklyReportHistory.propTypes = {
    previousPeriod: PropTypes.string,
    currentPeriod: PropTypes.string,
    totalMood: PropTypes.shape({
        overall: PropTypes.shape({
            memberName: PropTypes.string,
            mood: PropTypes.arrayOf(PropTypes.number),
        }),
        morale: PropTypes.shape({
            memberName: PropTypes.string,
            mood: PropTypes.arrayOf(PropTypes.number),
        }),
        stress: PropTypes.shape({
            memberName: PropTypes.string,
            mood: PropTypes.arrayOf(PropTypes.number),
        }),
        workload: PropTypes.shape({
            memberName: PropTypes.string,
            mood: PropTypes.arrayOf(PropTypes.number),
        }),
    }),
    membersMood: PropTypes.arrayOf(
        PropTypes.shape({
            memberName: PropTypes.string,
            mood: PropTypes.arrayOf(PropTypes.number),
        })
    ),
};
