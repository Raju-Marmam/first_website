import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, Home, PartyPopper, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const BookingSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '2',
    roomType: 'Duplex AC Room',
    eventType: 'Stay Only'
  });

  useEffect(() => {
    const handleOpenBooking = () => setIsOpen(true);
    window.addEventListener('openBooking', handleOpenBooking);
    return () => window.removeEventListener('openBooking', handleOpenBooking);
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Show success
    setTimeout(() => {
      setIsOpen(false);
      setStep(1);
    }, 3000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 z-30 bg-[#5A5A40] text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 font-bold"
      >
        <CalendarIcon size={20} />
        Book Now
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#fdfbf7] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Sidebar Info */}
              <div className="w-full md:w-1/3 bg-[#5A5A40] p-10 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-4">Your Village Escape</h2>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Select your dates and preferences to begin your celebration at Green Haven.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">Dates</p>
                      <p className="text-sm font-medium">
                        {selectedRange.from ? format(selectedRange.from, 'MMM dd') : 'Select'} - {selectedRange.to ? format(selectedRange.to, 'MMM dd') : 'Select'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">Guests</p>
                      <p className="text-sm font-medium">{formData.guests} People</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10">
                  <p className="text-xs italic opacity-60">"Memories begin here."</p>
                </div>
              </div>

              {/* Main Form Area */}
              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <h3 className="text-2xl font-serif font-bold mb-8 text-[#1a1a1a]">Select Dates</h3>
                      <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-black/5">
                          <DayPicker
                            mode="range"
                            selected={{ from: selectedRange.from, to: selectedRange.to }}
                            onSelect={(range) => setSelectedRange(range || {})}
                            className="booking-calendar"
                          />
                        </div>
                      </div>
                      <button 
                        disabled={!selectedRange.from || !selectedRange.to}
                        onClick={() => setStep(2)}
                        className="mt-8 w-full bg-[#5A5A40] text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Details
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-serif font-bold mb-8 text-[#1a1a1a]">Guest Details</h3>
                      <form onSubmit={handleBooking} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Full Name</label>
                            <input 
                              required
                              type="text" 
                              className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Phone Number</label>
                            <input 
                              required
                              type="tel" 
                              className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Email Address</label>
                          <input 
                            required
                            type="email" 
                            className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Room Type</label>
                            <select 
                              className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none"
                              value={formData.roomType}
                              onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                            >
                              <option>Duplex AC Room</option>
                              <option>Guest Room</option>
                              <option>Full Resort Booking</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Event Type</label>
                            <select 
                              className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none"
                              value={formData.eventType}
                              onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                            >
                              <option>Stay Only</option>
                              <option>Wedding</option>
                              <option>Engagement</option>
                              <option>Birthday Party</option>
                              <option>Corporate Retreat</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 bg-black/5 text-[#1a1a1a] py-4 rounded-xl font-bold"
                          >
                            Back
                          </button>
                          <button 
                            type="submit"
                            className="flex-[2] bg-[#5A5A40] text-white py-4 rounded-xl font-bold"
                          >
                            Confirm Reservation
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-[#1a1a1a]">Reservation Requested!</h3>
                      <p className="text-[#1a1a1a]/60 max-w-xs">
                        Thank you, {formData.name}. We've received your request and will contact you shortly to confirm your stay.
                      </p>
                      <div className="pt-8 w-full">
                        <div className="bg-[#5A5A40]/5 p-6 rounded-2xl border border-[#5A5A40]/10 text-left">
                          <p className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold mb-2">Summary</p>
                          <p className="text-sm font-medium text-[#1a1a1a]">{formData.roomType} for {formData.guests} guests</p>
                          <p className="text-xs text-[#1a1a1a]/60 mt-1">
                            {selectedRange.from && format(selectedRange.from, 'PPP')} - {selectedRange.to && format(selectedRange.to, 'PPP')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
