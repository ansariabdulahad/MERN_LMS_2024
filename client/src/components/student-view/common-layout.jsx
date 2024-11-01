import React from 'react'
import { Outlet } from 'react-router-dom'
import StudentViewCommonHeader from './header';
import StudentViewCommonFooter from './footer';

const StudentViewCommonLayout = () => {

    return (
        <div className='flex flex-col min-h-screen'>
            <StudentViewCommonHeader />
            <Outlet />
            <StudentViewCommonFooter />
        </div>
    )
}

export default StudentViewCommonLayout