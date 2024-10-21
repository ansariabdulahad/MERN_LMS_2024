import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { registerService } from "@/services/auth-services";
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

    // handle register the user
    const handleRegisterUser = async (event) => {
        event.preventDefault();

        try {
            const data = await registerService(signUpFormData);
            console.log("data :: ", data);
        } catch (error) {
            console.error("Error in handleRegisterUser :: ", error.message || error);
        }

    }

    return <AuthContext.Provider value={{
        signUpFormData, setSignUpFormData, signInFormData, setSignInFormData,
        handleRegisterUser
    }}>{children}</AuthContext.Provider>;
}