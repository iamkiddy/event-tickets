export interface EventCardProps {
  month: string;
  day: string;
  title: string;
  description: string;
  image: string;
}

export interface BlogCardProps {
  image: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

export interface NavLinkProps {
  label: string;
  isButton?: boolean;
  isCreate?: boolean;
  isScrolled?: boolean;
}

export interface TicketType {
  id: string;
  type: string;
  price: number;
  available: number;
  description: string;
}

export interface EventDetails extends EventCardProps {
  id: string;
  tickets: TicketType[];
  venue: string;
  time: string;
  organizer: string;
}
