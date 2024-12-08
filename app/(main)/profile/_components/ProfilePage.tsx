"use client"
import InputField from '@/components/custom/InputField'
import { User2 } from 'lucide-react'
import React from 'react'


export default function ProfilePage() {
  
  return (
    <section className='w-full flex flex-col gap-4 mt-5'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <InputField
            label='First Name'
            placeholder='First Name'
            value=''
            setValue={() => {}}
            disabled={false}
            required={true}
            iconLeft={User2}
            className='w-full md:w-1/2'
          />
          <InputField
            label='Last Name'
            placeholder='Last Name'
            value=''
            setValue={() => {}}
            disabled={false}
            required={true}
            iconLeft={User2}
            className='w-full md:w-1/2'
          />
        </div>
    </section>
  )
}
