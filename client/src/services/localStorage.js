// localStorage service for client-side data persistence
const STORAGE_KEYS = {
  CONTACTS: 'sandakadapahana_contacts',
  BOOKINGS: 'sandakadapahana_bookings',
  CONCERT_DATA: 'sandakadapahana_concert_data',
};

// Concert data
export const concertData = {
  eventName: "Sandakadapahana Musical Concert",
  artist: "Sunil Edirisinghe",
  date: "2025-09-15T19:00:00",
  venue: "Nelum Pokuna Theatre, Colombo",
  description: "Join us for an enchanting evening of classical Sinhala music with the legendary Sunil Edirisinghe. Experience the magic of 'Sandakadapahana' - a musical journey through timeless melodies.",
  ticketPrices: {
    VIP: 5000,
    Premium: 3500,
    Standard: 2500
  },
  
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

// Booking data
export const initialBookingData = {
  availableSeats: 500,
  totalSeats: 500,
  ticketTypes: {
    VIP: { available: 50, price: 5000 },
    Premium: { available: 150, price: 3500 },
    Standard: { available: 300, price: 2500 }
  }
};

// Generic localStorage utilities
const localStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Contact service
export const contactService = {
  getAll: () => {
    return localStorage.get(STORAGE_KEYS.CONTACTS, []);
  },

  add: (contact) => {
    const contacts = contactService.getAll();
    const newContact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...contact,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    contacts.push(newContact);
    localStorage.set(STORAGE_KEYS.CONTACTS, contacts);
    return newContact;
  },

  update: (id, updates) => {
    const contacts = contactService.getAll();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates };
      localStorage.set(STORAGE_KEYS.CONTACTS, contacts);
      return contacts[index];
    }
    return null;
  },

  delete: (id) => {
    const contacts = contactService.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.set(STORAGE_KEYS.CONTACTS, filtered);
    return true;
  }
};

// Booking service
export const bookingService = {
  getAll: () => {
    return localStorage.get(STORAGE_KEYS.BOOKINGS, []);
  },

  add: (booking) => {
    const bookings = bookingService.getAll();
    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...booking,
      createdAt: new Date().toISOString(),
      status: 'pending',
      totalAmount: (concertData.ticketPrices[booking.ticketType] || 2500) * (booking.quantity || 1)
    };
    bookings.push(newBooking);
    localStorage.set(STORAGE_KEYS.BOOKINGS, bookings);
    
    // Update available seats
    bookingService.updateAvailableSeats(booking.ticketType, booking.quantity || 1);
    
    return newBooking;
  },

  updateAvailableSeats: (ticketType, quantity) => {
    // This would be handled by the backend in a real application
    // For now, we'll just store the booking and calculate availability on the fly
  },

  getStats: () => {
    const bookings = bookingService.getAll();
    const totalBookings = bookings.length;
    const totalSeatsBooked = bookings.reduce((sum, booking) => sum + (booking.quantity || 1), 0);
    const availableSeats = initialBookingData.availableSeats - totalSeatsBooked;

    const ticketStats = {
      VIP: { booked: 0, available: initialBookingData.ticketTypes.VIP.available },
      Premium: { booked: 0, available: initialBookingData.ticketTypes.Premium.available },
      Standard: { booked: 0, available: initialBookingData.ticketTypes.Standard.available }
    };

    bookings.forEach(booking => {
      if (ticketStats[booking.ticketType]) {
        ticketStats[booking.ticketType].booked += (booking.quantity || 1);
        ticketStats[booking.ticketType].available -= (booking.quantity || 1);
      }
    });

    return {
      totalBookings,
      totalSeatsBooked,
      availableSeats,
      ticketTypes: ticketStats
    };
  },

  delete: (id) => {
    const bookings = bookingService.getAll();
    const filtered = bookings.filter(b => b.id !== id);
    localStorage.set(STORAGE_KEYS.BOOKINGS, filtered);
    return true;
  }
};

// Initialize storage
export const initializeStorage = () => {
  // Set initial data if not present
  if (!localStorage.get(STORAGE_KEYS.CONCERT_DATA)) {
    localStorage.set(STORAGE_KEYS.CONCERT_DATA, concertData);
  }
  
  if (!localStorage.get(STORAGE_KEYS.CONTACTS)) {
    localStorage.set(STORAGE_KEYS.CONTACTS, []);
  }
  
  if (!localStorage.get(STORAGE_KEYS.BOOKINGS)) {
    localStorage.set(STORAGE_KEYS.BOOKINGS, []);
  }
};

// Combined service for easy import
export const localStorageService = {
  contacts: contactService,
  bookings: bookingService,
  initialize: initializeStorage,
  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.remove(key);
    });
    initializeStorage();
  }
};

export default localStorageService;