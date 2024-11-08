import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoPlayer from '@/components/video-player'
import { AuthContext } from '@/context/auth-context'
import { StudentContext } from '@/context/student-context'
import { toast } from '@/hooks/use-toast'
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from '@/services/student-course-services'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useNavigate, useParams } from 'react-router-dom'

const StudentViewCourseProgressPage = () => {

    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress,
        loadingState, setLoadingState
    } = useContext(StudentContext);

    const navigate = useNavigate();
    const { id } = useParams();

    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    // fetch the details of current course progress
    const fetchCurrentCourseProgress = async () => {
        try {
            const response = await getCurrentCourseProgressService(auth?.user?._id, id);

            if (response?.success) {
                setLoadingState(false);

                if (!response?.data?.isPurchased) {
                    setLockCourse(true);
                } else {
                    setStudentCurrentCourseProgress({
                        courseDetails: response?.data?.courseDetails,
                        progress: response?.data?.progress
                    });

                    // set the lecture as first if course is completed

                    if (response?.data?.completed) {
                        setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                        setShowCourseCompleteDialog(true);
                        setShowConfetti(true);

                        return;
                    }

                    // set the lecture as 0 if progress is not there
                    if (response?.data?.progress?.length === 0) {
                        setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                    } else {
                        // do later if progress is available
                        const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
                            (acc, obj, index) => {
                                return acc === -1 && obj.viewed ? index : acc
                            }, -1
                        );

                        setCurrentLecture(response?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1]);
                    }
                }
            }

        } catch (error) {
            console.error(error, "Failed to fetch the current course progress");
            toast({
                title: error?.data?.message || "Failed to fetch the current course progress",
                variant: "destructive"
            });
        }
    }

    // update course progress if it is watched
    const updateCourseProgress = async () => {
        try {
            if (currentLecture) {
                const response = await markLectureAsViewedService(
                    auth?.user?._id,
                    studentCurrentCourseProgress?.courseDetails?._id,
                    currentLecture?._id
                );

                if (response?.success) {
                    fetchCurrentCourseProgress();
                }
            }
        } catch (error) {
            console.error(error, "Failed to update course progress");
            toast({
                title: error?.data?.message || "Failed to update course progress",
                variant: "destructive"
            });
        }
    }

    // handle rewatch or reset the course
    const handleRewatchCourse = async () => {
        const response = await resetCourseProgressService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id);

        if (response?.success) {
            setCurrentLecture(null);
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);

            fetchCurrentCourseProgress();
        } else {
            console.log("Failed to reset course progress!");
            toast({
                title: response?.data?.message || "Failed to reset course progress!",
                variant: "destructive"
            });
        }
    }

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    useEffect(() => {
        if (currentLecture?.progressValue === 1) {
            updateCourseProgress()
        }
    }, [currentLecture]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => {
            setShowConfetti(false);
        }, 15000);
    }, [showConfetti]);

    if (loadingState) return <div className='flex-1'><Skeleton /> <span>Loading...</span></div>

    return (
        <div className='flex flex-col h-screen bg-[#1c1d1f] text-white'>
            {/* show confetti if course is completed */}
            {
                showConfetti && <ReactConfetti />
            }
            <div className='flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700'>
                <div className='flex items-center space-x-4'>
                    <Button className="text-white" variant="ghost" size="sm"
                        onClick={() => navigate('/student-courses')}
                    >
                        <ChevronLeft className='h-4 w-4 mr-2' />
                        Back To My Courses Page
                    </Button>

                    <h1 className='text-lg font-bold hidden md:block'>
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>

                <Button
                    onClick={() => setIsSideBarOpen(!isSideBarOpen)}
                >
                    {
                        isSideBarOpen
                            ? <ChevronRight className='h-5 w-5' />
                            : <ChevronLeft className='h-5 w-5' />
                    }
                </Button>
            </div>

            {/* show the current lecture */}
            <div className='flex flex-1 overflow-hidden'>
                <div className={`flex-1 ${isSideBarOpen ? 'mr-[400px]' : ''} transition-all duration-300`}>
                    <VideoPlayer
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />

                    <div className='p-6 bg-[#1c1d1f]'>
                        <h2 className='text-2xl font-bold mb-2'>{currentLecture?.title}</h2>
                    </div>
                </div>

                {/* courses sidebar */}
                <div
                    className={`fixed top-[68px] right-0 bottom-0 w-[350px] sm:w-[400px] bg-[#1c1d1f] 
                        border-l border-gray-700 transition-all duration-300 
                        ${isSideBarOpen ? "translate-x-0" : "translate-x-full"}
                        `}
                >
                    <Tabs
                        defaultValue='content'
                        className='h-full flex flex-col'
                    >
                        <TabsList className="grid w-full grid-cols-2 p-0 h-14 bg-[#1c1d1f]">
                            <TabsTrigger
                                className="data-[state=active]:bg-white text-white rounded-none h-full transition-all duration-300"
                                value="content"
                            >
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger
                                className="data-[state=active]:bg-white text-white rounded-none h-full transition-all duration-300"
                                value="overview"
                            >
                                Overview
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="content"
                        >
                            <ScrollArea className="h-full">
                                <div className='p-4 space-y-4'>
                                    {
                                        studentCurrentCourseProgress?.courseDetails?.curriculum?.map((item) => (
                                            <div
                                                key={item?._id}
                                                className='flex items-center space-x-2 text-sm text-white font-bold cursor-pointer'
                                            >
                                                {
                                                    studentCurrentCourseProgress?.progress?.find((progressItem) => progressItem?.lectureId === item?._id)?.viewed
                                                        ? <Check className='h-4 w-4 text-green-500' />
                                                        : <Play className='h-4 w-4 text-yellow-500' />
                                                }
                                                <span>{item?.title}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent
                            value="overview"
                            className="flex-1 overflow-hidden"
                        >
                            <ScrollArea
                                className="h-full"
                            >
                                <div className='p-4'>
                                    <h2 className='text-xl font-bold mb-4'>About this course</h2>
                                    <p
                                        className='text-gray-400'
                                    >{studentCurrentCourseProgress?.courseDetails?.description}</p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* show lock course dialog if not purchased */}
            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>You can't view this course!</DialogTitle>
                        <DialogDescription>
                            Please purchase this course to get access.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* show course completed dialog */}
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent showOverlay={false} className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course!</Label>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <div className='flex flex-row gap-3 w-full'>
                            <Button
                                onClick={() => navigate('/student-courses')}
                            >My Courses Page</Button>
                            <Button
                                onClick={handleRewatchCourse}
                            >Rewatch This Course</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentViewCourseProgressPage