import { AuthContext } from '@/context/auth-context'
import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { Button } from '../ui/button';

const StudentViewCommonLayout = () => {

    const { resetCredentials } = useContext(AuthContext);

    // handle logout
    const handleLogout = () => {
        resetCredentials();
    }

    return (
        <div>
            Common Content
            <Button
                onClick={handleLogout}
            >Logout</Button>
            <Outlet />
        </div>
    )
}

export default StudentViewCommonLayout