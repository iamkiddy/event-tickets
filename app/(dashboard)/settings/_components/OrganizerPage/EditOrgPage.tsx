import React from 'react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"


export default function EditOrgPage() {
  return (
    <SheetContent className='bg-white'>
        <SheetHeader>
            <SheetTitle>Add Organizer Profile</SheetTitle>
            <SheetDescription>
                Add a new organizer profile to your organization.
            </SheetDescription>
        </SheetHeader>

        <form className='w-full flex flex-col gap-4 mt-5'>

        </form>
    </SheetContent>
  )
}
