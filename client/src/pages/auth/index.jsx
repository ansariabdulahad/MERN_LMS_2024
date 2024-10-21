import { GraduationCap } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const AuthPage = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <header className='px-4 lg:px-6 h-14 border-b shadow-sm flex items-center'>
                <Link to={'/'} className='flex items-center justify-center'>
                    <GraduationCap className='h-8 w-8 mr-4' />
                    <span className='font-extrabold text-xl'>LMS LEARN</span>
                </Link>
            </header>
        </div>
    )
}

// next time work timestamp: 39:00 - login and signup form page work

export default AuthPage