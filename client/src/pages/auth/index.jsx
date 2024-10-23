import CommonForm from '@/components/common-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initialSignInFormData, initialSignUpFormData, signInFormControls, signUpFormControls } from '@/config';
import { AuthContext } from '@/context/auth-context';
import { GraduationCap } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AuthPage = () => {

    // const [activeTab, setActiveTab] = useState("signin");
    const {
        signUpFormData, setSignUpFormData, signInFormData, setSignInFormData,
        handleRegisterUser, handleLoginUser, activeTab, setActiveTab
    } = useContext(AuthContext);

    // handle active tab change values
    const handleTabChange = (value) => {
        setActiveTab(value);
    }

    // checking signin form validation
    const checkIfSignInFormIsValid = () => {
        return (
            signInFormData &&
            signInFormData.userEmail !== "" &&
            signInFormData.password !== ""
        );
    }

    // checking signin form validation
    const checkIfSignUpFormIsValid = () => {
        return (
            signUpFormData &&
            signUpFormData.userName !== "" &&
            signUpFormData.userEmail !== "" &&
            signUpFormData.password !== ""
        );
    }

    // reset form data
    useEffect(() => {
        activeTab === "signin"
            ? setSignInFormData(initialSignInFormData)
            : setSignUpFormData(initialSignUpFormData);
    }, [activeTab]);

    return (
        <div className='flex flex-col min-h-screen'>

            <header className='px-4 lg:px-6 h-14 border-b shadow-sm flex items-center'>
                <Link to={'/'} className='flex items-center justify-center'>
                    <GraduationCap className='h-8 w-8 mr-4' />
                    <span className='font-extrabold text-xl'>LMS LEARN</span>
                </Link>
            </header>

            <div className='flex justify-center items-center min-h-screen bg-background'>

                <Tabs
                    defaultValue={'signin'}
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className='w-full max-w-md p-4 bg-white rounded-lg'
                >
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Signin to your account</CardTitle>
                                <CardDescription>
                                    Enter your email and password to login your account.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <CommonForm
                                    buttonText={'Sign In'}
                                    formControls={signInFormControls}
                                    formData={signInFormData}
                                    setFormData={setSignInFormData}
                                    isButtonDisabled={!checkIfSignInFormIsValid()}
                                    handleSubmit={handleLoginUser}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Create a new account</CardTitle>
                                <CardDescription>
                                    Enter your username, email and password to register your account.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <CommonForm
                                    buttonText={'Sign Up'}
                                    formControls={signUpFormControls}
                                    formData={signUpFormData}
                                    setFormData={setSignUpFormData}
                                    handleSubmit={handleRegisterUser}
                                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>

        </div>
    )
}

export default AuthPage