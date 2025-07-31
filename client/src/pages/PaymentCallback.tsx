
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [verifying, setVerifying] = useState(true);

  const reference = searchParams.get('reference');
  const paymentStatus = searchParams.get('status');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('failed');
        setVerifying(false);
        return;
      }

      try {
        // Simulate verification delay in development
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch(`/api/payments/verify/${reference}`);
        const result = await response.json();

        if (result.success && result.data.status === 'success') {
          setStatus('success');
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated.",
          });
        } else {
          setStatus('failed');
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast({
          title: "Verification Error",
          description: "Could not verify payment status.",
          variant: "destructive"
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [reference, toast]);

  const handleContinue = () => {
    if (status === 'success') {
      navigate('/fan/dashboard');
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {status === 'success' 
              ? 'Your subscription has been activated successfully. You now have access to exclusive content!'
              : 'We could not process your payment. Please try again or contact support if the issue persists.'
            }
          </p>
          {reference && (
            <p className="text-xs text-muted-foreground">
              Reference: {reference}
            </p>
          )}
          <Button onClick={handleContinue} className="w-full">
            {status === 'success' ? 'Continue to Dashboard' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
