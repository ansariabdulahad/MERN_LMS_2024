import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
import RouteGaurd from './components/route-gaurd'
import { AuthContext } from './context/auth-context'
import InstructorDashboardPage from './pages/instructor'
import StudentHomePage from './pages/student/home'
import StudentViewCommonLayout from './components/student-view/common-layout'
import NotFoundPage from './pages/not-found'

const App = () => {

  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Wrap the route with routeGaurd component to protect */}
      <Route
        path='/auth'
        element={<RouteGaurd
          authenticated={auth && auth.authenticated}
          user={auth && auth.user}
          element={<AuthPage />}
        />}
      />

      {/* Instructor route */}
      <Route
        path='/instructor'
        element={<RouteGaurd
          authenticated={auth && auth.authenticated}
          user={auth && auth.user}
          element={<InstructorDashboardPage />}
        />}
      />

      {/* Student route */}
      <Route
        path='/'
        element={<RouteGaurd
          authenticated={auth && auth.authenticated}
          user={auth && auth.user}
          element={<StudentViewCommonLayout />}
        />}
      >
        <Route path='' element={<StudentHomePage />} />
        <Route path='home' element={<StudentHomePage />} />
      </Route>

      {/* Not found page route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App