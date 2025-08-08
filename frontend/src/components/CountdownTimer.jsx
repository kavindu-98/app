import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-amber-700" />
          <h3 className="text-2xl font-bold text-gray-800">Concert Countdown</h3>
        </div>
        <div className="flex items-center justify-center gap-2 text-amber-700">
          <Clock className="w-5 h-5" />
          <p className="text-lg">September 15, 2025 | 7:00 PM</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-6 mb-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <span className="text-4xl md:text-5xl font-bold text-amber-800 block leading-none">
              {formatNumber(timeLeft.days)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Days</span>
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-6 mb-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <span className="text-4xl md:text-5xl font-bold text-amber-800 block leading-none">
              {formatNumber(timeLeft.hours)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Hours</span>
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-6 mb-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <span className="text-4xl md:text-5xl font-bold text-amber-800 block leading-none">
              {formatNumber(timeLeft.minutes)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Minutes</span>
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-6 mb-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <span className="text-4xl md:text-5xl font-bold text-amber-800 block leading-none">
              {formatNumber(timeLeft.seconds)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Seconds</span>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-600 text-lg">Don't miss this magical evening!</p>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <p className="text-amber-800 font-semibold">Nelum Pokuna Theatre, Colombo</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;