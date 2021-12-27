import React, { useEffect } from 'react';
import { Route, Router, Routes } from 'react-router-dom';

import { SidebarComponent } from '../common/components/sidebar/sidebar.component';
import { LaunchGuide } from '../pages/launch-guide/launch-guide.component';
import { InviteYourTeam } from '../pages/invite-your-team/invite-your-team.component';
import { TeamReports } from '../pages/team-reports/team-reports.component';
import { MyReports } from '../pages/my-reports/my-reports.component';
import { FillOutAReport } from '../pages/fill-out-a-report/fill-out-a-report.component';
import { MyCompanyComponent } from '../pages/my-company/my-company.component';
import { WeeklyReportHistory } from '../pages/weekly-report-hisory/weekly-report-hisory.component';
import { TeamMembers } from '../pages/team-members/team-members.component';
import { EditMemberInformation } from '../pages/edit-member-information/edit-member-information.component';
import { TeamHeaderContainerComponent } from '../pages/team-reports/team-header-container.component';

import { teamReportsStub } from '../../stub-data/teamReportsStub';
import { myReportStub } from '../../stub-data/myReportStub';
import { fillOOutAReport } from '../../stub-data/fillOutAReportStub';
import { myCompanyStub } from '../../stub-data/myCompanyStub';
import { weeklyReportHistory } from '../../stub-data/weeklyReportHistoryStub';
import { teamMembersStub } from '../../stub-data/teamMembersStub';
import { editMemberInformationStub } from '../../stub-data/editMemberInformationStub';
import { NewCompanyRegistration } from '../pages/register-new-company/register-new-company.component';
import { FeedbackButtonComponent } from '../common/components/buttons/feedback-button.component';
import { HelpButtonComponent } from '../common/components/buttons/help-button.component';
import { Loading } from '../common/components/loading/loading.component';
import { useAuth0 } from '@auth0/auth0-react';
import { RequireAuth } from '../common/components/auth/require-auth.component';
import { Login } from '../common/components/login/login.component';
import { AcceptInviteComponent } from '../pages/accept-invite/accept-invite.component';
import { CompleteRegistration } from '../pages/complete-registration/complete-registration.component';
import { useStore } from 'effector-react';
import { getUserFromDB, userInDBStore } from '../store/user-store';
import {
    isWaitingResponse,
    setIsWaitingResponse,
} from '../store/user-request-store';
import { errorStore } from '../store/error-store';
import { ErrorPage } from '../pages/error/error-page.component';
import {
    setTriedToGetUserFromDBToStore,
    triedToGetUserFromDBStore,
} from '../store/tride-to-get-user-from-db-store';
import { setTokenToStore, tokenFromStore } from '../api/api-axios';

export function App() {
    const isWaitingLoad = useStore(isWaitingResponse);
    const {
        isLoading,
        isAuthenticated,
        loginWithPopup,
        getAccessTokenSilently,
    } = useAuth0();
    const userInDB = useStore(userInDBStore);
    const innerError = useStore(errorStore);
    const storeToken = useStore(tokenFromStore);
    const triedToGetUserFromDB = useStore(triedToGetUserFromDBStore);

    // Эффект, осуществляющий авторизацию через Auth0
    useEffect(async () => {
        if (!isAuthenticated && !isLoading && !isWaitingLoad) {
            setIsWaitingResponse(true);
            try {
                await loginWithPopup();
            } catch (error) {
                console.error(error);
                return error;
            } finally {
                setIsWaitingResponse(false);
            }
        }
    }, [isAuthenticated, isLoading, isWaitingLoad]);

    // Эффект, кладущий токен в store после авторизации через Auth0
    useEffect(async () => {
        if (isAuthenticated) {
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
        }
    }, [isAuthenticated]);

    // Эффект, делающий запрос на пользователя в БД и кладущий его в store в случае успеха
    useEffect(async () => {
        if (isAuthenticated && storeToken) {
            setIsWaitingResponse(true);
            await getUserFromDB();
            setIsWaitingResponse(false);
            setTriedToGetUserFromDBToStore(true);
        }
    }, [isAuthenticated, storeToken]);

    if (innerError) {
        return <ErrorPage error={innerError} />;
    }

    if (isLoading || isWaitingLoad) {
        return <Loading />;
    }

    // Idk how to make it right with routing:
    if (window.location.pathname.startsWith('/accept-invite/')) {
        return (
            <Routes>
                <Route path='/' element={<App />} />
                <Route
                    path='/accept-invite/:hashedParams'
                    element={
                        <AcceptInviteComponent
                            company={'Company'}
                            inviterName={'Name'}
                        />
                    }
                />
            </Routes>
        );
    }

    if (isAuthenticated && storeToken && triedToGetUserFromDB && !userInDB.id) {
        // Пользователь авторизован через Auth0, но в БД его нет, показываем страницу Complete Registration
        return <CompleteRegistration />;
    }

    // Пользователь авторизован через Auth0 и есть в БД, показываем обычную страницу
    return (
        <div className='d-flex h-100'>
            <FeedbackButtonComponent />
            <HelpButtonComponent />
            <SidebarComponent />
            <Routes>
                <Route path='/invite-your-team' element={<InviteYourTeam />} />
                <Route
                    path='/team-reports'
                    element={<TeamHeaderContainerComponent />}>
                    <Route
                        path='immediate-team'
                        element={<TeamReports {...teamReportsStub} />}
                    />
                    <Route
                        path='extended-team'
                        element={
                            <WeeklyReportHistory {...weeklyReportHistory} />
                        }
                    />
                </Route>
                <Route
                    path='/my-reports'
                    element={<MyReports {...myReportStub} />}
                />
                <Route
                    path='/fill-out-a-report'
                    element={<FillOutAReport {...fillOOutAReport} />}
                />
                <Route
                    path='/fill-out-a-report'
                    element={<FillOutAReport {...fillOOutAReport} />}
                />
                <Route
                    path='/my-company'
                    element={<MyCompanyComponent {...myCompanyStub} />}
                />
                <Route
                    path='/register-new-company'
                    element={<NewCompanyRegistration />}
                />
                <Route
                    path='/team-members'
                    element={<TeamMembers {...teamMembersStub} />}
                />
                <Route
                    path='/edit-member-information'
                    element={
                        <RequireAuth>
                            <EditMemberInformation
                                {...editMemberInformationStub}
                            />
                        </RequireAuth>
                    }
                />
                <Route path='/login' element={<Login />} />
                <Route
                    path='/complete-registration'
                    element={<CompleteRegistration />}
                />
                <Route path='/' element={<LaunchGuide />} />
                <Route
                    path='/accept-invite/:hashedParams'
                    element={
                        <AcceptInviteComponent
                            company={'Company'}
                            inviterName={'Name'}
                        />
                    }
                />
            </Routes>
        </div>
    );
}
