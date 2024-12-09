/* eslint-disable @typescript-eslint/no-unused-vars */
import SearchField from '@/components/custom/SearchField'
import { Button } from '@/components/ui/button'
import React from 'react'
import {Sheet, SheetTrigger } from "@/components/ui/sheet"
import AddOrgPage from './AddOrgPage';

interface OrganizerPageTabProps {
  search: string;
  page: number;
}

export default function OrganizerPageTab({ search, page }: OrganizerPageTabProps) {

  return (
    <section className='w-full flex flex-col gap-4'>
        <div className='w-full flex flex-col gap-3 md:flex-row items-center justify-end'>
          <SearchField />
          <Sheet>
            <SheetTrigger asChild>
              <Button className='h-[40px] md:px-5 rounded-md w-full md:w-fit'>
                Add organizer profile
              </Button>
            </SheetTrigger>
            <AddOrgPage />
          </Sheet>
        </div>

        
    </section>
  )
}
