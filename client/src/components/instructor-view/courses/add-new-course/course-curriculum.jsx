import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { courseCurriculumInitialFormData } from '@/config';
import { InstructorContext } from '@/context/instructor-context'
import React, { useContext } from 'react'

const CourseCurriculum = () => {

    const { courseCurriculumFormData, setCourseCurriculumFormData } = useContext(InstructorContext);

    // handle new Lecture
    const handleNewLecture = () => {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0]
            }
        ]);
    }

    console.log(courseCurriculumFormData);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Course Curriculum</CardTitle>
            </CardHeader>

            <CardContent>
                <Button
                    onClick={handleNewLecture}
                >Add Lecture</Button>
                <div className='mt-4 space-y-4'>
                    {
                        courseCurriculumFormData.map((curriculumItem, index) => (
                            <div
                                key={index}
                                className='border p-5 rounded-md shadow-md sm:shadow-sm'
                            >
                                <div className='flex flex-col sm:flex-row items-center gap-5'>
                                    <h3 className='font-semibold'>Lecture {index + 1}</h3>
                                    <Input
                                        name={`title-${index + 1}`}
                                        placeholder="Enter lecture title"
                                        className="max-w-96"
                                    />

                                    <div className='flex items-center space-x-2'>
                                        <Switch
                                            checked={true}
                                            id={`freePreview-${index + 1}`}
                                        />
                                        <Label
                                            htmlFor={`freePreview-${index}`}
                                        >Free Preview</Label>
                                    </div>
                                </div>

                                <div className='mt-6'>
                                    <Label htmlFor={`lectureVideo-${index}`}
                                        className="font-semibold"
                                    >Lecture Video</Label>
                                    <Input
                                        name={`videoUrl-${index + 1}`}
                                        type="file"
                                        accept="video/*"
                                        className="mb-4"
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseCurriculum