import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useContext } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Delete, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { InstructorContext } from '@/context/instructor-context'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'

const InstructorCourses = ({ listOfCourses }) => {

    const navigate = useNavigate();
    const { setCurrentEditedCourseId, setCourseCurriculumFormData,
        setCourseLandingFormData
    } = useContext(InstructorContext);

    return (

        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="sm:text-3xl font-extrabold">
                    All Courses
                </CardTitle>
                <Button
                    className="p-2 sm:p-6 text-wrap"
                    onClick={() => {
                        setCurrentEditedCourseId(null);
                        setCourseCurriculumFormData(courseCurriculumInitialFormData);
                        setCourseLandingFormData(courseLandingInitialFormData);
                        navigate('/instructor/create-new-course');
                    }}
                >
                    Create New Course
                </Button>
            </CardHeader>

            <CardContent>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                listOfCourses && listOfCourses.length > 0 ? (
                                    listOfCourses.map((course) => (
                                        <TableRow key={course?._id}>
                                            <TableCell>{course?.title}</TableCell>
                                            <TableCell>{course?.students?.length}</TableCell>
                                            <TableCell>${(course?.students?.length * course?.pricing)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    onClick={() => {
                                                        navigate(`/instructor/edit-course/${course?._id}`);
                                                    }}
                                                    className="hover:text-green-500" size="sm" variant="ghost">
                                                    <Edit className='h-6 w-6' />
                                                </Button>
                                                <Button className="hover:text-red-500" size="sm" variant="ghost">
                                                    <Delete className='h-6 w-6' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (null)
                            }
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default InstructorCourses