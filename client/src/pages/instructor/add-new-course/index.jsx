import CourseCurriculum from '@/components/instructor-view/courses/add-new-course/course-curriculum'
import CourseLanding from '@/components/instructor-view/courses/add-new-course/course-landing'
import CourseSettings from '@/components/instructor-view/courses/add-new-course/course-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const AddNewCoursePage = () => {
    return (
        <div className='container mx-auto p-4'>
            <div className='flex justify-between'>
                <h1 className='text-3xl font-extrabold mb-5'>Create a new Course</h1>
                <Button
                    className="text-sm tracking-wider font-bold px-8"
                >SUBMIT</Button>
            </div>

            <Separator />

            <Card className="mt-5">
                <CardContent>
                    <div className='container mx-auto py-4'>
                        <Tabs
                            defaultValue='curriculum'
                            className='space-y-4'
                        >
                            <TabsList className="py-8 sm:py-0">
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="course-landing-page" className="text-wrap">Course Landing Page</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="curriculum">
                                <CourseCurriculum />
                            </TabsContent>

                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>

                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddNewCoursePage