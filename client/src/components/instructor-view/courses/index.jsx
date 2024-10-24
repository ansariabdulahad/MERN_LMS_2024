import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Delete, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const InstructorCourses = () => {

    const navigate = useNavigate();

    return (

        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="sm:text-3xl font-extrabold">
                    All Courses
                </CardTitle>
                <Button
                    className="p-2 sm:p-6 text-wrap"
                    onClick={() => navigate('/instructor/create-new-course')}
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
                            <TableRow>
                                <TableCell>React JS Full Course 2025</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>$5000</TableCell>
                                <TableCell className="text-right">
                                    <Button className="hover:text-green-500" size="sm" variant="ghost">
                                        <Edit className='h-6 w-6' />
                                    </Button>
                                    <Button className="hover:text-red-500" size="sm" variant="ghost">
                                        <Delete className='h-6 w-6' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default InstructorCourses