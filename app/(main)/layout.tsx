import React from 'react'
import AuthenticatedLayout from '@/lib/context/AuthenticatedLayout'  
import { Suspense } from 'react'; 


export default function MainLayout({ children}: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <AuthenticatedLayout>
        {children}
    </AuthenticatedLayout>
    </Suspense>
  )
}
