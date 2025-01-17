"use client"
import React from 'react'
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ImageUpload } from '@/components/custom/image-upload'
import InputField from '@/components/custom/InputField'
import { Editor } from '@/components/ui/editor'
import { Button } from '@/components/ui/button'

export default function AddTeamMemberForm() {
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [formData, setFormData] = React.useState({
    name: '',
    users: [''],
    event: '',
    description: '',
    isActive: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const teamData = {
      name: formData.name,
      users: formData.users,
      event: formData.event,
      description: formData.description,
      isActive: formData.isActive
    }
    console.log('Submitting team data:', teamData)
    // Add your form submission logic here with teamData
  }
  
  return (
    <SheetContent className='bg-white w-[45%] overflow-y-auto'>
      <SheetHeader>
        <SheetTitle>Add Team</SheetTitle>
        <SheetDescription>
          Create a new team for your organization.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 mt-5'>
        <ImageUpload
          id='teamImage'
          label='Team Image'
          previewUrl={imageFile ? URL.createObjectURL(imageFile) : null}
          onChange={setImageFile}
          onPreviewChange={() => {}}
        />
        <InputField
          label='Team Name'
          name='name'
          placeholder='Enter team name'
          value={formData.name}
          setValue={(value) => setFormData({ ...formData, name: value })}
          required
        />
        <InputField
          label='User Email'
          name='users'
          type='email'
          placeholder='Enter user email'
          value={formData.users[0]}
          setValue={(value) => setFormData({ ...formData, users: [value] })}
          required
        />
        <InputField
          label='Event'
          name='event'
          placeholder='Enter event name'
          value={formData.event}
          setValue={(value) => setFormData({ ...formData, event: value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Editor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Enter team description..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active Team
          </label>
        </div>

        <Button type='submit' className='w-full mt-3 bg-primaryColor text-white hover:bg-indigo-700'>
          Create Team
        </Button>
      </form>
    </SheetContent>
  )
} 