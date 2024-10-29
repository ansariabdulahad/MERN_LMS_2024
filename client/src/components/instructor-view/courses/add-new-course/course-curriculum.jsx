import MediaProgressBar from '@/components/media-progress-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import VideoPlayer from '@/components/video-player';
import { courseCurriculumInitialFormData } from '@/config';
import { InstructorContext } from '@/context/instructor-context'
import { toast } from '@/hooks/use-toast';
import { mediaDeleteService, mediaUploadService } from '@/services/media-services';
import React, { useContext } from 'react'

const CourseCurriculum = () => {

    const { courseCurriculumFormData, setCourseCurriculumFormData,
        mediaUploadProgress, setMediaUploadProgress,
        mediaUploadProgressPercentage, setMediaUploadProgressPercentage
    } = useContext(InstructorContext);

    // handle new Lecture
    const handleNewLecture = () => {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0]
            }
        ]);
    }

    // handle new courses title chnage
    const handleCourseTitleChange = (event, currentIndex) => {
        let cpycourseCurriculumFormData = [...courseCurriculumFormData];

        cpycourseCurriculumFormData[currentIndex] = {
            ...cpycourseCurriculumFormData[currentIndex],
            title: event.target.value
        }

        setCourseCurriculumFormData(cpycourseCurriculumFormData);
    }

    // handle new courses preview chnage
    const handleFreePreviewChange = (value, currentIndex) => {
        let cpycourseCurriculumFormData = [...courseCurriculumFormData];

        cpycourseCurriculumFormData[currentIndex] = {
            ...cpycourseCurriculumFormData[currentIndex],
            freePreview: value
        }

        setCourseCurriculumFormData(cpycourseCurriculumFormData);
    }

    // handle new courses single lecture upload on cloudinary
    const handleSingleLectureUpload = async (event, currentIndex) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append('file', selectedFile);

            try {
                setMediaUploadProgress(true);

                const { success, message, data } = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);

                if (success && data) {
                    const { public_id, url } = data;
                    let cpycourseCurriculumFormData = [...courseCurriculumFormData];

                    cpycourseCurriculumFormData[currentIndex] = {
                        ...cpycourseCurriculumFormData[currentIndex],
                        videoUrl: url,
                        public_id
                    }

                    setCourseCurriculumFormData(cpycourseCurriculumFormData);
                    setMediaUploadProgress(false);
                    toast({
                        title: message || 'Video file uploaded successfully!',
                    });
                }

            } catch (error) {
                setMediaUploadProgress(false);
                console.error(error);
                toast({
                    title: 'Error uploading video file!',
                    variant: 'destructive'
                });
            }
        }
    }

    // handle form validation to add lecture
    const isCourseCurriculumFormDataValid = () => {
        return courseCurriculumFormData.every((item) => {
            return (
                item &&
                typeof item === 'object' &&
                item.title.trim() !== '' &&
                item.videoUrl.trim() !== ''
            );
        });
    }

    // handle replace video 
    const handleReplaceVideo = async (currentIndex) => {
        let cpycourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId = cpycourseCurriculumFormData[currentIndex].public_id;

        const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId);

        if (deleteCurrentMediaResponse?.success) {
            cpycourseCurriculumFormData[currentIndex] = {
                ...cpycourseCurriculumFormData[currentIndex],
                videoUrl: '',
                public_id: ''
            }

            setCourseCurriculumFormData(cpycourseCurriculumFormData);
        }

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Course Curriculum</CardTitle>
            </CardHeader>

            <CardContent>
                <Button
                    onClick={handleNewLecture}
                    disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
                >Add Lecture</Button>

                {
                    mediaUploadProgress
                        ? (
                            <MediaProgressBar
                                isMediaUploading={mediaUploadProgress}
                                progress={mediaUploadProgressPercentage}
                            />
                        )
                        : null
                }

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
                                        value={courseCurriculumFormData[index].title}
                                        onChange={(event) => handleCourseTitleChange(event, index)}
                                    />

                                    <div className='flex items-center space-x-2'>
                                        <Switch
                                            checked={courseCurriculumFormData[index].freePreview}
                                            id={`freePreview-${index + 1}`}
                                            onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                                        />
                                        <Label
                                            htmlFor={`freePreview-${index}`}
                                        >Free Preview</Label>
                                    </div>
                                </div>

                                <div className='mt-6'>

                                    {
                                        courseCurriculumFormData[index].videoUrl ? (
                                            <div
                                                className='flex flex-col sm:flex-row gap-3'
                                            >
                                                <VideoPlayer
                                                    url={courseCurriculumFormData[index].videoUrl}
                                                // width='420px'
                                                // height='200px'
                                                />
                                                <Button
                                                    onClick={() => handleReplaceVideo(index)}
                                                >Replace Video</Button>
                                                <Button
                                                    className="bg-red-900"
                                                >Delete Lecture</Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Label htmlFor={`lectureVideo-${index}`}
                                                    className="font-semibold"
                                                >Lecture Video</Label>
                                                <Input
                                                    name={`videoUrl-${index + 1}`}
                                                    type="file"
                                                    accept="video/*"
                                                    className="mb-4"
                                                    onChange={(event) => handleSingleLectureUpload(event, index)}
                                                />
                                            </div>
                                        )
                                    }
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