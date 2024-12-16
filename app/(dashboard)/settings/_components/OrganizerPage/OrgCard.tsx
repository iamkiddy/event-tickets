"use client"
import { OrgProfileViewModel } from '@/lib/models/_org_models'
import React from 'react'
import Image from 'next/image'
import { EllipsisVertical, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import EditOrgPage from './EditOrgPage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteOrgProfile } from '@/lib/actions/organizer_actions'
import { DialogTitle } from '@radix-ui/react-dialog'


interface OrgCardProps {
    data: OrgProfileViewModel
}   


export default function OrgCard({ data }: OrgCardProps) {
  return (
    <div className='w-full bg-white flex flex-row gap-4 h-[80px] items-center px-5 rounded-lg mt-5'>
            {data.profileImage ? (
                <div className='w-[40px] h-[40px] rounded-full relative overflow-hidden bg-gray-400'>
                    <Image src={data.profileImage} fill alt={data.name} className='absolute'/>
                </div>
            ): (
                <div className='p-2 rounded-full bg-gray-200'>
                    <User className='w-6 h-6 text-gray-500' />
                </div>
            )}

        <div className='flex flex-col gap-1'>
            <p className='text-lg font-semibold text-gray-900'>{data.name}</p>
            <p className='text-sm text-gray-600'>{data.phone1}</p>
        </div>

        <Popover>
            <PopoverTrigger className='ml-auto'>
                <EllipsisVertical className='w-6 h-6 text-gray-600'/>
            </PopoverTrigger>
            <PopoverContent className='rounded-md bg-white flex flex-col w-[120px]'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className='w-full' variant='ghost'>Edit</Button>
                    </SheetTrigger>
                    <EditOrgPage id={data.id} />
                </Sheet>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className='w-full hover:bg-red-50 hover:text-red-500' variant='ghost'>Delete</Button>
                    </DialogTrigger>
                    {DeleteOrgProfileModel(data.id)}
                </Dialog>
            </PopoverContent>
        </Popover>
    </div>
  )
}



// delete a profile model
const DeleteOrgProfileModel = (id: string) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        onMutate: async () => deleteOrgProfile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orgs'] });
            toast.success('Profile deleted successfully', {position: 'top-center'});
        },
        onError: () => {
            toast.error('An error occurred while deleting profile', {position: 'top-center'});
        }
    })

    return (
        <DialogContent className='px-2 md:px-5'>
            <DialogHeader>
                <DialogTitle className='text-base font-semibold text-gray-700'>
                    Delete Profile
                </DialogTitle>
                <DialogDescription className='text-base text-gray-500'>
                    Are you sure you want to delete this profile?
                </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col md:flex-row gap-4'>
                <DialogClose asChild>
                    <Button className='w-full'>Cancel</Button>
                </DialogClose>
                <Button 
                disabled={isPending} 
                onClick={() => mutate()}
                className='w-full bg-red-500'>
                    Delete
                </Button>
            </div>
        </DialogContent>
    )
}