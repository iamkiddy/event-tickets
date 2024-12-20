/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import InputField from '@/components/custom/InputField'
import { getCountriesOptions } from '@/components/custom/PhoneNumberField.tsx/helpers'
import PhoneNumberField from '@/components/custom/PhoneNumberField.tsx/PhoneNumberField'
import SelectField from '@/components/custom/SelectField'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { updateUserProfile } from '@/lib/actions/auth'
import { UserProfileModel } from '@/lib/models/_auth_models'
import { cn } from '@/lib/utils'
import { Mail, User2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'


interface ProfilePageProps {
  data: UserProfileModel 
}




export default function ProfilePage({ data }: ProfilePageProps) {
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    fullname: data.fullname,
    phone: data.phone,
    country: data.country,
    messageType: data.messageType,
  })


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await updateUserProfile(formData)
      if (response?.error){
        toast.error(response.error, { position: 'top-center' })
        return;
      }else{
        toast.success('Profile updated successfully', { position: 'top-center' })
      }
    } catch (error) {
      toast.error((error as Error).message, { position: 'top-center' })
    } finally {
      setLoading(false)
    }
  }
  
  
  return (
    <section className='w-full flex flex-col gap-4 mt-5'>
      <h2 className='text-xl font-semibold mt-5'>Profile Information</h2>
      <form onSubmit={handleUpdateProfile} className='w-full flex flex-col gap-4'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <InputField
            label='Fullname'
            value={formData.fullname}
            setValue={(value) => setFormData({ ...formData, fullname: value })}
            disabled={data.provider !== 'email'}
            required={true}
            iconLeft={User2}
            className='w-full md:w-1/2'
          />
          <InputField
            label='Email Address'
            value={data.email}
            setValue={() => {}}
            disabled={true}
            required={true}
            iconLeft={Mail}
            className='w-full md:w-1/2'
          />
        </div>
        
        <div className='w-full flex flex-col gap-4 md:flex-row'>
          <PhoneNumberField
            name='phone'
            label='Phone Number'
            phoneValue={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            required={true}
            disabled={loading}
            className='w-full md:w-1/2'
          />
          <SelectField
              name='country'
              label='Country'
              value={formData.country}
              setValue={(value) => setFormData({ ...formData, country: value })}
              disabled={loading}
              className='w-full md:w-1/2'
            >
              {getCountriesOptions().map((country) => (
                <SelectItem key={country.value} value={country.label}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectField>
        </div>

        <div className='w-full flex flex-col gap-4 mt-5'>
          <h2 className='text-xl font-semibold mt-5'>Notification Settings</h2>
          <div className="flex flex-col gap-2 md:flex-row items-center md:justify-between">
            <div className="space-y-0.5">
              <Label className='text-lg text-gray-800'>Notifications Type</Label>
              <p className="text-sm text-gray-500">
                Select where you want to receive ticket notifications
                or OTP codes 
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <span className={cn('text-lg text-gray-400', formData.messageType === 'email' && 'text-secondaryColor')}>Email</span>
              <Switch
                checked={formData.messageType === 'email' ? false : true}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, messageType: checked ? 'sms' : 'email' }))
                }
                disabled={loading}
              />
              <span className={cn('text-lg text-gray-400', formData.messageType === 'sms' && 'text-primaryColor')}>SMS</span>
            </div>
            
          </div>
        </div>

        <Button 
          type='submit'
          className='w-full md:w-[300px] md:ml-auto mt-5'
          disabled={loading} >
          {loading ? 'Loading...': 'Save'}
        </Button>
      </form>
    </section>
  )
}
