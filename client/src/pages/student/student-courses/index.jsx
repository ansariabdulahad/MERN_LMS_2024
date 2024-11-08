import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context'
import { fetchStudentBoughtCoursesService } from '@/services/student-course-services';
import { Watch } from 'lucide-react';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const StudentCoursesPage = () => {

    const { studentBoughtCoursesList, setStudentBoughtCoursesList,
        loadingState, setLoadingState
    } = useContext(StudentContext);
    const { auth } = useContext(AuthContext);

    const navigate = useNavigate();

    // fetch student bought courses list
    const fetchStudentBoughtCourses = async () => {
        try {
            const response = await fetchStudentBoughtCoursesService(auth?.user?._id);

            if (response?.success) {
                setLoadingState(false);
                setStudentBoughtCoursesList(response?.data);
            }
        } catch (error) {
            setLoadingState(false);
            console.error(error, "Error fetching student bought courses list!");
        }
    }

    useEffect(() => {
        fetchStudentBoughtCourses();
    }, []);

    if (loadingState) return <div className='flex-1'><Skeleton /></div>

    return (
        <div className='flex-1 p-4'>
            <h1 className='text-3xl font-bold mb-8'>My Courses</h1>

            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {
                    studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                        studentBoughtCoursesList.map((course) => (
                            <Card
                                key={course._id}
                                className="flex flex-col"
                            >
                                <CardContent className="p-4 flex-grow">
                                    <img src={course.courseImage} alt={course.title}
                                        className='h-52 w-full object-cover rounded-md mb-4'
                                    />
                                    <h3 className='capitalize font-bold mb-1'>{course.title}</h3>
                                    <p className='capitalize text-sm text-gray-700 mb-2'>{course.instructorName}</p>
                                </CardContent>

                                <CardFooter>
                                    <Button className="flex-1"
                                        onClick={() => navigate(`/course-progress/${course.courseId}`)}
                                    >
                                        <Watch className='mr-2 h-4 w-4' />
                                        Start Watching
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <h1 className='text-3xl font-bold'>There is no bought courses found, please buy a course</h1>
                    )
                }
            </div>
        </div >
    )
}

export default StudentCoursesPage