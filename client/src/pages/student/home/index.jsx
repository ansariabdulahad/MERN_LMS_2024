import React, { useContext, useEffect } from 'react'
import banner from '../../../../public/lms-banner.png';
import { courseCategories } from '@/config';
import { Button } from '@/components/ui/button';
import { StudentContext } from '@/context/student-context';
import { fetchStudentViewCourseListService } from '@/services/student-course-services';

const StudentHomePage = () => {

    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);

    // fetch all students courses
    const fetchAllStudentViewCourses = async () => {
        try {
            const response = await fetchStudentViewCourseListService();

            if (response?.success) {
                setStudentViewCoursesList(response?.data);
            }
        } catch (error) {
            console.error(error, "Error fetching students");
        }
    }

    useEffect(() => {
        fetchAllStudentViewCourses()
    }, []);

    return (
        <div className='min-h-screen bg-white flex-1'>
            <section className='flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8'>
                <div className='lg:w-1/2 lg:pr-12'>
                    <h1 className='text-3xl sm:text-5xl font-bold mb-4 capitalize'>Learning that gets you!</h1>
                    <p className='text-xl'>Skills for your present and your feature. Get started with us!</p>
                </div>

                <div className='lg:w-full mb-8 lg:mb-0'>
                    <img
                        src={banner}
                        alt="banner-img"
                        width={600}
                        height={400}
                        className='w-full h-auto rounded-lg shadow-lg'
                    />
                </div>
            </section>

            <section className='py-8 px-4 lg:px-8 bg-gray-100'>
                <h2 className='text-2xl font-bold mb-6'>Course Categories</h2>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                    {
                        courseCategories.map((categoryItem) => (
                            <Button
                                key={categoryItem.id}
                                className="justify-start"
                                variant="outline"
                            >{categoryItem.label}</Button>
                        ))
                    }
                </div>
            </section>

            <section className='py-12 px-4 lg:px-8 bg-gray-200'>
                <h2 className='text-2xl font-bold mb-6'>Featured Courses</h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {
                        studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                            studentViewCoursesList.map((courseItem) => (
                                <div
                                    key={courseItem?._id}
                                    className='border rounded-lg overflow-hidden shadow cursor-pointer bg-white hover:shadow-lg'
                                >
                                    <img src={courseItem?.image} alt={courseItem?.title}
                                        width={300}
                                        height={150}
                                        className='w-full h-40 object-cover'
                                    />

                                    <div
                                        className='p-4'
                                    >
                                        <h3 className='font-bold mb-3 capitalize'>{courseItem?.title}</h3>
                                        <p className='text-sm text-gray-700 mb-2 capitalize'>{courseItem?.instructorName}</p>
                                        <p className='font-bold text-[16px]'>${courseItem?.pricing}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1>No Courses Found!</h1>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default StudentHomePage