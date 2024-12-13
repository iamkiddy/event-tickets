"use client"
import React from 'react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { ImageUpload } from '@/components/custom/image-upload';
import InputField from '@/components/custom/InputField';
import { Editor } from '@/components/ui/editor';
import PhoneNumberField from '@/components/custom/PhoneNumberField.tsx/PhoneNumberField';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/custom/SelectField';
import { getCountriesOptions } from '@/components/custom/PhoneNumberField.tsx/helpers';
import { SelectItem } from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrgProfileById, updateOrgProfile } from '@/lib/actions/organizer_actions';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorPageCard from '@/components/custom/ErrorPageCard';
import { toast } from 'sonner';


export default function EditOrgPage({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['org'], 
    queryFn: () => getOrgProfileById(id)
  })

  const [formData, setFormData] = React.useState({
    name: data?.name || '',
    bio: data?.bio || '',
    phone1: data?.phone1 || '',
    phone2: data?.phone2 || '',
    website: data?.website || '',
    country: data?.country || 'Ghana'
  });

  const { mutate, isPending } = useMutation({
    onMutate: async (formData: FormData) => {
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }
      const response = await updateOrgProfile(id, formData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] });
      toast.success('Profile added successfully');
    }
  })
    

    
  return (
    <SheetContent className='bg-white w-[45%] overflow-y-auto'>
        <SheetHeader>
            <SheetTitle>Edit Organizer Profile</SheetTitle>
            <SheetDescription>
                Edit your organizer profile.
            </SheetDescription>
        </SheetHeader>

        {isError && <ErrorPageCard />}

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='w-full h-10 bg-gray-200 mt-3' />
          ))
        ) : (
            <form action={mutate} className='w-full flex flex-col gap-4 mt-5'>
              <ImageUpload
                id='profileImage'
                label='Profile Image'
                previewUrl={imageFile ? URL.createObjectURL(imageFile) : data?.profileImage || null}
                onChange={setImageFile}
                onPreviewChange={() => {}}
              />
              <InputField
                label='Name'
                name='name'
                placeholder='Enter name'
                value={formData.name}
                setValue={(value) => setFormData({ ...formData, name: value })}
                required
                disabled={isPending}
              />
              <PhoneNumberField
                name='phone1'
                label='Phone Number 1'
                phoneValue={formData.phone1}
                onChange={(value) => setFormData({ ...formData, phone1: value })}
                required
                disabled={isPending}
              />
              <PhoneNumberField
                name='phone2'
                label='Phone Number 2'
                phoneValue={formData.phone2}
                onChange={(value) => setFormData({ ...formData, phone2: value })}
                disabled={isPending}
              />
              <SelectField
                name='country'
                label='Country'
                value={formData.country}
                setValue={(value) => setFormData({ ...formData, country: value })}
                disabled={isPending}
              >
                {getCountriesOptions().map((country) => (
                  <SelectItem key={country.value} value={country.label}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectField>
              <InputField
                label='Website'
                name='website'
                placeholder='Enter website'
                value={formData.website}
                setValue={(value) => setFormData({ ...formData, website: value })}
                disabled={isPending}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Editor
                  value={formData.bio}
                  onChange={(value) => setFormData({ ...formData, bio: value })}
                  placeholder="Enter bio..."
                  disabled={isPending}
                />
              </div>

              <Button disabled={isPending} type='submit' className='w-full mt-3'>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </form>
        )}
    </SheetContent>
  )
}
