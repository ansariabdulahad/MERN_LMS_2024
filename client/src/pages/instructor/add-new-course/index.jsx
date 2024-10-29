import CourseCurriculum from '@/components/instructor-view/courses/add-new-course/course-curriculum'
import CourseLanding from '@/components/instructor-view/courses/add-new-course/course-landing'
import CourseSettings from '@/components/instructor-view/courses/add-new-course/course-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'
import { AuthContext } from '@/context/auth-context'
import { InstructorContext } from '@/context/instructor-context'
import { toast } from '@/hooks/use-toast'
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from '@/services/instructor-course-services'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AddNewCoursePage = () => {

    const { courseCurriculumFormData, setCourseCurriculumFormData,
        courseLandingFormData, setCourseLandingFormData,
        currentEditedCourseId, setCurrentEditedCourseId
    } = useContext(InstructorContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();

    // check field is Empty
    const isEmpty = (value) => {
        if (Array.isArray(value)) return value.length === 0;
        return value === "" || value === null || value === undefined;
    }

    // validate formData
    const validateFormData = () => {
        // validation for landing page formdata
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) return false;
        }

        // validation for curriculum formdata
        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) return false;

            if (item.freePreview) hasFreePreview = true; // found at least one free preview
        }

        return hasFreePreview;
    }

    // handle creation of course
    const handleCreateCourse = async () => {
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublished: true
        };

        // add the course
        const response = currentEditedCourseId !== null
            ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
            : await addNewCourseService(courseFinalFormData);

        if (response?.success) {
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            setCurrentEditedCourseId(null);
            toast({
                title: response?.message || "Course has been saved successfully!"
            });
            navigate(-1);
        } else {
            toast({
                title: response?.message || "Unable to save course, please try again!"
            });
        }
    }

    // fetching edit current course details
    const fetchCurrentCourseDetails = async () => {
        const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);

        if (response?.success) {
            // set the landing formdata
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key];
                return acc;
            }, {});

            setCourseLandingFormData(setCourseFormData);
            // set the curriculum formdata
            setCourseCurriculumFormData(response?.data?.curriculum);
        }
    }

    // set current course edited id while editing
    useEffect(() => {
        if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
    }, [params?.courseId]);

    // fetch the edited course data
    useEffect(() => {
        if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
    }, [currentEditedCourseId]);

    return (
        <div className='container mx-auto p-4'>
            <div className='flex justify-between'>
                <h1 className='text-3xl font-extrabold mb-5'>Create a new Course</h1>
                <Button
                    className="text-sm tracking-wider font-bold px-8"
                    disabled={!validateFormData()}
                    onClick={handleCreateCourse}
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