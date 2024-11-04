import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/auth'
import RouteGaurd from './components/route-gaurd'
import { AuthContext } from './context/auth-context'
import InstructorDashboardPage from './pages/instructor'
import StudentHomePage from './pages/student/home'
import StudentViewCommonLayout from './components/student-view/common-layout'
import NotFoundPage from './pages/not-found'
import AddNewCoursePage from './pages/instructor/add-new-course'
import StudentViewCoursesPage from './pages/student/courses'
import StudentViewCourseDetailsPage from './pages/student/course-details'
import PaypalPaymentReturnPage from './pages/student/payment-return'
import StudentCoursesPage from './pages/student/student-courses'
import StudentViewCourseProgressPage from './pages/student/course-progress'

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
      <Route
        path='/instructor/create-new-course'
        element={<RouteGaurd
          authenticated={auth && auth.authenticated}
          user={auth && auth.user}
          element={<AddNewCoursePage />}
        />}
      />
      <Route
        path='/instructor/edit-course/:courseId'
        element={<RouteGaurd
          authenticated={auth && auth.authenticated}
          user={auth && auth.user}
          element={<AddNewCoursePage />}
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
        <Route path='courses' element={<StudentViewCoursesPage />} />
        <Route path='course/details/:id' element={<StudentViewCourseDetailsPage />} />
        <Route path='student-courses' element={<StudentCoursesPage />} />
        <Route path='course-progress/:id' element={<StudentViewCourseProgressPage />} />
        {/* paypal route */}
        <Route path='payment-return' element={<PaypalPaymentReturnPage />} />
      </Route>

      {/* Not found page route */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App