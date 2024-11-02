import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { filterOptions, sortOptions } from '@/config'
import { StudentContext } from '@/context/student-context'
import { fetchStudentViewCourseListService } from '@/services/student-course-services'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// helper function for searchparams
const createSearchParamsHelper = (filterParams) => {
    let queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join('&');
}

const StudentViewCoursesPage = () => {

    const { studentViewCoursesList, setStudentViewCoursesList,
        loadingState, setLoadingState,
        setCurrentCourseDetailsId
    } = useContext(StudentContext);
    const [sort, setSort] = useState('price-lowtohigh');
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // handle filtering
    const handleFilterChange = (getSectionId, getCurrentOption) => {
        let cpyFilters = { ...filters };
        const indexOfCurrentSectionId = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSectionId === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption.id]
            }
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);

            if (indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption.id);
            } else {
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);

                if (cpyFilters[getSectionId].length === 0) {
                    delete cpyFilters[getSectionId];
                }
            }
        }
        setFilters(cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    }

    // fetch all students courses
    const fetchAllStudentViewCourses = async (filters, sort) => {
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort
        });

        try {
            const response = await fetchStudentViewCourseListService(query);

            if (response?.success) {
                setStudentViewCoursesList(response?.data);
                setLoadingState(false);
            }
        } catch (error) {
            console.error(error, "Error fetching students");
        }
    }

    useEffect(() => {
        const savedFilters = JSON.parse(sessionStorage.getItem('filters')) || {}; // Get saved filters or set empty object
        setFilters(savedFilters);
        setSort('price-lowtohigh');
    }, []);

    useEffect(() => {
        if (Object.keys(filters).length > 0 || sort) {
            const buildQueryStringForFilters = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(buildQueryStringForFilters));
            fetchAllStudentViewCourses(filters, sort); // Fetch data with the saved filters
        }
    }, [filters, sort, setSearchParams]);

    // useEffect(() => {
    //     if (filters && sort) {
    //         fetchAllStudentViewCourses(filters, sort);
    //     }
    // }, [filters, sort]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem("filters");
        }
    }, [])

    return (
        <div className='flex-1 container mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-4'>All Courses</h1>

            <Separator />

            <div className='flex flex-col md:flex-row gap-4'>

                <aside className='w-full md:w-64 sm:border-r'>
                    <div className='p-4'>
                        {
                            Object.keys(filterOptions).map((keyItem, index) => (
                                <div className='p-4 border-b' key={index}>
                                    <h3 className='font-bold mb-3'>{keyItem.toUpperCase()}</h3>

                                    <div className='grid gap-2 mt-2'>
                                        {
                                            filterOptions[keyItem].map((option) => (
                                                <Label
                                                    key={option.id}
                                                    className="flex font-medium items-center gap-3"
                                                >
                                                    <Checkbox
                                                        checked={
                                                            filters &&
                                                            Object.keys(filters).length > 0 &&
                                                            filters[keyItem] &&
                                                            filters[keyItem].indexOf(option.id) !== -1
                                                        }
                                                        onCheckedChange={() => handleFilterChange(keyItem, option)}
                                                    />
                                                    {option.label}
                                                </Label>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </aside>

                <main className='flex-1'>
                    <div className='flex justify-end items-center mb-4 gap-5'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 p-5 mt-2"
                                >
                                    <ArrowUpDownIcon className='h-4 w-4' />
                                    <span className='text-[16px] font-medium'>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-[180px]"
                            >
                                <DropdownMenuRadioGroup
                                    value={sort}
                                    onValueChange={(value) => setSort(value)}
                                >
                                    {
                                        sortOptions.map((sortItem) => (
                                            <DropdownMenuRadioItem
                                                key={sortItem.id}
                                                value={sortItem.id}
                                            >
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>
                                        ))
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <span className='font-bold text-gray-500 text-sm'>{studentViewCoursesList.length} {studentViewCoursesList.length <= 1 ? "Course" : "Courses"}</span>
                    </div>

                    <div className='space-y-4'>
                        {
                            studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                                studentViewCoursesList.map((courseItem) => (
                                    <Card
                                        key={courseItem?._id}
                                        className="cursor-pointer hover:shadow-lg"
                                        onClick={() => {
                                            navigate(`/course/details/${courseItem?._id}`);
                                            setCurrentCourseDetailsId(null);
                                        }}
                                    >
                                        <CardContent className="flex flex-col sm:flex-row items-center text-center sm:text-start gap-4 p-4">
                                            <div className='w-48 h-32 flex-shrink-0'>
                                                <img src={courseItem?.image} alt={courseItem?.title}
                                                    className='w-full h-full object-cover rounded shadow'
                                                />
                                            </div>

                                            <div className='flex-1'>
                                                <CardTitle className="text-xl mb-2 capitalize">
                                                    {courseItem?.title}
                                                </CardTitle>
                                                <p className='text-sm text-gray-600 mb-1 capitalize'>
                                                    Created By <span className='font-bold'>{courseItem?.instructorName}</span>
                                                </p>
                                                <p className='text-[16px] text-gray-600 mb-2 mt-3'>
                                                    {
                                                        `${courseItem?.curriculum.length} 
                                                        ${courseItem?.curriculum.length <= 1
                                                            ? "Lecture"
                                                            : "Lectures"} - 
                                                        ${courseItem?.level.toUpperCase()} Level`
                                                    }
                                                </p>
                                                <p className='font-bold text-lg'>${courseItem?.pricing}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                loadingState
                                    ? <Skeleton />
                                    : <h1 className='font-extrabold text-4xl'>No Courses Found!</h1>
                            )
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentViewCoursesPage