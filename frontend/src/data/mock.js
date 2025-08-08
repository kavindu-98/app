// Mock data for Sandakadapahana Concert Landing Page

export const concertData = {
  eventName: "Sandakadapahana Musical Concert",
  artist: "Sunil Edirisinghe",
  date: "2025-09-15T19:00:00", // September 15, 2025, 7:00 PM
  venue: "Nelum Pokuna Theatre, Colombo",
  description: "Join us for an enchanting evening of classical Sinhala music with the legendary Sunil Edirisinghe. Experience the magic of 'Sandakadapahana' - a musical journey through timeless melodies.",
  ticketPrice: "LKR 2,500 - 5,000",
  
  heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  
  flyerImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  
  galleryImages: [
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  
  contactInfo: {
    phone: "+94 77 123 4567",
    email: "tickets@sandakadapahana.lk",
    address: "123 Galle Road, Colombo 03, Sri Lanka"
  },
  
  socialMedia: {
    facebook: "https://facebook.com/sandakadapahana",
    instagram: "https://instagram.com/sandakadapahana",
    twitter: "https://twitter.com/sandakadapahana",
    youtube: "https://youtube.com/sandakadapahana"
  }
};

// Mock booking data
export const bookingData = {
  availableSeats: 450,
  totalSeats: 500,
  ticketTypes: [
    { type: "VIP", price: "LKR 5,000", available: 50 },
    { type: "Premium", price: "LKR 3,500", available: 150 },
    { type: "Standard", price: "LKR 2,500", available: 250 }
  ]
};

// Mock form submission
export const submitContactForm = async (formData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Form submitted:', formData);
      resolve({ success: true, message: 'Thank you! We will get back to you soon.' });
    }, 1000);
  });
};

export const bookTickets = async (ticketData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Booking submitted:', ticketData);
      resolve({ success: true, message: 'Booking successful! Check your email for confirmation.' });
    }, 1500);
  });
};