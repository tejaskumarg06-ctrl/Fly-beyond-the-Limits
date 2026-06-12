import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Plane, Compass, Wine, Car, Anchor, Shield, Clock, Sparkles, 
  Award, MapPin, Calendar, Users, Sliders, ChevronLeft, ChevronRight, 
  Menu, X, ArrowRight, Mail, Phone, ShieldCheck, Check, CheckCircle2,
  Lock, ArrowDown, HelpCircle, Instagram, Linkedin, MessageSquare, LogOut, ShieldAlert
} from 'lucide-react';

// Live custom components
import ParticleCanvas from './components/ParticleCanvas';
import WorldMap from './components/WorldMap';
import BookingForm from './components/BookingForm';
import MembershipTiers from './components/MembershipTiers';

// New luxury components
import LiveFlightTracker from './components/LiveFlightTracker';
import MembersLoginModal from './components/MembersLoginModal';
import AITripPlanner from './components/AITripPlanner';

// Structured static data & types
import { 
  FLEET_DATA, 
  DESTINATIONS_DATA, 
  SERVICES_DATA, 
  EMPTY_LEGS_DATA, 
  TESTIMONIALS_DATA,
  Aircraft,
  EmptyLeg
} from './data';

// Google-style staggered word animations for the hero headline
const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const heroWordVariants = {
  hidden: { 
    opacity: 0, 
    y: 35,
    filter: 'blur(8px)',
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // Google elegant fluid ease-out curve
    },
  },
};

export default function App() {
  // Navigation State Routing
  const [currentPage, setCurrentPage] = useState<'home' | 'fleet' | 'destinations' | 'services' | 'membership' | 'about-safety' | 'booking'>('home');

  // Newsletter Inline Registry
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  // Mobile navigation overlay trigger
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Header blur triggers
  const [isScrolled, setIsScrolled] = useState(false);

  // Members Login system states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    return localStorage.getItem('aerolux_member_name') || null;
  });

  // Cursor scaling effect states
  const [cursorScale, setCursorScale] = useState(1);

  // Filtering fleet categories
  const [activeFleetCategory, setActiveFleetCategory] = useState<'ALL' | 'ULTRA LONG RANGE' | 'LIGHT JET' | 'VIP AIRLINER'>('ALL');
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  // Pre-filled booking states
  const [selectedDestination, setSelectedDestination] = useState('');

  // Reposition countdown meters
  const [countdownMinutes, setCountdownMinutes] = useState(48);
  const [countdownSeconds, setCountdownSeconds] = useState(22);

  // Parallax parallax calculations
  const [scrollY, setScrollY] = useState(0);

  // Setup generic ticking countdowns and window scroll listeners
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const clockInterval = setInterval(() => {
      setCountdownSeconds(sec => {
        if (sec <= 0) {
          setCountdownMinutes(min => (min <= 0 ? 59 : min - 1));
          return 59;
        }
        return sec - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(clockInterval);
    };
  }, []);

  const handleSelectDestinationForBooking = (destinationName: string) => {
    setSelectedDestination(destinationName);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReserveEmptyLeg = (leg: EmptyLeg) => {
    const parts = leg.route.split(' → ');
    if (parts.length === 2) {
      setSelectedDestination(parts[1]);
    }
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter fleet based on category tabs
  const filteredFleet = FLEET_DATA.filter(plane => {
    if (activeFleetCategory === 'ALL') return true;
    if (activeFleetCategory === 'ULTRA LONG RANGE' && plane.category === 'ULTRA LONG RANGE') return true;
    if (activeFleetCategory === 'LIGHT JET' && plane.category === 'LIGHT JET') return true;
    if (activeFleetCategory === 'VIP AIRLINER' && plane.category === 'VIP AIRLINER') return true;
    return false;
  }).slice(0, 3); // Make it slightly compact to prevent token overflowing, showing top iconic jets

  const handleLoggedSuccess = (memberName: string) => {
    setLoggedInUser(memberName);
    localStorage.setItem('aerolux_member_name', memberName);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('aerolux_member_name');
  };

  return (
    <div className="relative min-h-screen bg-[#080608] text-[#F2EDE8] selection:bg-[#C9A84C] selection:text-[#080608] font-sans antialiased overflow-x-hidden">
      
      {/* Luxury aesthetic film grain filter */}
      <div className="luxury-grain" />

      {/* 1. PREMIUM HEADER NAVIGATION */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b-[0.5px] ${
          isScrolled 
            ? 'bg-[#080608]/95 backdrop-blur-md border-[#C9A84C]/25 py-3.5 shadow-25' 
            : 'bg-transparent border-[#C9A84C]/10 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo Brand Title */}
          <button 
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-accent tracking-[0.25em] text-[#C9A84C] text-lg flex items-center gap-2 select-none cursor-pointer border-none bg-transparent hover:scale-105 transition-transform"
          >
            <Plane className="w-5 h-5 text-[#C9A84C] rotate-45 filter drop-shadow-[0_0_4px_rgba(0,178,255,0.4)]" />
            
            {/* Elegant Thunder Spark icon inline overlay */}
            <span className="relative flex items-center gap-1.5">
              <span className="font-extrabold text-[#C9A84C] tracking-[0.3em] animate-thunder">AEROLUX</span>
              <svg 
                className="w-3.5 h-3.5 text-[#00B2FF] animate-thunder filter drop-shadow-[0_0_8px_rgba(0,178,255,1)] ml-[-0.2em]"
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19 11h-6V3a1 1 0 0 0-1.895-.448l-8 14A1 1 0 0 0 4 18h6v6a1 1 0 0 0 1.895.448l8-14A1 1 0 0 0 19 11z" />
              </svg>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-accent text-[11px] tracking-[0.2em] uppercase text-[#F2EDE8]/85">
            <button 
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none ${currentPage === 'home' ? 'text-[#C9A84C] font-semibold' : 'text-[#F2EDE8]/85'}`}
            >
              HOME
            </button>
            <button 
              onClick={() => { setCurrentPage('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none ${currentPage === 'fleet' ? 'text-[#C9A84C]' : 'text-[#F2EDE8]/85'}`}
            >
              FLEET
            </button>
            <button 
              onClick={() => { setCurrentPage('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none ${currentPage === 'destinations' ? 'text-[#C9A84C]' : 'text-[#F2EDE8]/85'}`}
            >
              DESTINATIONS
            </button>
            <button 
              onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none ${currentPage === 'services' ? 'text-[#C9A84C]' : 'text-[#F2EDE8]/85'}`}
            >
              SERVICES
            </button>
            <button 
              onClick={() => { setCurrentPage('membership'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none ${currentPage === 'membership' ? 'text-[#C9A84C]' : 'text-[#F2EDE8]/85'}`}
            >
              MEMBERSHIP
            </button>
            <button 
              onClick={() => { setCurrentPage('about-safety'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-[#C9A84C] transition-colors cursor-pointer bg-transparent border-none ${currentPage === 'about-safety' ? 'text-[#C9A84C]' : 'text-[#F2EDE8]/85'}`}
            >
              LIAISON & SAFETY
            </button>
          </nav>

          {/* Action CTAs in Header */}
          <div className="flex items-center gap-4">
            
            {/* VIP Member Area Liaison Button */}
            {loggedInUser ? (
              <div className="flex items-center gap-3 bg-gold-primary/5 border border-[#C9A84C]/30 px-3.5 py-1.5 rounded-lg select-none">
                <div className="flex flex-col text-right">
                  <span className="text-[8.5px] font-mono text-gold-light uppercase tracking-wider">SECRET LEVEL ACTIVE</span>
                  <span className="text-[10px] font-accent text-warm-white italic truncate max-w-[120px]">{loggedInUser}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-rose-400 p-1 rounded-full transition-colors cursor-pointer"
                  title="Disconnect security"
                  id="vip-log-off-button"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="google-smart-button font-accent text-[10px] tracking-[0.2em] uppercase text-[#E8C97A] px-5 py-2.5 transition-all flex items-center gap-2 cursor-pointer"
                id="vip-suite-trigger-button"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-gold-primary animate-pulse" />
                  <span>VIP Suite</span>
                </div>
              </button>
            )}

            {/* Book A Flight CTA */}
            <button 
              onClick={() => { setCurrentPage('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hidden md:block google-oval-btn px-6 py-2.5 font-accent text-[10.5px] tracking-[0.2em] uppercase"
            >
              Book Fleet
            </button>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#C9A84C] hover:text-[#E8C97A] focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[68px] w-full h-[calc(100vh-68px)] bg-[#080608]/98 backdrop-blur-xl z-40 flex flex-col justify-between py-10 px-8 border-t border-[#C9A84C]/10 animate-fade-in lg:hidden">
            <nav className="flex flex-col gap-6 text-center text-lg font-accent tracking-[0.15em] text-[#E8C97A]">
              {(['home', 'fleet', 'destinations', 'services', 'membership', 'about-safety'] as const).map(p => (
                <button 
                  key={p}
                  onClick={() => { setCurrentPage(p); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold-light transition-colors py-1.5 border-b border-gold-muted/10 font-bold block text-left w-full uppercase"
                >
                  {p === 'about-safety' ? 'Liaison & Safety' : p}
                </button>
              ))}
            </nav>

            <div className="flex flex-col gap-4 text-center">
              <button 
                onClick={() => { setCurrentPage('booking'); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="google-oval-btn-filled text-black py-4 font-accent font-bold tracking-widest text-[11px] uppercase cursor-pointer"
              >
                Plan Private Charter
              </button>
              <span className="text-[10px] font-mono text-muted-gray uppercase font-bold">Global Ops Desk: +1 (800) AEROLUX</span>
            </div>
          </div>
        )}
      </header>

      {/* 2. CHOOSE RENDER PAGE VIA ROUTING STATE */}
      {currentPage === 'home' && (
        <>
          {/* A. LUXURIOUS FULLSCREEN VIDEO HERO SECTION */}
          <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden animate-fade-in">
            {/* Cinematic background video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-glorious-clouds-at-sunset-31713-large.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-35 filter brightness-50 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#080608]/85 to-[#080608]" />
            </div>

            {/* Sparkle and star overlay */}
            <ParticleCanvas />

            <div className="relative max-w-5xl mx-auto px-6 text-center z-10 space-y-8 pt-24 md:pt-32">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="h-[0.5px] w-12 bg-[#00B2FF]" />
                <span className="font-accent text-[10px] tracking-[0.45em] text-[#00B2FF] uppercase font-bold">The Pinnacle of Aviation</span>
                <div className="h-[0.5px] w-12 bg-[#00B2FF]" />
              </div>

              {/* STUNNING FLIGHT TRAJECTORY PATH & HEADING VECTOR */}
              <div className="relative inline-block py-6 w-full select-none">
                <div className="absolute inset-0 pointer-events-none overflow-visible z-0 flex items-center justify-center">
                  <svg viewBox="0 0 800 300" className="w-[110%] h-[110%] absolute -top-8" fill="none">
                    {/* Tech blue-peach flight trajectory path route */}
                    <path
                      d="M 50,190 Q 400,-25 750,190"
                      stroke="url(#hero-blue-gradient)"
                      strokeWidth="1.25"
                      strokeDasharray="6 6"
                      className="opacity-35"
                    />
                    
                    {/* Sparkling sweeping trailing line */}
                    <path
                      d="M 50,190 Q 400,-25 750,190"
                      stroke="#00B2FF"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      className="animate-draw-path opacity-80 filter blur-[0.5px]"
                    />

                    {/* Infinite Glide of the airplane along the trajectory path */}
                    <g className="animate-plane-glide" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                      {/* Pulse circle around jet */}
                      <circle cx="0" cy="0" r="15" className="fill-[#00B2FF]/20 stroke-[#FFD0B4]/45 stroke-[0.5] animate-ping" />
                      
                      {/* Luxury Vector icon plane silhouette pointing along trajectory */}
                      <path 
                        d="M0,-14 L4,-6 L15,-4 L4,0 L5,9 L0,6 L-5,9 L-4,0 L-15,-4 L-4,-6 Z" 
                        fill="#F0F4F8" 
                        stroke="#00B2FF"
                        strokeWidth="0.5"
                        className="scale-[1.2] rotate-90"
                      />
                    </g>

                    <defs>
                      <linearGradient id="hero-blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#005F99" stopOpacity="0" />
                        <stop offset="25%" stopColor="#00B2FF" stopOpacity="1" />
                        <stop offset="75%" stopColor="#FFD0B4" stopOpacity="1" />
                        <stop offset="100%" stopColor="#005F99" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <motion.h1 
                  variants={heroContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="font-display text-5xl sm:text-7xl md:text-[8rem] leading-[0.85] italic font-light tracking-tight relative z-10 text-warm-white flex flex-col items-center justify-center"
                >
                  <span className="flex flex-row justify-center gap-x-4 md:gap-x-6 flex-wrap">
                    <motion.span variants={heroWordVariants} className="inline-block">Fly</motion.span>
                    <motion.span variants={heroWordVariants} className="inline-block">Beyond</motion.span>
                  </span>
                  <span className="flex flex-row justify-center gap-x-4 md:gap-x-6 flex-wrap mt-2 md:mt-4">
                    <motion.span 
                      variants={heroWordVariants} 
                      className="animate-text-gradient font-accent font-bold not-italic tracking-wide text-2xl sm:text-4xl md:text-[6.5rem] inline-block"
                    >
                      the
                    </motion.span>
                    <motion.span 
                      variants={heroWordVariants} 
                      className="animate-text-gradient font-accent font-bold not-italic tracking-wide text-2xl sm:text-4xl md:text-[6.5rem] inline-block"
                    >
                      Limits.
                    </motion.span>
                  </span>
                </motion.h1>
              </div>

              <p className="max-w-xl mx-auto text-[#F2EDE8]/80 font-light text-base md:text-lg leading-relaxed font-body">
                Redefining the standards of private aviation. Fly entirely on your schedule, to over 5,000 global terminals, inside custom-personalized cabins.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
                {/* GOOGLE STYLE DYNAMIC GRADIENT ORBIT SMART BUTTON */}
                <button 
                  onClick={() => { setCurrentPage('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="google-smart-button text-warm-white font-accent text-xs tracking-widest uppercase font-bold shadow-2xl cursor-pointer text-center w-full sm:w-auto hover:-translate-y-0.5 transition-transform px-10 py-5.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold tracking-[0.25em]">Explore Transports</span>
                  </div>
                </button>

                <button 
                  onClick={() => { setCurrentPage('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="google-oval-btn-secondary px-10 py-5.5 font-accent text-xs tracking-widest uppercase text-warm-white hover:-translate-y-0.5 transition-transform w-full sm:w-auto"
                >
                  Coordinate Route
                </button>
              </div>

              {/* Scroll down mouse cue */}
              <button 
                onClick={() => {
                  const targetSection = document.getElementById('ops-skynet-tracker');
                  if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="pt-10 flex flex-col items-center gap-2 cursor-pointer pb-2 border-none bg-transparent mx-auto select-none group"
              >
                <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] group-hover:text-warm-white transition-colors uppercase">Live Ops Tracker</span>
                <div className="relative w-[1px] h-10 bg-[#C9A84C]/15 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-4 bg-[#C9A84C] animate-bounce rounded-full" />
                </div>
              </button>
            </div>
          </section>

          {/* ELITE HORIZONS - INTERACTIVE SQUIRCLE PORTFOLIO OF GLOBAL DESTINATIONS */}
          <section className="py-24 bg-surface-dark relative border-t border-[#00B2FF]/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-center text-center mb-16">
                <span className="font-accent text-[9px] tracking-[0.45em] text-[#FFD0B4] uppercase font-bold block mb-2">CURATED DESTINATIONS PORTFOLIO</span>
                <h3 className="font-display text-4xl sm:text-5xl text-warm-white italic font-light">Elite Horizons to Explore</h3>
                <p className="text-xs text-muted-gray max-w-lg mt-2 font-mono">Select a coordinates target. Click to lock cabin or coordinate route with your private command console.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "TOKYO",
                    location: "HND / RJTT",
                    description: "Experience absolute harmony between neon high-tech blue views and pristine historic gardens.",
                    image: "/src/assets/images/tokyo_destination_1781030762302.png",
                    stat: "SPEED MACH 0.90",
                    timezone: "GMT+9 Tokyo"
                  },
                  {
                    name: "DUBAI",
                    location: "DXB / OMDB",
                    description: "Soar past majestic sand dunes to step directly onto gold-peach beaches and state-of-the-art helipads.",
                    image: "/src/assets/images/dubai_destination_1781030780825.png",
                    stat: "ALTITUDE 41,000 FT",
                    timezone: "GMT+4 Dubai"
                  },
                  {
                    name: "NEW YORK",
                    location: "TEB / KTEB",
                    description: "Descend into the sparkling Manhattan skyline, landing at private executive FBO aviation hubs.",
                    image: "/src/assets/images/new_york_destination_1781030797784.png",
                    stat: "TRANSATLANTIC PATH",
                    timezone: "GMT-4 New York"
                  },
                  {
                    name: "VIETNAM",
                    location: "HAN / VVNB",
                    description: "Glide gracefully over Ha Long Bay's emerald waters and iconic dreamlike towering limestone karsts.",
                    image: "/src/assets/images/vietnam_destination_1781030814676.png",
                    stat: "PACIFIC ROUTE TARGETS",
                    timezone: "GMT+7 Hanoi"
                  },
                  {
                    name: "CALIFORNIA",
                    location: "VNY / KVNY",
                    description: "Relax under legendary gold-green palm trees as the Pacific sunset blazes onto your cabin windshield.",
                    image: "/src/assets/images/california_destination_1781030831705.png",
                    stat: "WEST COAST GLIDER",
                    timezone: "GMT-7 Los Angeles"
                  },
                  {
                    name: "LONDON",
                    location: "FAB / EGLF",
                    description: "Navigate smoothly above Tower Bridge and Thames River to arrive at royal executive FBO gates.",
                    image: "/src/assets/images/london_destination_1781030847876.png",
                    stat: "EUROPE LEVEL BEARING",
                    timezone: "GMT+1 London"
                  }
                ].map((dest, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedDestination(dest.name);
                      setCurrentPage('booking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="relative group cursor-pointer bg-[#0e0d16] p-4 rounded-[2.5rem] border border-[#00B2FF]/15 hover:border-[#FFD0B4]/60 hover:shadow-[0_12px_40px_rgba(0,178,255,0.18)] transition-all duration-700 ease-out flex flex-col justify-between overflow-hidden"
                  >
                    {/* Inner image container with matching squircle rounding */}
                    <div className="relative aspect-[4/3] rounded-[1.85rem] overflow-hidden bg-black mb-5">
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d16] via-transparent to-transparent opacity-80" />
                      
                      {/* Floating location tag */}
                      <span className="absolute top-4 right-4 bg-[#06050b]/80 backdrop-blur-md text-[#FFD0B4] border border-[#00B2FF]/30 font-mono text-[9px] tracking-widest px-3 py-1 rounded-full uppercase font-bold">
                        {dest.location}
                      </span>
                    </div>

                    <div className="px-2 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono text-[#00B2FF] tracking-wider uppercase font-bold">{dest.stat}</span>
                          <span className="text-[10px] font-mono text-muted-gray uppercase">{dest.timezone}</span>
                        </div>
                        <h4 className="font-display text-2xl text-warm-white font-medium group-hover:text-[#FFD0B4] transition-colors mb-2">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-muted-gray leading-relaxed font-body font-light">
                          {dest.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-mono text-[#00B2FF] group-hover:text-[#FFD0B4] transition-colors font-bold tracking-widest uppercase">
                          Coordinate Flight →
                        </span>
                        <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#FFD0B4]/40 flex items-center justify-center transition-all group-hover:bg-[#FFD0B4]/5">
                          <span className="text-xs text-[#00B2FF] group-hover:text-[#FFD0B4] font-bold">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* B. LIVE FLIGHT TRACKER SECTION */}
          <section id="ops-skynet-tracker" className="py-24 bg-[#0a080d] border-y border-[#C9A84C]/15">
            <div className="max-w-7xl mx-auto px-6">
              <LiveFlightTracker />
            </div>
          </section>

          {/* C. EMPTY LEG REPOSITIONINGS METERS */}
          <section className="py-20 bg-[#120f16] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                  <span className="font-accent tracking-widest text-[#E8C97A] text-[10px] uppercase font-bold block mb-1">CABIN REPOSITIONINGS</span>
                  <h3 className="font-display text-2xl md:text-3xl text-warm-white italic">Elite Member Reposition Logs</h3>
                  <p className="text-xs text-muted-gray font-light mt-1">Fly luxurious aircraft reposition courses at up to 75% pricing adjustments.</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#00B2FF] bg-black/40 px-3 py-1.5 rounded-full border border-[#00B2FF]/20">
                  <Clock className="w-4 h-4 text-[#00B2FF] animate-pulse" />
                  <span>REGISTRY FLASHES IN: {countdownMinutes}m {countdownSeconds}s</span>
                </div>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {EMPTY_LEGS_DATA.map(leg => (
                  <div key={leg.id} className="bg-[#100E12] border border-[#00B2FF]/15 p-6 rounded-[2.5rem] hover:border-[#FFD0B4]/50 transition-all duration-500 relative group hover:shadow-[0_15px_40px_rgba(0,178,255,0.15)] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3.5">
                        <span className="font-mono text-[9.5px] text-[#F0F4F8]/40 uppercase tracking-wider">{leg.aircraft}</span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-full uppercase font-bold">SAVE 70%</span>
                      </div>
 
                      <h5 className="font-display text-lg text-warm-white group-hover:text-[#FFD0B4] transition-colors font-medium">{leg.route}</h5>
                      <p className="text-[10px] font-mono text-[#00B2FF] mt-1 mb-4">{leg.time}</p>

                      {/* Dual 4K Terminal Squircle Box Showcase */}
                      {leg.depImg && leg.arrImg && (
                        <div className="grid grid-cols-2 gap-3.5 my-4">
                          {/* Departure Squircle Box */}
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group/dep border border-white/[0.04] bg-neutral-950 shadow">
                            <img 
                              src={leg.depImg} 
                              alt={leg.depCity} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover/dep:scale-110 filter brightness-90 group-hover/dep:brightness-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                            <div className="absolute bottom-2 left-3 flex flex-col">
                              <span className="text-[6.5px] font-mono text-[#FFD0B4] tracking-widest uppercase font-bold">ORIGIN</span>
                              <span className="text-[9.5px] font-bold font-accent text-warm-white truncate">{leg.depCity}</span>
                            </div>
                          </div>

                          {/* Arrival Squircle Box */}
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group/arr border border-white/[0.04] bg-neutral-950 shadow">
                            <img 
                              src={leg.arrImg} 
                              alt={leg.arrCity} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover/arr:scale-110 filter brightness-90 group-hover/arr:brightness-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                            <div className="absolute bottom-2 left-3 flex flex-col">
                              <span className="text-[6.5px] font-mono text-[#00B2FF] tracking-widest uppercase font-bold">DESTINATION</span>
                              <span className="text-[9.5px] font-bold font-accent text-warm-white truncate">{leg.arrCity}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
 
                    <div className="flex justify-between items-end pt-4 border-t border-[#F0F4F8]/10 mt-2">
                      <div>
                        <span className="text-[9px] font-mono text-[#F0F4F8]/45 uppercase line-through block">WAS {leg.originalPrice}</span>
                        <span className="font-mono text-lg font-bold text-[#00B2FF]" id="empty-leg-price">{leg.price}</span>
                      </div>
                      <button 
                        onClick={() => handleReserveEmptyLeg(leg)}
                        className="google-smart-button font-accent text-[9px] font-bold px-4.5 py-2.5 uppercase tracking-wider cursor-pointer"
                      >
                        <span className="relative z-10">Lock Cabin</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
 
          {/* D. DISCRIMINATING TESTIMONIALS */}
          <section className="py-24 bg-surface-dark relative">
            <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
              <div className="space-y-3">
                <span className="font-accent tracking-widest text-[#FFD0B4] text-xs uppercase font-bold block">VERIFIED LIAISON ADVOCACY</span>
                <h2 className="font-display text-4xl text-warm-white font-light italic">Reflections on AeroLux</h2>
                <div className="h-[0.5px] w-24 bg-[#00B2FF] mx-auto my-3" />
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS_DATA.map((t, idx) => (
                  <div key={idx} className="bg-black/35 border border-[#00B2FF]/10 p-6 rounded-3xl text-left space-y-4 shadow-sm hover:border-[#FFD0B4]/30 transition-all duration-300">
                    <p className="text-xs text-muted-gray leading-relaxed font-body italic">"{t.quote}"</p>
                    <div className="border-t border-[#00B2FF]/10 pt-3">
                      <h5 className="font-accent text-[11px] font-bold text-[#E8C97A] uppercase">{t.author}</h5>
                      <p className="text-[9px] font-mono text-muted-gray uppercase mt-0.5">{t.title} — {t.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 3. FLEET VIEW (Featuring Google-style responsive layout transition and Squircle Cards) */}
      {currentPage === 'fleet' && (
        <section id="fleet" className="py-24 max-w-7xl mx-auto px-6 pt-32 animate-fade-in select-none">
          <div className="text-center space-y-3 mb-12">
            <span className="font-accent tracking-widest text-[#FFD0B4] text-xs uppercase font-bold block bg-transparent">AeroLux Direct Network</span>
            <h2 className="font-display text-4xl md:text-5xl text-warm-white font-light italic">Bespoke Flagship Transports</h2>
            <div className="h-[0.5px] w-24 bg-[#00B2FF] mx-auto my-4" />
            <p className="text-xs md:text-sm text-warm-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              Hover over or tap individual squircle cabin targets to reveal state-of-the-art interior layouts, private suite specs, and high-altitude luxury features in real-time.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-12">
            {(['ALL', 'ULTRA LONG RANGE', 'LIGHT JET', 'VIP AIRLINER'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFleetCategory(cat)}
                className={`font-accent text-[10px] tracking-widest px-5 py-2.5 transition-all cursor-pointer ${
                  activeFleetCategory === cat 
                    ? 'google-oval-btn-filled text-[#0c0a0f] font-bold border-[#00B2FF]' 
                    : 'google-oval-btn text-muted-gray hover:text-warm-white bg-transparent border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Google-Style Animating Squircle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FLEET_DATA.filter(p => {
              if (activeFleetCategory === 'ALL') return true;
              return p.category === activeFleetCategory;
            }).map((plane) => (
              <div 
                key={plane.id}
                className="relative h-[500px] cursor-pointer group bg-gradient-to-b from-[#0e0d16] to-[#0a080d] border border-[#00B2FF]/15 hover:border-[#FFD0B4]/65 rounded-[2.5rem] p-4 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-500 hover:shadow-[0_15px_45px_rgba(0,178,255,0.18)]"
                onClick={() => setSelectedAircraft(plane)}
              >
                {/* FRONT VIEW: Picture and Stats */}
                <div className="flex flex-col justify-between h-full relative z-10">
                  <div className="space-y-4">
                    {/* Squircle Image container with overlay flag */}
                    <div className="relative h-48 rounded-[1.85rem] overflow-hidden bg-black border border-white/5 select-none shadow-inner">
                      <img 
                        src={plane.image} 
                        alt={plane.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-3.5 right-3.5 font-mono text-[9px] font-bold tracking-widest bg-[#06050b]/80 border border-[#00B2FF]/30 px-3 py-1 rounded-full text-[#FFD0B4] uppercase">
                        {plane.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline px-2">
                      <h4 className="font-display text-2xl text-warm-white tracking-tight">{plane.name}</h4>
                      <span className="font-mono text-xs font-bold text-[#00B2FF]">{plane.price}</span>
                    </div>
                  </div>

                  {/* Range and specs info block */}
                  <div className="grid grid-cols-3 gap-1 border-y border-[#00B2FF]/10 py-4 text-center font-mono text-[9.5px] px-1 bg-black/10 rounded-2xl">
                    <div>
                      <span className="text-muted-gray block uppercase text-[8px] tracking-wider">RANGE</span>
                      <span className="text-warm-white block font-medium mt-1 text-[11px]">{plane.specs.range}</span>
                    </div>
                    <div className="border-x border-[#00B2FF]/10">
                      <span className="text-muted-gray block uppercase text-[8px] tracking-wider">SEATS CAP</span>
                      <span className="text-warm-white block font-medium mt-1 text-[11px]">{plane.specs.passengers} pax</span>
                    </div>
                    <div>
                      <span className="text-muted-gray block uppercase text-[8px] tracking-wider">VELOCITY</span>
                      <span className="text-warm-white block font-medium mt-1 text-[11px]">{plane.specs.cruise}</span>
                    </div>
                  </div>

                  {/* Interactive hint footer */}
                  <div className="flex justify-between items-center text-[9px] font-accent text-[#00B2FF] px-2 py-1">
                    <span className="tracking-widest uppercase font-bold text-[8px] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#FFD0B4] animate-pulse" />
                      HOVER FOR CABIN INTERIOR
                    </span>
                    <span className="text-xs">→</span>
                  </div>
                </div>

                {/* REVERSE DRAWER LAYER: Google-style slide up with beautiful peachweb design */}
                <div className="absolute inset-0 bg-[#0e0d16]/98 p-6 flex flex-col justify-between translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 rounded-[2.5rem] border border-[#FFD0B4]/40">
                  <div className="space-y-4">
                    <div className="border-b border-[#00B2FF]/10 pb-3">
                      <span className="font-mono text-[9px] text-[#00B2FF] uppercase tracking-widest block font-bold">STATE-OF-THE-ART INTERIOR</span>
                      <h4 className="font-display text-2xl text-warm-white font-medium italic mt-0.5">{plane.name} Cabin</h4>
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-accent text-[9.5px] tracking-widest text-[#FFD0B4] block font-bold uppercase">Standard Cabin Configuration:</span>
                      <ul className="space-y-2 text-xs font-body">
                        {plane.features.map((feat, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-xs text-muted-gray">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FF] flex-shrink-0 mt-1.5" />
                            <p className="text-warm-white/85 leading-tight">{feat}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/50 border border-[#00B2FF]/10 p-2.5 rounded-full text-center font-mono text-[8px] text-muted-gray font-bold tracking-widest uppercase">
                      SOUND-ABSORB RATING: 22DBB ULTRA QUIET
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAircraft(plane);
                      }}
                      className="w-full google-oval-btn-filled text-[#06050b] font-accent text-[10px] font-bold tracking-widest uppercase py-3"
                    >
                      Launch detailed view
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Specs Details Modal Overlay */}
          {selectedAircraft && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex items-center justify-center p-4">
              <div className="bg-[#0e0d16] border border-[#00B2FF]/40 max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,178,255,0.25)]">
                <button 
                  onClick={() => setSelectedAircraft(null)}
                  className="absolute right-6 top-6 text-muted-gray hover:text-warm-white focus:outline-none cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest font-bold text-[#00B2FF] bg-[#00B2FF]/10 border border-[#00B2FF]/25 px-3 py-1 rounded-full uppercase inline-block mb-2">
                      {selectedAircraft.category}
                    </span>
                    <h3 className="font-display text-3xl text-warm-white font-light italic">{selectedAircraft.name} Details</h3>
                    <p className="text-xs text-[#FFD0B4] font-mono mt-1">Pricing benchmark: {selectedAircraft.price}</p>
                  </div>

                  <div className={`h-48 rounded-3xl bg-gradient-to-br ${selectedAircraft.gradient} flex items-center justify-center relative overflow-hidden border border-[#00B2FF]/10 shadow-inner`}>
                    <img 
                      src={selectedAircraft.image} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                    <p className="font-accent text-[10px] text-[#FFD0B4] tracking-widest uppercase z-10 font-bold bg-[#0c0a0f]/80 px-4 py-2 rounded-full border border-[#00B2FF]/30">
                      FAA Part 135 Compliant Cabin
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-y border-[#00B2FF]/15 py-4 text-center font-mono text-[11px]">
                    <div>
                      <span className="text-muted-gray block">MAX RANGE</span>
                      <span className="text-warm-white font-semibold block mt-0.5">{selectedAircraft.specs.range}</span>
                    </div>
                    <div className="border-x border-[#00B2FF]/10">
                      <span className="text-muted-gray block">PASSENGER CAP</span>
                      <span className="text-warm-white font-semibold block mt-0.5">{selectedAircraft.specs.passengers} Seats</span>
                    </div>
                    <div>
                      <span className="text-muted-gray block">CRUISE MACH</span>
                      <span className="text-warm-white font-semibold block mt-0.5">{selectedAircraft.specs.cruise}</span>
                    </div>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-body">
                    {selectedAircraft.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-warm-white bg-white/5 p-2 rounded-2xl border border-white/[0.02]">
                        <span className="text-[#00B2FF] font-bold">✓</span>
                        <span className="text-muted-gray">{feat}</span>
                      </li>
                    ))}
                    <li className="flex gap-2.5 items-start text-warm-white bg-white/5 p-2 rounded-2xl border border-white/[0.02]">
                      <span className="text-[#00B2FF] font-bold">✓</span>
                      <span className="text-muted-gray">Certified private FBO access lounges</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      setSelectedAircraft(null);
                      setCurrentPage('booking');
                    }}
                    className="w-full google-oval-btn-filled text-[#0c0a0f] py-3.5 font-accent text-xs font-bold tracking-widest uppercase mt-4 block text-center"
                  >
                    Select airplane category for reservation
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. DESTINATIONS SECTION */}
      {currentPage === 'destinations' && (
        <section id="destinations" className="py-24 bg-surface-dark relative pt-32 animate-fade-in select-none">
          <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-center border-b border-[#C9A84C]/20 pb-4">
            <span className="font-accent text-[9.5px] tracking-[0.3em] text-[#C9A84C] font-bold">TERMINAL NETWORK: RUNWAY TARGETS</span>
            <button 
              onClick={() => setCurrentPage('home')}
              className="font-accent text-[10px] google-oval-btn px-5 py-2 uppercase bg-transparent"
            >
              ← Base Operations
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="font-accent tracking-widest text-[#E8C97A] text-xs uppercase font-bold block">Where Shall You Go?</span>
              <h2 className="font-display text-4xl md:text-5xl text-warm-white italic font-light">Explore Curated Terminals</h2>
              <div className="h-[0.5px] w-24 bg-[#C9A84C] mx-auto my-3" />
            </div>

            <WorldMap 
              destinations={DESTINATIONS_DATA} 
              onSelectDestination={handleSelectDestinationForBooking} 
            />
          </div>
        </section>
      )}

      {/* 5. SERVICES SECTION */}
      {currentPage === 'services' && (
        <section id="services" className="py-24 max-w-7xl mx-auto px-6 space-y-16 pt-32 animate-fade-in select-none">
          <div className="flex justify-between items-center border-b border-[#C9A84C]/25 pb-4 mb-4">
            <span className="font-accent text-[10px] tracking-[0.3em] text-[#C9A84C] font-bold">SIGNATURE CABIN ENVELOPE</span>
            <button 
              onClick={() => setCurrentPage('home')}
              className="font-accent text-[10px] google-oval-btn px-5 py-2 uppercase bg-transparent"
            >
              ← Base Operations
            </button>
          </div>

          <div className="text-center space-y-3">
            <span className="font-accent tracking-widest text-[#E8C97A] text-xs uppercase font-bold block">BEYOND HIGH ELEVATION</span>
            <h2 className="font-display text-4xl text-warm-white font-light italic">Amenities on Demand</h2>
            <div className="h-[0.5px] w-24 bg-gold-primary mx-auto my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8" id="features-amenities-grid">
            {SERVICES_DATA.map((srv, idx) => {
              // Custom asset mapper for elite services background
              const serviceMedia = {
                concierge: {
                  type: 'image',
                  src: '/src/assets/images/concierge_planning_ultra_luxury_1781111602777.png'
                },
                inflight: {
                  type: 'image',
                  src: '/src/assets/images/inflight_luxury_private_jet_1781111626057.png'
                },
                ground: {
                  type: 'video',
                  src: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-mountain-road-34440-large.mp4'
                },
                villas: {
                  type: 'image',
                  src: '/src/assets/images/yacht_villa_pairing_luxury_1781111654324.png'
                }
              }[srv.id] || { type: 'image', src: '' };

              return (
                <div 
                  key={srv.id} 
                  onClick={() => setCurrentPage('booking')}
                  className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-[#00B2FF]/20 hover:border-[#FFD0B4] bg-[#0c0a0f] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,178,255,0.3)] h-[440px] md:h-[490px] flex flex-col justify-between"
                >
                  {/* Media background layer - either 4K photo or muted cinematic loop video */}
                  <div className="absolute inset-0 select-none overflow-hidden rounded-[2.5rem] z-0">
                    {serviceMedia.type === 'video' ? (
                      <video
                        src={serviceMedia.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.5] group-hover:brightness-[0.7] contrast-[1.1] saturate-[1.2] pointer-events-none"
                      />
                    ) : (
                      <img 
                        src={serviceMedia.src} 
                        alt={srv.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.5] group-hover:brightness-[0.7] contrast-[1.1] saturate-[1.2] pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {/* Cinematic dimming overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60" />
                  </div>

                  {/* Relative content layer */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Badge and action row at top */}
                    <div className="flex justify-between items-center">
                      <div className="w-12 h-12 bg-black/60 backdrop-blur-md border border-[#00B2FF]/20 flex items-center justify-center text-[#00B2FF] group-hover:text-[#FFD0B4] rounded-2xl shadow transition-colors">
                        {srv.icon === 'Compass' && <Compass className="w-5 h-5" />}
                        {srv.icon === 'Wine' && <Wine className="w-5 h-5" />}
                        {srv.icon === 'Car' && <Car className="w-5 h-5" />}
                        {srv.icon === 'Anchor' && <Anchor className="w-5 h-5" />}
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-[#FFD0B4] font-black bg-black/75 border border-[#FFD0B4]/40 px-3.5 py-1 rounded-full uppercase shadow">
                        Elite Service
                      </span>
                    </div>

                    {/* Bottom layout area: descriptive words and action row shifted together downwards */}
                    <div className="space-y-4 pt-16">
                      <div className="space-y-2">
                        <h4 className="font-display text-3xl text-warm-white group-hover:text-[#FFD0B4] transition-colors italic font-light drop-shadow">
                          {srv.title}
                        </h4>
                        <p className="text-xs md:text-sm text-neutral-200 font-light leading-relaxed drop-shadow bg-black/30 p-3 rounded-2xl backdrop-blur-2xs border border-white/[0.03]">
                          {srv.description}
                        </p>
                      </div>

                      {/* Bottom Action bar featuring Google style Button */}
                      <div className="pt-4 border-t border-[#00B2FF]/20 flex items-center justify-between text-xs font-accent text-[#00B2FF] group-hover:text-[#FFD0B4] transition-colors">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage('booking');
                          }}
                          className="text-[10px] font-mono tracking-widest uppercase font-black text-black bg-[#FFD0B4] border border-[#FFD0B4] px-5 py-3 rounded-full hover:bg-white hover:border-white group-hover:bg-[#FFD0B4] group-hover:text-black transition-all shadow-lg shadow-[#00B2FF]/15 cursor-pointer"
                        >
                          Configure Service Spec
                        </button>
                        <span className="transform translate-x-0 group-hover:translate-x-2.5 transition-transform font-bold text-xl text-[#FFD0B4]">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. MEMBERSHIP CLUB SECTION */}
      {currentPage === 'membership' && (
        <section id="membership" className="py-24 max-w-7xl mx-auto px-6 pt-32 animate-fade-in select-none">
          <div className="text-center space-y-3 mb-10">
            <span className="font-accent tracking-widest text-[#C9A84C] text-xs uppercase font-bold block">CONFIDENTIAL REGISTRY</span>
            <h2 className="font-display text-4xl md:text-5xl text-warm-white font-light italic">The Private Clubs</h2>
            <div className="h-[0.5px] w-24 bg-[#C9A84C] mx-auto my-3" />
          </div>

          <MembershipTiers />
        </section>
      )}

      {/* 7. LIAISON SAFETY SECTION */}
      {currentPage === 'about-safety' && (
        <section id="safety" className="py-24 max-w-5xl mx-auto px-6 pt-32 space-y-16 animate-fade-in select-none">
          <div className="text-center space-y-3">
            <span className="font-accent tracking-widest text-[#E8C97A] text-xs uppercase font-bold block">SAFETY COMPLIANCES</span>
            <h2 className="font-display text-4xl text-warm-white font-light italic">FAA Part 135 & ARGUS Platinum</h2>
            <div className="h-[0.5px] w-24 bg-gold-primary mx-auto my-3" />
            <p className="text-xs text-muted-gray max-w-xl mx-auto">
              AeroLux operates to high standards of audit. Our direct aviation liaison monitors aircraft operators with precision.
            </p>
          </div>

          {/* Square Circle box (Squircle) featuring the luxury flight radar video */}
          <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-[2.5rem] border border-[#00B2FF]/20 hover:border-[#FFD0B4]/65 bg-[#0c0a0f] p-8 md:p-12 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,178,255,0.25)] flex flex-col justify-end group h-[380px] md:h-[460px] shadow-lg">
            {/* Background looping flight security video */}
            <div className="absolute inset-0 select-none overflow-hidden rounded-[2.5rem] z-0">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-commercial-airplane-flying-above-clouds-at-sunset-34320-large.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105 filter brightness-[0.4] group-hover:brightness-[0.55] contrast-[1.1] saturate-[1.2] pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080608] via-black/30 to-black/50" />
            </div>

            {/* Content overlaid on squircle video box - pushed to the bottom of the box as requested */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Badges/Icons Row */}
              <div className="flex justify-between items-center">
                <div className="w-11 h-11 bg-black/60 backdrop-blur-md border border-[#00B2FF]/20 flex items-center justify-center text-[#00B2FF] group-hover:text-[#FFD0B4] rounded-2xl shadow transition-colors">
                  <Award className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-[#FFD0B4] font-black bg-black/75 border border-[#FFD0B4]/30 px-3.5 py-1 rounded-full uppercase shadow">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  Live Safety Connection
                </div>
              </div>

              {/* Title and descriptions pushed to the bottom of the box */}
              <div className="space-y-4 pt-16">
                <div className="space-y-2">
                  <h4 className="font-display text-2xl md:text-3xl text-warm-white group-hover:text-[#FFD0B4] transition-colors italic font-light drop-shadow">
                    Liaison & Fleet Integrity
                  </h4>
                  <p className="text-xs md:text-sm text-[#F0F4F8]/80 font-light leading-relaxed drop-shadow bg-black/40 p-4 rounded-3xl backdrop-blur-2xs border border-white/[0.03]">
                    Under our elite protection protocols, every aircraft is cross-verified across major safety audits. Real-time flight dispatch monitors and safety telemetry handle FAA Part 135 operators with 100% precision.
                  </p>
                </div>

                {/* Bottom Action bar featuring Google style Button */}
                <div className="pt-3 border-t border-[#00B2FF]/20 flex items-center justify-between text-xs font-accent text-[#00B2FF] group-hover:text-[#FFD0B4] transition-colors">
                  <button 
                    className="google-smart-button font-accent text-[10px] tracking-[0.15em] uppercase text-[#E8C97A] px-6 py-3 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00B2FF]/10 hover:shadow-[#00B2FF]/20"
                  >
                    <span className="relative z-10 flex items-center gap-1.5 font-bold">
                      Launch FAA Radar Verify <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform font-bold text-xl text-[#FFD0B4]">→</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#121015]/60 backdrop-blur-xs border border-gold-muted/10 p-5 rounded-2xl text-center space-y-2 hover:border-[#00B2FF]/30 transition-all duration-300">
              <Award className="w-8 h-8 text-[#00B2FF] mx-auto" />
              <h5 className="font-accent text-[11px] font-bold text-warm-white uppercase">ARGUS Platinum</h5>
              <p className="text-[8.5px] font-mono text-muted-gray uppercase mt-0.5">Safety Index Standard</p>
            </div>
            <div className="bg-[#121015]/60 backdrop-blur-xs border border-gold-muted/10 p-5 rounded-2xl text-center space-y-2 hover:border-[#00B2FF]/30 transition-all duration-300">
              <ShieldCheck className="w-8 h-8 text-[#00B2FF] mx-auto" />
              <h5 className="font-accent text-[11px] font-bold text-warm-white uppercase">Wyvern Wingman</h5>
              <p className="text-[8.5px] font-mono text-muted-gray uppercase mt-0.5">Audited Flight Dispatch</p>
            </div>
            <div className="bg-[#121015]/60 backdrop-blur-xs border border-gold-muted/10 p-5 rounded-2xl text-center space-y-2 hover:border-[#00B2FF]/30 transition-all duration-300">
              <Compass className="w-8 h-8 text-[#00B2FF] mx-auto" />
              <h5 className="font-accent text-[11px] font-bold text-warm-white uppercase">IS-BAO Stage 3</h5>
              <p className="text-[8.5px] font-mono text-muted-gray uppercase mt-0.5">International Rules</p>
            </div>
            <div className="bg-[#121015]/60 backdrop-blur-xs border border-gold-muted/10 p-5 rounded-2xl text-center space-y-2 hover:border-[#00B2FF]/30 transition-all duration-300">
              <Shield className="w-8 h-8 text-[#00B2FF] mx-auto" />
              <h5 className="font-accent text-[11px] font-bold text-warm-white uppercase">FAA PART 135</h5>
              <p className="text-[8.5px] font-mono text-muted-gray uppercase mt-0.5">Air Charter Compliant</p>
            </div>
          </div>

          <div className="bg-neutral-900/40 p-6 rounded-2xl text-center border border-white/5 space-y-2 max-w-xl mx-auto">
            <span className="font-mono text-rose-400 text-[10px] flex items-center justify-center gap-1">
              <ShieldAlert className="w-4 h-4" /> COMPLIANCE DISCLOSURE
            </span>
            <p className="font-mono text-[9px] text-muted-gray leading-relaxed text-center uppercase">
              AeroLux operates strictly as an air charter advisor. We handle administrative contracts on behalf of registered members. Flight services are mapped directly across fully airworthy certified FAA Part 135 operators.
            </p>
          </div>
        </section>
      )}

      {/* 8. ACTIVE CHARTER BOOKING PLANNER */}
      {currentPage === 'booking' && (
        <section id="booking" className="py-24 max-w-4xl mx-auto px-6 pt-32 animate-fade-in select-none">
          <div className="text-center space-y-3 mb-10">
            <span className="font-accent tracking-widest text-[#FFD0B4] text-xs uppercase font-bold block">CONFIDENTIAL PORT</span>
            <h2 className="font-display text-4xl text-warm-white font-light italic">Draft Charter Route</h2>
            <div className="h-[0.5px] w-24 bg-[#00B2FF] mx-auto my-3" />
          </div>

          <div className="bg-[#0e0d16] border border-[#00B2FF]/20 p-6 md:p-10 shadow-3xl relative rounded-[2.5rem]">
            <BookingForm initialDestination={selectedDestination} />
          </div>
        </section>
      )}

      {/* 9. VIP EXECUTIVE NEWSLETTER */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="bg-[#0e0d16] border border-[#00B2FF]/20 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00B2FF]/5 via-transparent to-[#FFD0B4]/5 pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <span className="font-accent tracking-widest text-[#FFD0B4] text-xs uppercase font-bold block">Fly First. Know First.</span>
            <h2 className="font-accent text-3xl md:text-5xl font-extrabold uppercase text-center tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00B2FF] via-[#FFD0B4] to-[#00B2FF] filter drop-shadow-[0_0_15px_rgba(0,178,255,0.9)] select-none animate-pulse">
              JOIN THE INNER CIRCLE
            </h2>
            <p className="text-xs md:text-sm text-muted-gray max-w-lg mx-auto leading-relaxed">
              Register your professional credentials to receive reposition availability listings, empty leg deal logs, and private club opportunities.
            </p>
          </div>

          {isNewsletterSubscribed ? (
            <div className="max-w-sm mx-auto p-5 bg-[#00B2FF]/5 border border-[#00B2FF]/30 rounded-2xl text-center space-y-2 animate-fade-in">
              <span className="font-accent tracking-widest text-xs text-[#FFD0B4] uppercase font-bold block">Clearance request logged</span>
              <p className="text-xs text-warm-white/90 font-light font-body">A verified liaison will dispatch verification credentials to your registered address.</p>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setIsNewsletterSubscribed(true); }}
              className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 relative z-10 animate-fade-in"
            >
              <input
                type="email"
                required
                placeholder="ENTER BUSINESS EMAIL"
                className="flex-1 bg-black/60 border border-[#00B2FF]/20 focus:border-[#00B2FF] rounded-full px-5 py-3.5 text-xs font-mono tracking-widest text-[#FFD0B4] uppercase focus:outline-none placeholder-muted-gray/50 text-center sm:text-left text-warm-white"
              />
              <button
                type="submit"
                className="google-oval-btn-filled text-[#0c0a0f] text-xs font-accent font-bold tracking-widest py-3 px-6 uppercase whitespace-nowrap"
              >
                Log Registry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 10. ELITE LIAISON FOOTER */}
      <footer className="bg-[#040304] border-t border-gold-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-[#C9A84C]/10 pb-8">
          
          <div className="space-y-4">
            <button 
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="font-accent tracking-[0.25em] text-[#C9A84C] text-[15px] flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
            >
              <Plane className="w-4 h-4 text-[#C9A84C] rotate-45" />
              <span>AEROLUX</span>
            </button>
            <p className="font-display italic text-muted-gray text-xs font-light max-w-xs">
              "Fly Beyond Ordinary"
            </p>
          </div>

          <div className="space-y-3.5">
            <span className="text-[10px] font-accent tracking-widest text-[#E8C97A] uppercase font-bold block">Company Spec</span>
            <ul className="space-y-2 text-xs font-mono text-muted-gray">
              <li><button onClick={() => { setCurrentPage('about-safety'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold-light transition-colors bg-transparent border-none p-0 cursor-pointer text-left">The Story</button></li>
              <li><button onClick={() => { setCurrentPage('about-safety'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold-light transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Safety Metrics</button></li>
              <li><button onClick={() => { setCurrentPage('membership'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold-light transition-colors bg-transparent border-none p-0 cursor-pointer text-left">The Private Clubs</button></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <span className="text-[10px] font-accent tracking-widest text-[#E8C97A] uppercase font-bold block">Destinations</span>
            <ul className="space-y-2 text-xs font-mono text-muted-gray">
              <li><button onClick={() => { setCurrentPage('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold-light transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Maldives Retreats</button></li>
              <li><button onClick={() => { setCurrentPage('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold-light transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Aspen Snow Slopes</button></li>
              <li><button onClick={() => { setCurrentPage('destinations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gold-light transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Monaco Marina Hub</button></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <span className="text-[10px] font-accent tracking-widest text-[#E8C97A] uppercase font-bold block">AeroLux Support</span>
            <div className="space-y-1 font-mono text-[10.5px] text-muted-gray">
              <p className="text-warm-white">+1 (800) AEROLUX</p>
              <p>24/7 Monitored Liaison</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 text-[10px] font-mono text-neutral-600 flex justify-between items-center flex-wrap gap-4">
          <span>© 2026 AeroLux Aviation. All rights reserved. FAA Part 135 Compliant.</span>
          <span className="text-neutral-500 uppercase">Secure Encryption Active</span>
        </div>
      </footer>

      {/* 11. EXTRA FLOATING WIDGETS */}
      
      {/* 24/7 AI VIP Travel Guide chatbot */}
      <AITripPlanner />

      {/* Obsidian Member Access Modal */}
      <MembersLoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoggedSuccess} 
      />

    </div>
  );
}
