"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import React from 'react'
import {Sheet, SheetTrigger } from "@/components/ui/sheet"
import AddOrgPage from './AddOrgPage';
import { useQuery } from '@tanstack/react-query'
import { getAllOrgProfiles } from '@/lib/actions/organizer_actions'
import PageLoader from '../PageLoader'
import OrgCard from './OrgCard'


export default function OrganizerPageTab() {
  const { data, isLoading, isError, error } = useQuery({ 
    queryKey: ['orgs'], 
    queryFn: () => getAllOrgProfiles()
  })

  return (
    <section className='w-full flex flex-col gap-4'>
        <Sheet>
          <SheetTrigger asChild className='ml-auto'>
            <Button className='h-[40px] md:px-5 rounded-md w-full md:w-fit'>
              Add organizer profile
            </Button>
          </SheetTrigger>
          <AddOrgPage />
        </Sheet>

        {isLoading ? (
          <PageLoader />
        ) : (
          data?.map((org) => (
            <OrgCard key={org.id} data={org} />
          ))
        )}
    </section>
  )
}
