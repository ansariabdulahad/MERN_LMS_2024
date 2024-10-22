import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services/auth-services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null
    });

    // handle register the user
    const handleRegisterUser = async (event) => {
        event.preventDefault();

        try {
            const data = await registerService(signUpFormData);
        } catch (error) {
            console.error("Error in handleRegisterUser :: ", error.message || error);
        }
    }

    // handle login user
    const handleLoginUser = async (event) => {
        event.preventDefault();

        try {
            const response = await loginService(signInFormData);
            const { success, data } = response;

            if (response && success) {
                sessionStorage.setItem('accessToken', JSON.stringify(data.accessToken));

                setAuth({
                    authenticated: true,
                    user: data.user
                });
            } else {
                setAuth({
                    authenticated: false,
                    user: null
                });
            }
        } catch (error) {
            console.error("Error in handleLoginUser :: ", error.message || error);
        }
    }

    // check authentication 
    const checkAuthUser = async () => {
        try {
            const response = await checkAuthService();
            const { success, data } = response;

            if (success) {
                setAuth({
                    authenticate: true,
                    user: data.user
                });
            } else {
                setAuth({
                    authenticate: false,
                    user: null
                });
            }

        } catch (error) {
            console.error("Error in checkAuthUser :: ", error.message || error);
        }
    }

    // on page load check authentication
    useEffect(() => {
        checkAuthUser();
    }, []);

    return <AuthContext.Provider value={{
        signUpFormData, setSignUpFormData, signInFormData, setSignInFormData,
        handleRegisterUser, handleLoginUser
    }}>{children}</AuthContext.Provider>;
}