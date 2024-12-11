/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { ImageUpload } from '@/components/custom/image-upload';
import InputField from '@/components/custom/InputField';

export default function AddOrgPage() {
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    

    
  return (
    <SheetContent className='bg-white'>
        <SheetHeader>
            <SheetTitle>Add Organizer Profile</SheetTitle>
            <SheetDescription>
                Add a new organizer profile to your organization.
            </SheetDescription>
        </SheetHeader>

        <form className='w-full flex flex-col gap-4 mt-5'>
          <ImageUpload
            id='profile-image'
            label='Profile Image'
            previewUrl={imageFile ? URL.createObjectURL(imageFile) : null}
            onChange={setImageFile}
            onPreviewChange={() => {}}
          />
          <InputField
            label='Name'
            name='name'
            placeholder='Enter name'
            value=''
            setValue={() => {}}
            required
          />
        </form>
    </SheetContent>
  )
}
