import React from 'react'
import AuthenticatedLayout from '@/lib/context/AuthenticatedLayout'   


export default function MainLayout({ children}: { children: React.ReactNode }) {
  return (
    <AuthenticatedLayout>
        {children}
    </AuthenticatedLayout>
  )
}
