'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { columns } from './_components/columns';

interface TeamResponse {
  page: number;
  total: number;
  limit: number;
  data: {
    id: string;
    event: string;
    name: string;
    description: string;
  }[];
}

const mockTeams: TeamResponse = {
  page: 0,
  total: 10,
  limit: 10,
  data: [
    {
      id: "TEAM-001",
      event: "Summer Music Festival 2024",
      name: "Event Staff Team",
      description: "Main event coordination team"
    },
    // Add more mock data as needed
  ]
};

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter teams based on search term
  const filteredTeams = mockTeams.data.filter(team => 
    team.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Teams</h1>
        
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredTeams}
        isLoading={false}
        total={filteredTeams.length}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTeams.length / mockTeams.limit)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}