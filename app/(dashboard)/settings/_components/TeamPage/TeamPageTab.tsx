"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import AddTeamMemberForm from './AddTeamMemberForm'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, User } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

// Define the team type
type Team = {
  name: string
  users: string[]
  event: string
  description: string
  isActive: boolean
  id: string
  createdAt: string
}

export default function TeamPageTab() {
  // Sample data for demonstration
  const teams: Team[] = [
    {
      id: '1',
      name: 'Development Team',
      event: 'Project Alpha',
      users: ['user1@example.com', 'user2@example.com'],
      description: 'Main development team for our core products',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Design Team',
      event: 'UI Revamp',
      users: ['designer@example.com'],
      description: 'Creative team handling all design aspects',
      isActive: false,
      createdAt: new Date().toISOString(),
    }
  ]

  return (
    <section className='w-full flex flex-col gap-6'>
      <div className='flex justify-end'>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='h-[40px] md:px-5 rounded-md w-full md:w-fit bg-primaryColor text-white hover:bg-indigo-700'>
              <Plus className="w-4 h-4 mr-2" />
              Add team
            </Button>
          </SheetTrigger>
          <AddTeamMemberForm />
        </Sheet>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-primaryColor/20">
                  <AvatarFallback className="text-lg bg-primaryColor/10 text-primaryColor">
                    {team.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.event}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-primaryColor" />
                      <span>{team.users.length} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        team.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {team.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <Popover>
                  <PopoverTrigger className="ml-auto">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <User className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-0">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                          Edit
                        </Button>
                      </SheetTrigger>
                    </Sheet>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </PopoverContent>
                </Popover>
              </div>
              
              {team.description && (
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                  {team.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
