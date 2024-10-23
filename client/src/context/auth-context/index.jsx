import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { toast } from "@/hooks/use-toast";
import { checkAuthService, loginService, registerService } from "@/services/auth-services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("signin");
    const [auth, setAuth] = useState({
        authenticated: false,
        user: null
    });

    // handle register the user
    const handleRegisterUser = async (event) => {
        event.preventDefault();
        const registerBtn = event.target.querySelector('button');

        try {
            registerBtn.innerHTML = "Signin up...";
            registerBtn.disabled = true;

            const response = await registerService(signUpFormData);
            const { success, message } = response;

            if (success) {
                registerBtn.innerHTML = "Sign Up";
                registerBtn.disabled = false;
                toast({
                    title: message || 'Signup done successfully, Login now!'
                });
                setSignUpFormData(initialSignUpFormData);
                setActiveTab('signin');
            } else {
                registerBtn.innerHTML = "Sign Up";
                registerBtn.disabled = false;

                toast({
                    title: message || 'Signup failed, Try Again!',
                    variant: 'destructive'
                });
                // setSignUpFormData(initialSignUpFormData);
            }

        } catch (error) {
            registerBtn.innerHTML = "Sign Up";
            registerBtn.disabled = false;

            console.error("Error in handleRegisterUser :: ", error.message || error);
            toast({
                title: error?.response?.data?.message || 'Signup failed, Try Again!',
                variant: 'destructive'
            });
            // setSignUpFormData(initialSignUpFormData);
        }
    }

    // handle login user
    const handleLoginUser = async (event) => {
        event.preventDefault();
        const loginBtn = event.target.querySelector('button');

        try {
            loginBtn.innerHTML = "Logging...";
            loginBtn.disabled = true;

            const response = await loginService(signInFormData);
            const { success, data, message } = response;

            if (response && success) {
                loginBtn.innerHTML = "Sign In";
                loginBtn.disabled = false;

                sessionStorage.setItem('accessToken', JSON.stringify(data.accessToken));

                setAuth({
                    authenticated: true,
                    user: data.user
                });

                toast({
                    title: message || 'Signin done successfully!'
                });
                setSignInFormData(initialSignInFormData);

            } else {
                loginBtn.innerHTML = "Sign In";
                loginBtn.disabled = false;

                setAuth({
                    authenticated: false,
                    user: null
                });

                toast({
                    title: message || 'Signin failed, Try Again!',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            loginBtn.innerHTML = "Sign In";
            loginBtn.disabled = false;

            console.error("Error in handleLoginUser :: ", error);
            if (!error?.response?.data?.success) {
                setAuth({
                    authenticated: false,
                    user: null
                });
                setLoading(false);
                toast({
                    title: error?.response?.data?.message || 'Signin failed, Try Again!',
                    variant: 'destructive'
                });
            }
        }
    }

    // check authentication 
    const checkAuthUser = async () => {
        try {
            const response = await checkAuthService();
            const { success, data } = response;

            if (success) {
                setAuth({
                    authenticated: true,
                    user: data.user
                });
                setLoading(false);
            } else {
                setAuth({
                    authenticated: false,
                    user: null
                });
                setLoading(false);
            }

        } catch (error) {
            console.error("Error in checkAuthUser :: ", error);
            if (!error?.response?.data?.success) {
                setAuth({
                    authenticated: false,
                    user: null
                });
                setLoading(false);
            }
        }
    }

    // reset authentication
    const resetCredentials = () => {
        setAuth({
            authenticated: false,
            user: null
        });
        sessionStorage.clear();
        toast({
            title: 'Logged out successfully!',
        });
    }

    // on page load check authentication
    useEffect(() => {
        checkAuthUser();
    }, []);

    return <AuthContext.Provider value={{
        signUpFormData, setSignUpFormData, signInFormData, setSignInFormData, activeTab, setActiveTab,
        handleRegisterUser, handleLoginUser, auth,
        resetCredentials
    }}>
        {
            loading ? <Skeleton /> : children
        }
    </AuthContext.Provider>;
}