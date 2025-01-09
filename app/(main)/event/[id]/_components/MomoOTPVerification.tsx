/* eslint-disable @typescript-eslint/no-explicit-any */
import { momoPayOTPVerify } from '@/lib/actions/orders';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MomoOTPDialog {
    open: boolean;
    openChange: (open: boolean) => void;
    reference: string;
}

export default function MomoOTPVerification({open, openChange, reference}: MomoOTPDialog) {
    const router = useRouter()
    const [otp, setOtp] = React.useState('');

    const {mutate, isPending} = useMutation({
        onMutate: async (e: any) => {
          e.preventDefault();
            try {
                const response = await momoPayOTPVerify(reference, otp);
                if (response.status) {
                    toast.success('Payment Init successful', {position: 'top-center'});
                    openChange(false);
                    router.replace(`/event/confirm?reference=${response.data.reference}`);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                // Show specific error message if available
                const errorMessage = error instanceof Error ? error.message : 'Failed to process otp. Please try again.';
                toast.error(errorMessage, {position: 'top-center'});
                console.log(errorMessage)
            }
        },
    });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-full max-w-md bg-white shadow-2xl border-gray-200 p-6 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Enter Verification Code
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-gray-600">
              Please enter the verification code sent to your number
            </AlertDialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-gray-500"
            onClick={() => openChange(!open)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={(e)=>mutate(e)} className="space-y-4">
          <InputOTP maxLength={6} 
            className="w-full"
            onChange={(value) => setOtp(value)}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup className='w-full gap-4'>
              <InputOTPSlot index={0} className='w-full h-10' />
              <InputOTPSlot index={1} className='w-full h-10' />
              <InputOTPSlot index={2} className='w-full h-10' />
              <InputOTPSlot index={3} className='w-full h-10' />
              <InputOTPSlot index={4} className='w-full h-10' />
              <InputOTPSlot index={5} className='w-full h-10' />
            </InputOTPGroup>
          </InputOTP>
          <Button 
            type="submit" 
            className="w-full bg-primaryColor hover:bg-indigo-700 text-white"
            disabled={isPending}
          >
            {isPending ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
