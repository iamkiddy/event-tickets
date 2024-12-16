/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrgProfile } from '@/lib/actions/organizer_actions';
import { toast } from 'sonner';

export default function AddOrgPage() {
    const queryClient = useQueryClient();
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [formData, setFormData] = React.useState({
      name: '',
      bio: '',
      phone1: '',
      phone2: '',
      website: '',
      country: 'Ghana'
    });

    const { mutate, isPending } = useMutation({
      onMutate: async (formData: FormData) => {
        if (imageFile) {
          formData.append('profileImage', imageFile);
        }
        const response = await createOrgProfile(formData);
        console.log(response);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orgs'] });
        toast.success('Profile added successfully', {position: 'top-center'});
        setFormData({name: '', bio: '', phone1: '', phone2: '', website: '', country: 'Ghana'});
      }
    })
    

    
  return (
    <SheetContent className='bg-white w-[45%] overflow-y-auto'>
        <SheetHeader>
            <SheetTitle>Add Organizer Profile</SheetTitle>
            <SheetDescription>
                Add a new organizer profile to your organization.
            </SheetDescription>
        </SheetHeader>

        <form action={mutate} className='w-full flex flex-col gap-4 mt-5'>
          <ImageUpload
            id='profileImage'
            label='Profile Image'
            previewUrl={imageFile ? URL.createObjectURL(imageFile) : null}
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
              disabled={isPending}
              onChange={(value) => setFormData({ ...formData, bio: value })}
              placeholder="Enter bio..."
            />
          </div>

          <Button disabled={isPending} type='submit' className='w-full mt-3'>
            {isPending ? 'Adding...' : 'Add Profile'}
          </Button>
        </form>
    </SheetContent>
  )
}
