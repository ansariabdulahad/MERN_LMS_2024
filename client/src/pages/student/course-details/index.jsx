import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/video-player';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-context'
import { toast } from '@/hooks/use-toast';
import { createPaymentService, fetchStudentViewCourseDetailsService } from '@/services/student-course-services';
import { CheckCircle, Globe, Loader, Lock, PlayCircle, UsersRoundIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'

const StudentViewCourseDetailsPage = () => {

    const { studentViewCourseDetails, setStudentViewCourseDetails,
        currentCourseDetailsId, setCurrentCourseDetailsId,
        loadingState, setLoadingState
    } = useContext(StudentContext);
    const { auth } = useContext(AuthContext);

    const { id } = useParams();
    const location = useLocation();

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const [approvalUrl, setApprovalUrl] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [coursePurchasedId, setCoursePurchasedId] = useState(null);

    // fetching current course details
    const fetchStudentViewCourseDetails = async () => {
        try {
            const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId, auth?.user?._id);

            if (response?.success) {
                setCoursePurchasedId(response?.coursePurchasedId);
                setStudentViewCourseDetails(response?.data);
                setLoadingState(false);
            }

        } catch (error) {
            console.error(error);
            setStudentViewCourseDetails(null);
            setLoadingState(false);
            setCoursePurchasedId(null);
            toast({
                title: "Unable to fetch course details, please check your internet connection!",
                variant: "destructive"
            });
        }
    }

    // find free preview index
    const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null ? (
        studentViewCourseDetails?.curriculum?.findIndex((item) => item.freePreview)
    ) : (-1);

    // handle set free preview
    const handleSetFreePreview = (getCurrentVideoInfo) => {
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }

    // handle creating payment
    const handleCreatePayment = async () => {
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'initiated',
            orderDate: new Date(),
            paymentId: '',
            payerId: '',
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: studentViewCourseDetails?.pricing
        };

        try {
            setPaymentLoading(true);
            const response = await createPaymentService(paymentPayload);

            if (response?.success) {
                sessionStorage.setItem('currentOrderId', JSON.stringify(response?.data?.orderId));
                setApprovalUrl(response?.data?.approveUrl);
                setPaymentLoading(false);
            } else {
                setPaymentLoading(false);
                console.error("Error processing payment request", response?.message);
                toast({
                    title: response?.message || "Error processing payment request",
                    variant: 'destructive'
                });
            }
        } catch (error) {
            setPaymentLoading(false);
            console.error(error, "Error processing payment request");
            toast({
                title: "Error processing payment request",
                variant: 'destructive'
            });
        }
    }

    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
    }, [displayCurrentVideoFreePreview])

    useEffect(() => {
        if (currentCourseDetailsId) fetchStudentViewCourseDetails();
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if (id) setCurrentCourseDetailsId(id);
    }, [id]);

    useEffect(() => {
        if (!location.pathname.includes('course/details')) {
            setStudentViewCourseDetails(null);
            setCurrentCourseDetailsId(null);
            setCoursePurchasedId(null);
        }
    }, [location.pathname]);

    if (loadingState) return <div className='flex-1'><Skeleton /> <span>Loading...</span></div>

    if (coursePurchasedId !== null) return <Navigate to={`/course-progress/${coursePurchasedId}`} />

    if (approvalUrl !== "") return window.location.href = approvalUrl;

    return (
        <div className='flex-1 p-4'>
            <div className='bg-gray-900 text-white p-8 rounded-t-lg shadow-lg'>
                <h1 className='text-3xl font-bold mb-4 capitalize'>
                    {studentViewCourseDetails?.title}
                </h1>
                <p className='text-xl mb-4'>{studentViewCourseDetails?.subtitle}</p>

                <div className='flex items-center space-x-4 mt-2 text-sm'>
                    <span className='capitalize'>Created By - {studentViewCourseDetails?.instructorName}</span>
                    <span>Created On - {studentViewCourseDetails?.date.split("T")[0]}</span>
                    <span className='flex items-center capitalize'>
                        <Globe className='mr-1  h-4 w-4' />
                        {studentViewCourseDetails?.primaryLanguage}
                    </span>
                    <span className='flex items-center'>
                        <UsersRoundIcon className='mr-1 h-4 w-4' />
                        {studentViewCourseDetails?.students.length}
                        {studentViewCourseDetails?.students.length <= 1 ? " Student" : " Students"}
                    </span>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-8 mt-8'>
                <main className='flex-grow'>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What you'll learn</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                {
                                    studentViewCourseDetails?.objectives.split(',').map((objective, index) => (
                                        <li className='flex items-center' key={index}>
                                            <CheckCircle className='mr-2 h-5 w-5 text-green-500 flex-shrink-0' />
                                            <span>{objective}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {studentViewCourseDetails?.description}
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {
                                studentViewCourseDetails?.curriculum.map((curriculumItem, index) => (
                                    <li
                                        key={index}
                                        className={`${curriculumItem?.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'} 
                                            flex items-center mb-4
                                            `}
                                        onClick={
                                            curriculumItem?.freePreview
                                                ? () => handleSetFreePreview(curriculumItem)
                                                : null
                                        }
                                    >
                                        {
                                            curriculumItem?.freePreview
                                                ? <PlayCircle className='mr-2 h-4 w-4 text-green-500' />
                                                : <Lock className='mr-2 h-4 w-4 text-red-500' />
                                        }
                                        <span className='capitalize'>{curriculumItem?.title}</span>
                                    </li>
                                ))
                            }
                        </CardContent>
                    </Card>
                </main>

                <aside className='w-full'>
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className='aspect-video mb-4 rounded-lg flex items-center justify-center'>
                                <VideoPlayer
                                    url={
                                        getIndexOfFreePreviewUrl !== -1
                                            ? studentViewCourseDetails?.curriculum?.[getIndexOfFreePreviewUrl].videoUrl
                                            : ""
                                    }
                                />
                            </div>

                            <div className='mb-4'>
                                <span className='text-3xl font-bold'>
                                    ${studentViewCourseDetails?.pricing}
                                </span>
                            </div>

                            <Button className="w-full"
                                onClick={handleCreatePayment}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? 'Payment Processing...' : 'Buy Now'}
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>

            {/* free preview or lecture video dialogue box */}
            <Dialog
                open={showFreePreviewDialog}
                onOpenChange={() => {
                    setShowFreePreviewDialog(false);
                    setDisplayCurrentVideoFreePreview(null);
                }}
            >
                <DialogContent className="sm:w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>

                    <div className='aspect-video rounded-lg flex items-center justify-center'>
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        {
                            studentViewCourseDetails?.curriculum?.filter((item) => item.freePreview).map((filteredItem, index) => (
                                <div className='flex items-center'
                                    onClick={() => handleSetFreePreview(filteredItem)}
                                    key={index}
                                >
                                    <PlayCircle className='mr-2 h-4 w-4 text-green-500 cursor-pointer' />
                                    <p className='cursor-pointer text-[16px] font-medium'>{filteredItem?.title}</p>
                                </div>
                            ))
                        }
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentViewCourseDetailsPage