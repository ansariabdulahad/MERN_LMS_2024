import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {

    const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
    const [loadingState, setLoadingState] = useState(true);

    return <StudentContext.Provider value={{
        studentViewCoursesList, setStudentViewCoursesList,
        loadingState, setLoadingState
    }}>
        {children}
    </StudentContext.Provider>
}