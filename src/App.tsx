/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Music, 
  Volume2, 
  VolumeX, 
  ChevronDown,
  Mail,
  Instagram,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Components ---

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isPast: false
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl font-serif italic text-[#5a5a40]">The Celebration has Begun!</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 md:gap-8 justify-center mt-8">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds }
      ].map((item) => (
        <div key={item.label} className="text-center min-w-[70px] md:min-w-[100px]">
          <motion.div 
            key={item.value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-serif font-light text-[#5a5a40]"
          >
            {item.value.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-[10px] uppercase tracking-widest text-[#8e9299] mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-12">
    {subtitle && (
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-[#5a5a40] font-serif italic text-lg block mb-2"
      >
        {subtitle}
      </motion.span>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-6xl font-serif text-[#2c2c2c] tracking-tight"
    >
      {title}
    </motion.h2>
    <div className="w-16 h-[1px] bg-[#5a5a40]/30 mx-auto mt-6" />
  </div>
);

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Placeholder Wedding Date: December 31, 2026 (Future date relative to Feb 2026)
  const weddingDate = new Date('2026-12-31T18:00:00');

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop 
      />

      {/* Music Control */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleMusic}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#5a5a40]/20 flex items-center justify-center text-[#5a5a40] shadow-lg hover:bg-white transition-colors"
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cover Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fdfcf8] p-6 text-center"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <img 
                src="https://picsum.photos/seed/wedding-bg/1920/1080?blur=10" 
                className="w-full h-full object-cover"
                alt=""
                referrerPolicy="no-referrer"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10"
            >
              <span className="text-[#5a5a40] font-serif italic text-xl mb-4 block">The Wedding of</span>
              <h1 className="text-6xl md:text-8xl font-serif text-[#2c2c2c] mb-8 leading-tight">
                Julian <br className="md:hidden" /> & <br className="md:hidden" /> Elena
              </h1>
              
              <button 
                onClick={handleOpen}
                className="group relative px-10 py-4 bg-[#5a5a40] text-white rounded-full font-serif text-lg overflow-hidden transition-all hover:pr-14"
              >
                <span className="relative z-10">Open Invitation</span>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} />
              </button>
              
              <p className="mt-8 text-[#8e9299] font-serif italic">We invite you to celebrate our special day</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://picsum.photos/seed/couple/1920/1080" 
              className="w-full h-full object-cover opacity-30"
              alt="Wedding Couple"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fdfcf8]/0 via-[#fdfcf8]/50 to-[#fdfcf8]" />
          </div>
          
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heart className="mx-auto text-[#5a5a40] mb-6 animate-float" size={32} fill="currentColor" />
              <h2 className="text-5xl md:text-8xl font-serif text-[#2c2c2c] mb-6">Julian & Elena</h2>
              <p className="text-xl md:text-2xl font-serif italic text-[#5a5a40]">Save the Date</p>
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-[#2c2c2c]">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-[#5a5a40]" />
                  <span className="font-serif text-lg">Thursday, December 31, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-[#5a5a40]" />
                  <span className="font-serif text-lg">06:00 PM - Finish</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeading title="Counting Down" subtitle="To our forever" />
            <Countdown targetDate={weddingDate} />
          </div>
        </section>

        {/* Event Details */}
        <section className="py-24 bg-[#f5f5f0]">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeading title="The Celebration" subtitle="Where & When" />
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Wedding Ceremony */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[32px] shadow-sm text-center space-y-6"
              >
                <div className="w-16 h-16 bg-[#f5f5f0] rounded-full flex items-center justify-center mx-auto text-[#5a5a40]">
                  <Heart size={28} />
                </div>
                <h3 className="text-3xl font-serif">Wedding Ceremony</h3>
                <div className="space-y-2 text-[#4a4a4a]">
                  <p className="font-medium">St. Mary's Cathedral</p>
                  <p>123 Grace Avenue, San Francisco, CA</p>
                  <p className="italic">06:00 PM - 07:30 PM</p>
                </div>
                <button className="inline-flex items-center gap-2 text-[#5a5a40] font-serif italic hover:underline">
                  <MapPin size={16} /> View on Map
                </button>
              </motion.div>

              {/* Wedding Reception */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[32px] shadow-sm text-center space-y-6"
              >
                <div className="w-16 h-16 bg-[#f5f5f0] rounded-full flex items-center justify-center mx-auto text-[#5a5a40]">
                  <Music size={28} />
                </div>
                <h3 className="text-3xl font-serif">Wedding Reception</h3>
                <div className="space-y-2 text-[#4a4a4a]">
                  <p className="font-medium">The Grand Ballroom</p>
                  <p>456 Elegance Drive, San Francisco, CA</p>
                  <p className="italic">08:00 PM - Finish</p>
                </div>
                <button className="inline-flex items-center gap-2 text-[#5a5a40] font-serif italic hover:underline">
                  <MapPin size={16} /> View on Map
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeading title="Our Journey" subtitle="Moments captured before the big day" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-md group relative"
                >
                  <img 
                    src={`https://picsum.photos/seed/journey-${i}/800/800`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={`Gallery ${i}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <div className="bg-[#fdfcf8] p-8 md:p-16 rounded-[40px] border border-[#5a5a40]/10 shadow-2xl">
              <SectionHeading title="RSVP" subtitle="Will you join us?" />
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm uppercase tracking-widest text-[#8e9299] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-[#5a5a40]/10 focus:outline-none focus:ring-2 focus:ring-[#5a5a40]/20 transition-all font-serif"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm uppercase tracking-widest text-[#8e9299] ml-1">Number of Guests</label>
                    <select className="w-full px-6 py-4 rounded-2xl bg-white border border-[#5a5a40]/10 focus:outline-none focus:ring-2 focus:ring-[#5a5a40]/20 transition-all font-serif">
                      <option>1 Person</option>
                      <option>2 People</option>
                      <option>3 People</option>
                      <option>4 People</option>
                    </select>
                  </div>
                </div>
                <button className="w-full py-5 bg-[#2c2c2c] text-white rounded-2xl font-serif text-lg hover:bg-black transition-colors shadow-lg">
                  Send Confirmation
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 text-center border-t border-[#5a5a40]/10">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-serif text-[#2c2c2c] mb-6">Julian & Elena</h2>
            <p className="text-[#8e9299] font-serif italic mb-8">Thank you for being part of our story.</p>
            <div className="flex justify-center gap-6 text-[#5a5a40]">
              <Instagram size={24} />
              <Mail size={24} />
              <Phone size={24} />
            </div>
            <div className="mt-12 text-[10px] uppercase tracking-[0.2em] text-[#8e9299]">
              Made with Love &copy; 2026
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
