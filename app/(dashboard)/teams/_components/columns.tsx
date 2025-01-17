import { ColumnDef } from "@tanstack/react-table";

export interface Team {
  id: string;
  event: string;
  name: string;
  description: string;
}

export const columns: ColumnDef<Team>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Event",
    accessorKey: "event",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Description",
    accessorKey: "description",
  }
]; 