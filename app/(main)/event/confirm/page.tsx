"use client"
import { confirmMomoPay } from '@/lib/actions/orders';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Shield, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MomoConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || '';

  const {data, isLoading, isError} = useQuery({
    queryKey: ['confirm-momo-payment', reference],
    queryFn: async () => await confirmMomoPay(reference),
  });

  if(isError){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again.</p>
          <motion.button 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => router.back()}
            className="w-full bg-red-600 text-white font-medium rounded-xl h-14
              hover:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
              shadow-lg hover:shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  if(isLoading){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
          <p className="text-gray-600 mb-6">Please wait while we confirm your transaction...</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-primaryColor animate-progress" />
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = () => {
    switch(data?.data.status) {
      case 'failed':
        return {
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          bgAlert: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'ongoing':
        return {
          icon: <Clock className="w-8 h-8 text-orange-600" />,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-600',
          bgAlert: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          bgAlert: 'bg-green-50',
          borderColor: 'border-green-200'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", statusConfig.bgColor)}>
              {statusConfig.icon}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment {data?.data.status === 'failed' ? 'Failed' : 
                data?.data.status === 'ongoing' ? 'Processing' : 'Successful'}
            </h1>

            <div className={cn(
              "p-4 rounded-xl mb-6 border",
              statusConfig.bgAlert,
              statusConfig.borderColor
            )}>
              <p className={cn("text-sm", statusConfig.textColor)}>
                {data?.data.message}
              </p>
            </div>

            {data?.data.status === 'ongoing' && (
              <div className="space-y-4 mb-6 text-left">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Payment is being processed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Transaction is secure</span>
                </div>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full font-medium rounded-xl h-14 transition-all transform",
                "hover:scale-[1.02] active:scale-[0.98] shadow-lg",
                "flex items-center justify-center gap-2 mt-4",
                data?.data.status === 'failed' 
                  ? "bg-red-600 hover:bg-red-700 text-white hover:shadow-red-200/50"
                  : data?.data.status === 'ongoing'
                  ? "bg-orange-600 hover:bg-orange-700 text-white hover:shadow-orange-200/50"
                  : "bg-primaryColor hover:bg-indigo-700 text-white hover:shadow-indigo-200/50"
              )}
              onClick={() => {
                if(data?.data.status === 'failed'){
                  router.back();
                }else if (data?.data.status === 'ongoing'){
                  router.refresh();
                }else{
                  router.replace('/profile?tab=tickets');
                }
              }}
            >
              <Shield className="w-5 h-5" />
              {data?.data.status === 'failed' ? 'Try Again' : 
               data?.data.status === 'ongoing' ? 'Check Status' : 'View Tickets'}
            </motion.button>

            {data?.data.status === 'success' && (
              <p className="text-sm text-gray-500 mt-4">
                A confirmation email has been sent to your inbox
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
