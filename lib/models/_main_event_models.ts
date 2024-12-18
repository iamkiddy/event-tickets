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

// Main Event Response Model
export interface MainEventResponse {
  id: string;
  title: string;
  summary: string;
  overview: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  images: string[];
  isRefundable?: boolean;
  refundDaysBefore?: number;
  eventAgenda?: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    host: string[];
  }[];
  eventFAQ?: {
    id: string;
    question: string;
    answer: string;
  }[];
  tickets?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    discountValue: number;
    discountType: string;
  }[];
}
