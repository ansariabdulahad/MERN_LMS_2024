import { Github, Linkedin } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const StudentViewCommonFooter = () => {
    return (
        <footer className='flex items-center justify-center bg-gray-900 text-white gap-4 p-4'>
            Connect On
            <Link to={'https://www.linkedin.com/in/abdul-ahad-ansari-651294243/'}
                className='flex items-center underline hover:text-blue-500'
                target='_blank'
            >
                <Linkedin className='w-4 h-4 mr-2' />
                Linked In</Link>
            <Link to={'https://github.com/ansariabdulahad'}
                className='flex items-center underline hover:text-blue-500'
                target='_blank'
            >
                <Github className='w-4 h-4 mr-2' />
                GitHub</Link>

            <p>@ Ansari Abdul Ahad</p>
        </footer>
    )
}

export default StudentViewCommonFooter