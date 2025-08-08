import React, { useEffect, useState } from 'react';
import { 
  Music, 
  Ticket, 
  Users, 
  Calendar,
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Star,
  MapPin,
  Clock,
  Mail
} from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import ImageGallery from './ImageGallery';
import ContactForm from './ContactForm';
import { concertData, localStorageService } from '../services/localStorage';
import { apiService } from '../services/api';
import { useToast } from '../hooks/use-toast';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeNav, setActiveNav] = useState('home');
  const [bookingStats, setBookingStats] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize localStorage
    localStorageService.initialize();
    
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        setIsVisible((prev) => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting,
        }));
        
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    // Load booking stats
    loadBookingStats();

    return () => observer.disconnect();
  }, []);

  const loadBookingStats = async () => {
    try {
      // Try API first, fall back to localStorage
      try {
        const response = await apiService.getBookingStats();
        if (response.success) {
          setBookingStats(response.stats);
          return;
        }
      } catch (apiError) {
        console.log('API unavailable, using localStorage');
      }
      
      // Fall back to localStorage
      const stats = localStorageService.bookings.getStats();
      setBookingStats(stats);
    } catch (error) {
      console.error('Error loading booking stats:', error);
      // Set default stats
      setBookingStats({
        totalBookings: 0,
        totalSeatsBooked: 0,
        availableSeats: 500,
        ticketTypes: {
          VIP: { booked: 0, available: 50 },
          Premium: { booked: 0, available: 150 },
          Standard: { booked: 0, available: 300 }
        }
      });
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleBooking = async (ticketType) => {
    try {
      const bookingData = { 
        ticketType, 
        quantity: 1,
        customerName: 'Guest User',
        customerEmail: 'guest@example.com'
      };
      
      // Try API first, fall back to localStorage
      try {
        const response = await apiService.submitBooking(bookingData);
        if (response.success) {
          toast({
            title: "Booking Initiated!",
            description: response.message,
          });
          loadBookingStats(); // Refresh stats
          return;
        }
      } catch (apiError) {
        console.log('API unavailable, using localStorage');
      }

      // Fall back to localStorage
      const booking = localStorageService.bookings.add(bookingData);
      toast({
        title: "Booking Saved!",
        description: "Your booking has been saved locally. We'll contact you for payment!",
      });
      loadBookingStats(); // Refresh stats
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Music className="w-8 h-8 text-amber-600" />
              <span className="font-bold text-xl text-gray-800">Sandakadapahana</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['home', 'countdown', 'booking', 'gallery', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize font-medium transition-colors ${
                    activeNav === item 
                      ? 'text-amber-600 border-b-2 border-amber-600' 
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => scrollToSection('booking')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={concertData.heroImage}
            alt="Concert Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
          isVisible.home ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Sandakadapahana
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">
              Musical Concert
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="w-6 h-6 text-amber-400" />
              <p className="text-xl md:text-2xl font-light">
                Featuring <span className="font-semibold">Sunil Edirisinghe</span>
              </p>
              <Star className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">September 15, 2025</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Clock className="w-5 h-5" />
              <span className="font-medium">7:00 PM</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Nelum Pokuna Theatre</span>
            </div>
          </div>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            {concertData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('booking')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Book Tickets Now
            </button>
            <button
              onClick={() => scrollToSection('countdown')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 border border-white/30"
            >
              View Countdown
            </button>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section id="countdown" className="py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible.countdown ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Don't Miss Out!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The magical evening is approaching. Secure your seats for an unforgettable musical journey.
            </p>
          </div>
          
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible.countdown ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <CountdownTimer targetDate={concertData.date} />
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible.booking ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Reserve Your Seat
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our premium seating options and be part of this extraordinary musical experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-200 ${
              isVisible.booking ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-10'
            }`}>
              <img
                src={concertData.flyerImage}
                alt="Concert Flyer"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className={`transition-all duration-1000 delay-400 ${
              isVisible.booking ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-10'
            }`}>
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-xl border border-amber-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Ticket Options</h3>
                
                <div className="space-y-4 mb-8">
                  {bookingStats && Object.entries(bookingStats.ticketTypes).map(([type, info]) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
                      <div>
                        <h4 className="font-semibold text-gray-800">{type} Seating</h4>
                        <p className="text-gray-600">{info.available} seats available</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600 text-lg">LKR {concertData.ticketPrices[type].toLocaleString()}</p>
                        <button
                          onClick={() => handleBooking(type)}
                          disabled={info.available <= 0}
                          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {info.available <= 0 ? 'Sold Out' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-600">
                      {bookingStats ? bookingStats.availableSeats : 500} of 500 seats remaining
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBooking('Premium')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-6 h-6" />
                    Book Now - Quick Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible.gallery ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Previous Concerts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Relive the magic of past performances and get a glimpse of what awaits you.
            </p>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible.gallery ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <ImageGallery images={concertData.galleryImages} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible.contact ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? Need assistance with booking? We're here to help make your concert experience perfect.
            </p>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible.contact ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <ContactForm contactInfo={concertData.contactInfo} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-8 h-8 text-amber-600" />
                <span className="font-bold text-xl text-gray-800">Sandakadapahana</span>
              </div>
              <p className="text-gray-600 mb-4">
                An unforgettable musical journey with the legendary Sunil Edirisinghe.
              </p>
              <div className="flex space-x-4">
                <a href={concertData.socialMedia.facebook} className="text-gray-400 hover:text-amber-600 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href={concertData.socialMedia.instagram} className="text-gray-400 hover:text-amber-600 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href={concertData.socialMedia.twitter} className="text-gray-400 hover:text-amber-600 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href={concertData.socialMedia.youtube} className="text-gray-400 hover:text-amber-600 transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Countdown', 'Booking', 'Gallery', 'Contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {concertData.contactInfo.email}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Nelum Pokuna Theatre, Colombo
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-amber-300 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              &copy; 2025 Sandakadapahana Musical Concert. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;