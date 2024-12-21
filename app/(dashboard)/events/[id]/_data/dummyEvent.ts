export const dummyEvent = {
  id: "1",
  title: "Tech Conference 2024",
  summary: "Join us for the biggest tech conference of the year",
  overview: "Experience three days of cutting-edge technology, inspiring speakers, and networking opportunities. This conference brings together industry leaders, innovators, and developers from around the world.",
  startDate: "2024-06-15",
  startTime: "09:00",
  endDate: "2024-06-17",
  endTime: "18:00",
  totalCapacity: 500,
  soldOut: 350,
  totalGross: 175000,
  status: 'published' as const,
  tags: ["Technology", "Innovation", "Networking", "AI", "Web3"],
  locationType: "venue",
  address1: "Convention Center",
  address2: "Suite 100",
  city: "San Francisco",
  state: "CA",
  country: "United States",
  postalCode: "94105",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
  eventFAQ: [
    {
      id: "1",
      question: "What's included in the ticket price?",
      answer: "Full access to all keynotes, workshops, networking events, and meals during the conference."
    },
    {
      id: "2",
      question: "Is there a dress code?",
      answer: "Business casual is recommended for all conference sessions and events."
    }
  ],
  eventAgenda: [
    {
      id: "1",
      title: "Opening Keynote",
      description: "Welcome address and future of technology keynote speech",
      startTime: "09:00",
      endTime: "10:30",
      host: ["Sarah Johnson", "Mike Chen"]
    }
  ]
};
