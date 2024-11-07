import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import StudentViewCommonHeader from './header';
import StudentViewCommonFooter from './footer';

const StudentViewCommonLayout = () => {

    const location = useLocation();

    return (
        <div className='flex flex-col min-h-screen'>
            {
                !location.pathname.includes('/course-progress') &&
                <StudentViewCommonHeader />
            }
            <Outlet />
            {
                !location.pathname.includes('/course-progress') &&
                <StudentViewCommonFooter />
            }
        </div>
    )
}

export default StudentViewCommonLayout