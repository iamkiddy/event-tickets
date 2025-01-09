"use client"
import { confirmMomoPay } from '@/lib/actions/orders';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { motion } from "framer-motion";
import { Shield } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50">
        Some is wrong
      </div>
    )
  }

  if(isLoading){
    return (
      <div className="min-h-screen bg-gray-50">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className='flex items-center justify-center h-screen'>
            <div className='text-center'>
                <h1 className='text-2xl font-bold'>Momo Pay Confirmation</h1>
                <p className={cn(
                  'text-green-600 bg-green-100 p-3 rounded-lg mt-3',
                  data?.data.status === 'failed' && 'text-red-500 bg-red-200',
                  data?.data.status === 'ongoing' && 'text-gray-500 bg-gray-200',
                )}>{data?.data.message}</p>
                <motion.button 
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.98 }}
                      className="w-full bg-primaryColor text-white font-medium rounded-xl h-14
                        hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200/50
                        flex items-center justify-center gap-2 mt-5"
                      onClick={() => {
                        if(data?.data.status === 'failed'){
                          router.back()
                        }else if (data?.data.status === 'ongoing'){
                          router.refresh()
                        }else{
                          router.replace('/profile?tab=tickets')
                        }
                      }}
                    >
                      <Shield className="w-5 h-5" />
                      {data?.data.status === 'failed' ? 'Reorder': data?.data.status === 'ongoing'? 'Verify Payment': 'View Order'}
                </motion.button>
            </div>
        </div>
    </div>
  )
}
