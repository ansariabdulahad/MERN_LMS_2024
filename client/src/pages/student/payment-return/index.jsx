import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { captureAndFinalizePaymentService } from '@/services/student-course-services';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaypalPaymentReturnPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const capturePayment = async () => {
            try {
                if (paymentId && payerId) {
                    const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));

                    const response = await captureAndFinalizePaymentService(
                        paymentId,
                        payerId,
                        orderId
                    );

                    if (response?.success) {
                        sessionStorage.removeItem('currentOrderId');
                        navigate("/student-courses");
                    } else {
                        setError("Payment capture failed. Please try again.");
                    }
                }
            } catch (err) {
                console.error("Error capturing payment:", err);
                setError("An error occurred during payment processing.");
            } finally {
                setIsLoading(false);
            }
        };

        capturePayment();
    }, [paymentId, payerId, navigate]);

    if (error !== null) return toast({
        title: error,
        variant: "destructive"
    });

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>
                    {isLoading
                        ? "Processing payment... Please wait!"
                        : error
                            ? error
                            : "Payment Successful!"}
                </CardTitle>
            </CardHeader>
        </Card>
    );
};

export default PaypalPaymentReturnPage;