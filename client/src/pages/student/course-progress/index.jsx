import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { AuthContext } from '@/context/auth-context'
import { StudentContext } from '@/context/student-context'
import { toast } from '@/hooks/use-toast'
import { getCurrentCourseProgressService } from '@/services/student-course-services'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ChevronLeft } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useNavigate, useParams } from 'react-router-dom'

const StudentViewCourseProgressPage = () => {

    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);

    const navigate = useNavigate();
    const { id } = useParams();

    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // fetch the details of current course progress
    const fetchCurrentCourseProgress = async () => {
        try {
            const response = await getCurrentCourseProgressService(auth?.user?._id, id);

            if (response?.success) {
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

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => {
            setShowConfetti(false);
        }, 5000);
    }, [showConfetti]);

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
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course!</Label>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <div className='flex flex-row gap-3 w-full'>
                            <Button>My Courses Page</Button>
                            <Button>Rewatch This Course</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentViewCourseProgressPage