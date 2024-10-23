import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div>
            This page doesn't exist!
            <Button>
                <Link to={'/'} >Go Back To Home</Link>
            </Button>
        </div>
    )
}

export default NotFoundPage