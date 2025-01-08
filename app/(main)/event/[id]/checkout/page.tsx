/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { 
  Phone, 
  Receipt, 
  Shield, 
  ArrowLeft, 
  Ticket,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { usePaystackPayment } from 'react-paystack';
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCheckoutDetails, momoPayInit } from "@/lib/actions/orders";
import CheckOutLoading from "../_components/CheckOutLoading";
import InputField from "@/components/custom/InputField";
import { MomoPayForm } from "@/lib/models/_orders_models";
import { toast } from "sonner";
import MomoOTPVerification from "../_components/MomoOTPVerification";


export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('code') || '';
  const [showOtp, setShowOtp] = useState(false);
  const [reference, setReference] = useState('')
  const [isAtTop, setIsAtTop] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [mobileData, setMobileData] = useState({
    phoneNumber: "",
    network: "mtn",
  });

  // get checkout details
  const { data, isLoading } = useQuery({
    queryKey: ['checkout-details', orderCode],
    queryFn: async () => await getCheckoutDetails(orderCode),
  });

  // Initialize Paystack with config after total is calculated
  const config = {
    reference: `${orderCode}`,
    email: data?.email,
    amount: data?.paymentTotal,
    publicKey: 'pk_test_db4e09868b49d7f59f8fe2987a46ff07379e5ab2',
    currency: data?.currency,
  };

  const initializePayment = usePaystackPayment(config);

  // you can call this function anything
  const onSuccess = (reference: string) => {
    // Implementation for whatever you want to do when the Paystack dialog closed
    console.log(reference);
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
  }

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMobileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Momo Payment Submission
  const { mutate: handleMomoSubmit, isPending} = useMutation({
    mutationFn: async () => {
      const momoData: MomoPayForm = {
        amount: data?.paymentTotal || 0,
        email: data?.email || '',
        currency: data?.currency || '',
        mobile_money: {
          phone: mobileData.phoneNumber,
          provider: mobileData.network,
        }
      };
      try{
        const response = await momoPayInit(momoData);
        console.log(response)
        if (response.data.status === 'send_otp') {
          setShowOtp(true);
          setReference(response.data.reference)
        } else if (response.data.status !== 'send_otp') {
          toast.success('Payment Init successful', {position: 'top-center'});
          router.replace(`/event/confirm?reference=${response.data.reference}`);
        } else {
          toast.error('Failed to process momo pay. Please try again.', {position: 'top-center'});
        }
      } catch (error) {
        // Show specific error message if available
        const errorMessage = error instanceof Error ? error.message : 'Failed to process momo pay. Please try again.';
        toast.error(errorMessage, {position: 'top-center'});
        console.log(errorMessage)
      }
    }
  });

  useEffect(() => {
    setIsAtTop(window.scrollY < 10);
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isAtTop ? 'bg-transparent' : 'bg-white shadow-sm'
      )}>
        <div className="h-16 px-4 flex items-center justify-between max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Secure Checkout</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {isLoading ? (
        <CheckOutLoading/>
      ) : (
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Payment Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h3>
                  
                  {/* Payment Method Tabs */}
                  <div className="bg-gray-50/50 p-2 rounded-2xl mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('mobile')}
                        className={cn(
                          "flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300",
                          "text-lg hover:text-primaryColor/80",
                          selectedPaymentMethod === 'mobile' 
                            ? "bg-white text-primaryColor shadow-lg scale-[1.02]" 
                            : "text-gray-600"
                        )}
                      >
                        <Phone className="w-5 h-5" />
                        Mobile Money
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={cn(
                          "flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300",
                          "text-lg hover:text-primaryColor/80",
                          selectedPaymentMethod === 'card' 
                            ? "bg-white text-primaryColor shadow-lg scale-[1.02]" 
                            : "text-gray-600"
                        )}
                      >
                        <CreditCard className="w-5 h-5" />
                        Credit Card
                      </button>
                    </div>
                  </div>

                  {/* Payment Forms */}
                  <div className="space-y-6 mt-4 animate-in fade-in-50 duration-500">
                    {selectedPaymentMethod === 'mobile' ? (
                      // Existing Mobile Money Form
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 gap-6"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Phone Number</label>
                          <div className="relative">
                            <Input
                              name="phoneNumber"
                              placeholder="XX XXX XXXX"
                              value={mobileData.phoneNumber}
                              onChange={handleMobileInputChange}
                              className="h-12 pl-14 pr-4 rounded-lg border-gray-200 focus:border-primaryColor 
                                focus:ring-primaryColor/20 transition-all text-base"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                              +233
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Network Provider</label>
                          <div className="relative">
                            <select
                              name="network"
                              value={mobileData.network}
                              onChange={handleMobileInputChange}
                              className="w-full h-12 pl-11 pr-10 rounded-lg border-gray-200 focus:border-primaryColor 
                                focus:ring-primaryColor/20 focus:ring-2 focus:outline-none bg-white transition-all
                                appearance-none text-base cursor-pointer"
                            >
                              <option value="mtn">MTN Mobile Money</option>
                              <option value="vodafone">Vodafone Cash</option>
                              <option value="airteltigo">AirtelTigo Money</option>
                            </select>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              {mobileData.network === 'mtn' && (
                                <div className="w-5 h-5 rounded-full bg-yellow-400" />
                              )}
                              {mobileData.network === 'vodafone' && (
                                <div className="w-5 h-5 rounded-full bg-red-500" />
                              )}
                              {mobileData.network === 'airteltigo' && (
                                <div className="w-5 h-5 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg 
                                className="w-5 h-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 9l-7 7-7-7" 
                                />
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">
                            {mobileData.network === 'mtn' && "You'll receive a prompt on your phone to complete the payment"}
                            {mobileData.network === 'vodafone' && "Enter your Vodafone Cash PIN to complete payment"}
                            {mobileData.network === 'airteltigo' && "You'll receive a USSD prompt to complete payment"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <InputField
                            label="Email Address"
                            value={data?.email || ''}
                            disabled
                          />
                          <p className="text-xs text-gray-500">Your receipt will be sent to this email</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mt-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <h5 className="font-medium text-gray-900">Payment Instructions</h5>
                              <p className="text-sm text-gray-600 mt-0.5">
                                After clicking pay, you&apos;ll receive a prompt on your phone to complete the payment
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // New Card Payment Form
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 gap-6"
                      >
                        <div className="space-y-2">
                          <InputField
                            label="Email Address"
                            value={data?.email || ''}
                            disabled
                          />
                          <p className="text-xs text-gray-500">Payment receipt will be sent to this email</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 mt-4">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-green-600" />
                            <div>
                              <h5 className="font-medium text-green-800">Secure Card Payment</h5>
                              <p className="text-sm text-green-700 mt-0.5">
                                Your payment will be processed securely via Paystack
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Security Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-green-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800">Secure Payment</h5>
                      <p className="text-sm text-green-700 mt-0.5">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 text-gray-900 mb-6">
                      <Receipt className="w-5 h-5" />
                      <h4 className="font-semibold">Order Summary</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {data?.tickets.map(ticket => (
                        <div key={ticket.ticketName} className="flex justify-between items-center py-2">
                          <div className="flex items-start gap-3">
                            <Ticket className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex gap-1 items-center">
                              <span className="text-gray-900 font-medium">{ticket.ticketName}</span>
                              <p className="text-sm text-gray-500">× {ticket.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium">{data.currency} {ticket.totalPrice}</span>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t border-dashed">
                        {data?.coupon && (
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                            <span>Coupon Discount</span>
                            <span>
                              - {data?.couponType === 'percentage' ? `${data?.coupon}%` : 
                              `${data.currency} -${data?.coupon}`}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                          <span>Subtotal</span>
                          <span>{data?.currency} {data?.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="font-bold text-lg text-gray-900">
                            {data?.currency} {(data?.total ?? 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  {selectedPaymentMethod !== 'mobile' ? (
                    <motion.button disabled={isPending} type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className="w-full bg-primaryColor text-white font-medium rounded-xl h-14
                        hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200/50
                        flex items-center justify-center gap-2"
                      onClick={() => initializePayment({onSuccess, onClose})}
                    >
                      <CreditCard className="w-5 h-5" />
                      Pay {data?.currency ?? ''} {(data?.total ?? 0).toFixed(2)}
                    </motion.button>
                  ): (
                    <motion.button 
                      type="submit" 
                      disabled={isPending} 
                      whileHover={{ scale: 1.01 }} 
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-primaryColor text-white font-medium rounded-xl h-14
                        hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                        shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                      onClick={() => handleMomoSubmit()}
                    >
                      <Shield className="w-5 h-5" />
                      {isPending ? (
                        <span className="opacity-50">Processing...</span>
                      ) : (
                        `Pay ${data?.currency ?? ''} ${(data?.total ?? 0).toFixed(2)}`
                      )}
                    </motion.button>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    Your payment information is secure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      <MomoOTPVerification
        open={showOtp}
        openChange={setShowOtp}
        reference={reference}
      />
    </div>
  );
}