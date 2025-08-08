import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory storage (replace with database later)
let contacts = [];
let bookings = [];
let statusChecks = [];

// Validation schemas
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  message: Joi.string().min(10).max(1000).required()
});

const bookingSchema = Joi.object({
  ticketType: Joi.string().valid('VIP', 'Premium', 'Standard').required(),
  quantity: Joi.number().min(1).max(10).required(),
  customerName: Joi.string().min(2).max(50).optional(),
  customerEmail: Joi.string().email().optional(),
  customerPhone: Joi.string().optional()
});

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Sandakadapahana Concert API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const contact = {
      id: uuidv4(),
      ...value,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    contacts.push(contact);

    res.json({
      success: true,
      message: 'Thank you! We will get back to you soon.',
      contactId: contact.id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all contacts (admin endpoint)
app.get('/api/contacts', (req, res) => {
  res.json({
    success: true,
    contacts: contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// Ticket booking
app.post('/api/booking', async (req, res) => {
  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const booking = {
      id: uuidv4(),
      ...value,
      createdAt: new Date().toISOString(),
      status: 'pending',
      totalAmount: calculateTicketPrice(value.ticketType) * value.quantity
    };

    bookings.push(booking);

    res.json({
      success: true,
      message: 'Booking successful! Check your email for confirmation.',
      bookingId: booking.id,
      totalAmount: booking.totalAmount
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all bookings (admin endpoint)
app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    bookings: bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// Get booking statistics
app.get('/api/booking-stats', (req, res) => {
  const totalBookings = bookings.length;
  const totalSeats = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
  const availableSeats = 500 - totalSeats;

  const ticketTypes = {
    VIP: { booked: 0, available: 50 },
    Premium: { booked: 0, available: 150 },
    Standard: { booked: 0, available: 300 }
  };

  bookings.forEach(booking => {
    if (ticketTypes[booking.ticketType]) {
      ticketTypes[booking.ticketType].booked += booking.quantity;
      ticketTypes[booking.ticketType].available -= booking.quantity;
    }
  });

  res.json({
    success: true,
    stats: {
      totalBookings,
      totalSeats,
      availableSeats,
      ticketTypes
    }
  });
});

// Status check endpoint (from original template)
app.post('/api/status', (req, res) => {
  const statusCheck = {
    id: uuidv4(),
    clientName: req.body.clientName || 'Unknown',
    timestamp: new Date().toISOString()
  };
  
  statusChecks.push(statusCheck);
  res.json(statusCheck);
});

app.get('/api/status', (req, res) => {
  res.json(statusChecks);
});

// Concert information endpoint
app.get('/api/concert-info', (req, res) => {
  res.json({
    success: true,
    data: {
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
    }
  });
});

// Helper functions
function calculateTicketPrice(ticketType) {
  const prices = {
    VIP: 5000,
    Premium: 3500,
    Standard: 2500
  };
  return prices[ticketType] || 2500;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Sandakadapahana Concert Server running on port ${PORT}`);
  console.log(`📱 Client should be running on http://localhost:3000`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});