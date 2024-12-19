// Event Search Query Parameters
export interface EventSearchParams {
  search?: string;
  category?: string;
  type?: string;
  time?: string;
  where?: string;
  date?: string;
  page?: number;
}

// Event List Item Model
export interface EventListItem {
  id: string;
  image: string;
  title: string;
  startDate: string;
  summary: string;
  isPublish: boolean;
  price?: string;
  location?: string;
  category?: string;
}

// Event List Response Model
export interface EventListResponse {
  page: number;
  total: number;
  limit: number;
  data: EventListItem[];
}



// Organised Event Response Model
export interface OrganisedEventResponse {
  id: string;
  title: string;
  summary: string;
  startDate: string;
  mainImage: string;
  author: string;
  date: string;
  image: string;
}

// Related Event Response Model
export interface RelatedEventResponse{
  id: string;
  title: string;
  summary: string;
  startDate: string;
  mainImage: string;
  author: string;
  date: string;
  image: string;
}

// Event Organizer Model
export interface EventOrganizer {
  name: string;
  profileImage: string;
  phone1: string;
  phone2: string;
  website: string;
  bio: string;
  country: string;
}

// Event Ticket Model
export interface EventTicket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  discountValue: number;
  discountType: string;
}

// Event FAQ Model
export interface EventFAQ {
  question: string;
  answer: string;
}

// Event Agenda Model
export interface EventAgenda {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  host: string[];
}

// Event Details Model
export interface EventDetails {
  id: string;
  images: string[];
  title: string;
  summary: string;
  overview: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  country: string;
  city: string;
  state: string;
  address1: string;
  address2: string;
  totalCapacity: number;
  videoUrl: string;
  tags: string[];
  locationType: string;
  isRefundable: boolean;
  refundDaysBefore: number;
  faqs: EventFAQ[];
  agendas: EventAgenda[];
  tickets: EventTicket[];
  organizer: EventOrganizer;
}