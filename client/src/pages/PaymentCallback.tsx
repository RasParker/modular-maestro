
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
        console.log('Verifying payment with reference:', reference);
        
        const response = await fetch(`/api/payments/verify/${reference}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Payment verification result:', result);

        if (result.success && result.data.status === 'success') {
          setStatus('success');
          
          // Dispatch subscription status change event
          const event = new CustomEvent('subscriptionStatusChange', {
            detail: { type: 'subscriptionCreated', paymentData: result.data }
          });
          window.dispatchEvent(event);
          console.log('🔄 Dispatched subscription status change event');
          
          // Force clear any cached subscription data
          sessionStorage.removeItem('userSubscriptions');
          
          // Trigger a storage event to force components to refresh
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'subscriptionUpdate',
            newValue: Date.now().toString(),
            url: window.location.href
          }));
          
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated. Redirecting...",
          });

          // Auto-redirect after successful payment (3 second delay)
          setTimeout(() => {
            const creatorProfile = sessionStorage.getItem('lastCreatorProfile');
            if (creatorProfile) {
              sessionStorage.removeItem('lastCreatorProfile');
              window.location.href = creatorProfile;
            } else {
              window.location.href = '/fan/dashboard';
            }
          }, 3000);
        } else {
          setStatus('failed');
          toast({
            title: "Payment Failed",
            description: result.data?.gateway_response || result.message || "There was an issue processing your payment.",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast({
          title: "Verification Error",
          description: `Could not verify payment status: ${error.message}`,
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
      // Use window.location for more reliable navigation
      const creatorProfile = sessionStorage.getItem('lastCreatorProfile');
      if (creatorProfile) {
        sessionStorage.removeItem('lastCreatorProfile');
        window.location.href = creatorProfile;
      } else {
        window.location.href = '/fan/dashboard';
      }
    } else {
      // On failure, go back to explore page
      window.location.href = '/explore';
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
              ? 'Your subscription has been activated successfully. You can now access exclusive content! Redirecting automatically...'
              : 'We could not process your payment. Please try again or contact support if the issue persists.'
            }
          </p>
          {reference && (
            <p className="text-xs text-muted-foreground">
              Reference: {reference}
            </p>
          )}
          <Button onClick={handleContinue} className="w-full">
            {status === 'success' ? 'Continue' : 'Try Again'}
          </Button>
          
          {/* Alternative navigation buttons in case of connection issues */}
          {status === 'success' && (
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/fan/dashboard'}
                className="flex-1"
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/explore'}
                className="flex-1"
              >
                Explore
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
