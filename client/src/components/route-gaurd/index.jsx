import React, { Fragment, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const RouteGaurd = ({ authenticated, user, element }) => {

    const location = useLocation();

    // check if the user is not authenticated and trying to access location other than auth
    if (!authenticated && !location.pathname.includes('/auth')) {
        return <Navigate to={'/auth'} />
    }

    // check if the user is authenticated and user is not an instructor and try to access instructor location
    if (authenticated && user?.role !== 'instructor' &&
        (location.pathname.includes('/instructor') || location.pathname.includes('/auth'))) {
        return <Navigate to={'/home'} />
    }

    // check the user is authenticated and user is instructor and trying to access not instructor page
    if (authenticated && user?.role === 'instructor' && !location.pathname.includes('instructor')) {
        return <Navigate to={'/instructor'} />
    }

    // and last simply return the current page
    return (
        <Fragment>{element}</Fragment>
    )
}

export default RouteGaurd