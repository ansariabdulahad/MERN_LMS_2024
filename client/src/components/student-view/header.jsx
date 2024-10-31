import { GraduationCap, TvMinimalPlay } from 'lucide-react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { AuthContext } from '@/context/auth-context'

const StudentViewCommonHeader = () => {

    // handle logout 
    const { resetCredentials } = useContext(AuthContext);

    // handle logout
    const handleLogout = (event) => {
        const logoutBtn = event.target;

        logoutBtn.innerHTML = "Logging out...";
        logoutBtn.disabled = true;

        resetCredentials();
    }

    return (
        <header className='flex items-center justify-between p-4 border-b relative'>
            <div className='flex items-center space-x-4'>
                <Link to={'/home'} className='flex items-center hover:text-black'>
                    <GraduationCap className='h-8 w-8 mr-2' />
                    <span className='font-extrabold md:text-xl text-[14px]'>LMS LEARN</span>
                </Link>

                <div className='flex items-center space-x-1'>
                    <Button className="text-[14px] md:text-[16px] font-medium"
                        variant="ghost"
                    >
                        Explore Courses
                    </Button>
                </div>
            </div>

            <div className='flex items-center space-x-4'>
                <div className='flex flex-col sm:flex-row gap-4 items-center'>
                    <div className='flex items-center gap-3'>
                        <span className='text-[14px] md:text-[16px] font-medium'>My Courses</span>
                        <TvMinimalPlay className='w-8 h-8 cursor-pointer' />
                    </div>

                    <Button
                        onClick={handleLogout}
                    >Sign Out</Button>
                </div>
            </div>
        </header>
    )
}

export default StudentViewCommonHeader