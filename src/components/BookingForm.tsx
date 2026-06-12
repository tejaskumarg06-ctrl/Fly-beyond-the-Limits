import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, Calendar, Users, Sliders, CheckCircle2, ChevronRight, 
  Search, ShieldCheck, Heart, Award, ArrowLeft, ArrowRight, 
  Eye, EyeOff, MapPin, Sparkles, AlertCircle, Info, Star, 
  CreditCard, Plus, Minus, Tag, Zap, Smartphone, Check, HelpCircle, ShieldAlert
} from 'lucide-react';
import { 
  POPULAR_AIRPORTS, 
  FLIGHT_RESULTS_DATA, 
  HOTEL_DATABASE,
  AirportOption,
  FlightResult,
  Hotel
} from '../data';

interface BookingFormProps {
  initialDestination?: string;
  onBookingConfirmed?: (details: any) => void;
}

export default function BookingForm({ initialDestination = '', onBookingConfirmed }: BookingFormProps) {
  // General State
  const [activeTab, setActiveTab] = useState<'Flights' | 'Hotels' | 'Flight + Hotel' | 'Explore'>('Flights');
  const [bookingStage, setBookingStage] = useState<'search' | 'results' | 'checkout' | 'confirmation'>('search');
  
  // Search Form State
  const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Multi-City'>('One Way');
  const [fromCity, setFromCity] = useState('Mumbai (BOM)');
  const [fromCode, setFromCode] = useState('BOM');
  const [toCity, setToCity] = useState('Dubai (DXB)');
  const [toCode, setToCode] = useState('DXB');
  const [deptDate, setDeptDate] = useState('2026-12-15');
  const [retDate, setRetDate] = useState('2026-12-20');
  const [cabinClass, setCabinClass] = useState('Business');
  
  // Passengers Stepper Popup state
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  
  // Autocomplete dropdowns
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  // Advanced Filters State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [includeNearby, setIncludeNearby] = useState(false);
  const [maxStops, setMaxStops] = useState<string>('Any');
  const [preferredAirlines, setPreferredAirlines] = useState<string[]>([]);
  const [searchMaxPrice, setSearchMaxPrice] = useState<number>(3500);

  // Results State
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  
  // Results Filters state
  const [resultMaxPrice, setResultMaxPrice] = useState<number>(3000);
  const [resultStops, setResultStops] = useState<string>('All');
  const [resultTimeBlocks, setResultTimeBlocks] = useState<string[]>([]);
  const [resultAirlines, setResultAirlines] = useState<string[]>([]);
  const [resultAmenities, setResultAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest' | 'earliest'>('best');

  // Checkout Stage state (1: Passengers, 2: Seats, 3: Add-ons, 4: Payment, 5: Confirmed)
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [passengerDetails, setPassengerDetails] = useState({
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1988-06-11',
    nationality: 'United States',
    passportNumber: 'N41829631',
    passportExpiry: '2032-12-11',
    email: 'john.doe@aerolux.vip',
    phone: '+1 (555) 234-8902',
    sameForHotel: true
  });
  
  // Seats Selection Map (8 rows of A, B, C, D)
  const [selectedSeat, setSelectedSeat] = useState<string>('24A');
  const [hoveredSeatInfo, setHoveredSeatInfo] = useState<string | null>(null);
  const occupiedSeats = ['12B', '12C', '14A', '15D', '18B', '20C', '21A', '23C', '25A', '25D'];
  const legroomSeats = ['12A', '12D', '14A', '14B', '14C', '14D'];
  const preferredSeats = ['15A', '15B', '15C', '15D', '16A', '16D'];

  // Add-ons state
  const [flightBaggageLevel, setFlightBaggageLevel] = useState<string>('Standard'); // Standard (+0) or Extra (+35) or Elite (+55)
  const [travelInsurance, setTravelInsurance] = useState<boolean>(true); // Basic (+12) or Comp (+28)
  const [fastTrackSeq, setFastTrackSeq] = useState<boolean>(false); // (+15)
  const [vipLounge, setVipLounge] = useState<boolean>(true); // (+45)
  const [roomViewUpgrade, setRoomViewUpgrade] = useState<boolean>(false); // (+80/night)
  const [airportPrivateCar, setAirportPrivateCar] = useState<boolean>(true); // (+45 each way)
  const [earlyCheckIn, setEarlyCheckIn] = useState<boolean>(false); // (+30)
  const [breakfastPackage, setBreakfastPackage] = useState<boolean>(true); // (+25)
  const [desertSafariExcursion, setDesertSafariExcursion] = useState<boolean>(false); // (+85)

  // Payment Form States
  const [paymentCardNum, setPaymentCardNum] = useState('');
  const [paymentCardName, setPaymentCardName] = useState('JOHN DOE');
  const [paymentExpiry, setPaymentExpiry] = useState('12/30');
  const [paymentCVV, setPaymentCVV] = useState('');
  const [showCVV, setShowCVV] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple' | 'klarna'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Custom Countdown flash deal
  const [countdownHrs, setCountdownHrs] = useState(1);
  const [countdownMins, setCountdownMins] = useState(48);
  const [countdownSecs, setCountdownSecs] = useState(55);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdownSecs > 0) {
        setCountdownSecs(prev => prev - 1);
      } else if (countdownMins > 0) {
        setCountdownMins(prev => prev - 1);
        setCountdownSecs(59);
      } else if (countdownHrs > 0) {
        setCountdownHrs(prev => prev - 1);
        setCountdownMins(59);
        setCountdownSecs(59);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownSecs, countdownMins, countdownHrs]);

  // Sync destination state
  useEffect(() => {
    if (initialDestination) {
      setToCity(`${initialDestination} (${initialDestination.substring(0, 3).toUpperCase()})`);
      setToCode(initialDestination.substring(0, 3).toUpperCase());
    }
  }, [initialDestination]);

  // Autocomplete selecting helper
  const handleSelectFrom = (ap: AirportOption) => {
    setFromCity(`${ap.city} (${ap.code})`);
    setFromCode(ap.code);
    setShowFromDropdown(false);
  };

  const handleSelectTo = (ap: AirportOption) => {
    setToCity(`${ap.city} (${ap.code})`);
    setToCode(ap.code);
    setShowToDropdown(false);
  };

  // Swap From & To Airports
  const [isSwapped, setIsSwapped] = useState(false);
  const handleSwap = () => {
    setIsSwapped(prev => !prev);
    const tempCity = fromCity;
    const tempCode = fromCode;
    setFromCity(toCity);
    setFromCode(toCode);
    setToCity(tempCity);
    setToCode(tempCode);
  };

  // Passenger state summaries
  const totalPassengersCount = passengers.adults + passengers.children + passengers.infants;
  const passengerSummaryText = `${totalPassengersCount} Passenger${totalPassengersCount > 1 ? 's' : ''}`;

  // Reset helper
  const handleStartOver = () => {
    setBookingStage('search');
    setSelectedFlight(null);
    setSelectedHotel(null);
    setCheckoutStep(1);
    setIsProcessingPayment(false);
  };

  // Dynamic Hotel matching query
  const getHotelsForDestination = (): Hotel[] => {
    const data = HOTEL_DATABASE[toCode] || HOTEL_DATABASE['DXB'];
    return data.hotels;
  };

  // Total cost updates
  const getFlightPrice = () => {
    if (!selectedFlight) return 0;
    return selectedFlight.price * totalPassengersCount;
  };

  const getHotelNightsCost = () => {
    if (!selectedHotel) return 0;
    const base = selectedHotel.price * 5; // 5 nights as per spec
    let addons = 0;
    if (roomViewUpgrade) addons += 80 * 5;
    if (earlyCheckIn) addons += 30;
    if (breakfastPackage) addons += 25 * 5;
    if (desertSafariExcursion) addons += 85 * totalPassengersCount;
    return base + addons;
  };

  const getAddonFares = () => {
    let fares = 0;
    if (flightBaggageLevel === 'Extra') fares += 35;
    if (flightBaggageLevel === 'Elite') fares += 55;
    if (travelInsurance) fares += 28;
    if (fastTrackSeq) fares += 15;
    if (vipLounge) fares += 45;
    if (airportPrivateCar) fares += 90; // roundtrip (45 each way)
    return fares;
  };

  const getSubtotal = () => {
    return getFlightPrice() + getHotelNightsCost() + getAddonFares();
  };

  const getBundleSavings = () => {
    // Elegant savings if both are selected
    if (selectedFlight && selectedHotel) return 340;
    return 0;
  };

  const getFinalTotal = () => {
    const raw = getSubtotal() - getBundleSavings();
    const finalVal = promoApplied ? raw * 0.9 : raw;
    return Math.max(0, Math.round(finalVal * 1.12)); // 12% taxes included
  };

  // Step 4 mock submit
  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCheckoutStep(5);
    }, 1500);
  };

  return (
    <div className="w-full relative py-2 space-y-16">
      
      {/* 1. ARCHITECTURAL HEADER TABS */}
      {bookingStage === 'search' && (
        <div className="w-full flex justify-center mb-4">
          <div className="flex bg-black/60 border border-[#00B2FF]/15 p-1.5 rounded-full backdrop-blur-md shadow-inner gap-1">
            {(['Flights', 'Hotels', 'Flight + Hotel', 'Explore'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-xs font-accent tracking-widest uppercase font-bold cursor-pointer transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#00B2FF] to-[#005F99] text-white shadow-lg shadow-[#00B2FF]/20 border border-[#00B2FF]/30'
                    : 'text-muted-gray hover:text-warm-white bg-transparent border-transparent'
                }`}
              >
                {tab === 'Flights' && '✈ Flights'}
                {tab === 'Hotels' && '🏨 Hotels'}
                {tab === 'Flight + Hotel' && '📦 Flight + Hotel'}
                {tab === 'Explore' && '🗺 Explore'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. THE CHOSEN WIDGET STAGE */}
      {bookingStage === 'search' && (
        <div className="bg-[#0e0d16]/95 border border-[#00B2FF]/20 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl relative select-none">
          {/* Top Info line */}
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
            <div className="flex items-center gap-3">
              {(['One Way', 'Round Trip', 'Multi-City'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTripType(t)}
                  className={`text-[10px] font-accent font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all ${
                    tripType === t
                      ? 'border-[#00B2FF] text-[#00B2FF] bg-[#00B2FF]/5'
                      : 'border-white/5 text-muted-gray hover:text-warm-white bg-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-[#FFD0B4] font-mono tracking-wider flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              FAA Stage-4 Sourced Rates
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: FROM -> SWAP -> TO */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:items-end relative">
              {/* FROM ELEMENT */}
              <div className="relative">
                <label className="block text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase mb-2 font-bold flex items-center gap-1">
                  <Plane className="w-3 h-3 text-[#00B2FF] rotate-[225deg]" /> DEPARTING FROM
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromCity}
                    onFocus={() => { setShowFromDropdown(true); setShowToDropdown(false); }}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="City or Airport Code..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium text-warm-white placeholder-muted-gray focus:border-[#00B2FF] focus:outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#00B2FF] tracking-widest font-black uppercase">
                    {fromCode}
                  </span>
                </div>

                {/* Dropdown popup */}
                {showFromDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#0d0912] border border-[#00B2FF]/25 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto p-2">
                    <div className="p-2 border-b border-white/5 text-[9px] font-mono uppercase text-muted-gray tracking-wider">
                      Popular Global Gateways
                    </div>
                    {POPULAR_AIRPORTS.map(ap => (
                      <button
                        key={`from-${ap.code}`}
                        onClick={() => handleSelectFrom(ap)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="text-warm-white font-medium">{ap.city} <span className="text-muted-gray text-[10px]">({ap.airport})</span></span>
                        <span className="bg-[#00B2FF]/10 text-[#00B2FF] border border-[#00B2FF]/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">{ap.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SWAP CONTROLLER */}
              <div className="flex h-11 justify-center items-center md:mb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 border border-[#00B2FF]/20 hover:border-[#FFD0B4]/60 bg-black/60 rounded-full flex items-center justify-center text-[#00B2FF] transition-all duration-500 hover:rotate-180 transform"
                  title="Swap destination airports"
                >
                  ⇄
                </button>
              </div>

              {/* TO ELEMENT */}
              <div className="relative">
                <label className="block text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase mb-2 font-bold flex items-center gap-1">
                  <Plane className="w-3 h-3 text-[#00B2FF] rotate-[45deg]" /> FLYING TO
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={toCity}
                    onFocus={() => { setShowToDropdown(true); setShowFromDropdown(false); }}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Where are you flying?"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium text-warm-white placeholder-muted-gray focus:border-[#00B2FF] focus:outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#00B2FF] tracking-widest font-black uppercase">
                    {toCode}
                  </span>
                </div>

                {/* Dropdown popup */}
                {showToDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#0d0912] border border-[#00B2FF]/25 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto p-2">
                    <div className="p-2 border-b border-white/5 text-[9px] font-mono uppercase text-muted-gray tracking-wider">
                      Popular Global Gateways
                    </div>
                    {POPULAR_AIRPORTS.map(ap => (
                      <button
                        key={`to-${ap.code}`}
                        onClick={() => handleSelectTo(ap)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="text-warm-white font-medium">{ap.city} <span className="text-muted-gray text-[10px]">({ap.airport})</span></span>
                        <span className="bg-[#00B2FF]/10 text-[#00B2FF] border border-[#00B2FF]/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">{ap.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2: DEPT DATE | RETURN DATE | PASSENGERS | CABIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* DEPARTURE */}
              <div>
                <label className="block text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase mb-2 font-bold">
                  DEPARTURE
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={deptDate}
                    onChange={(e) => setDeptDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-warm-white focus:border-[#00B2FF] focus:outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* RETURN (Grays out if One Way) */}
              <div className={tripType === 'One Way' ? 'opacity-35 select-none' : ''}>
                <label className="block text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase mb-2 font-bold">
                  RETURN
                </label>
                <div className="relative">
                  <input
                    type="date"
                    disabled={tripType === 'One Way'}
                    value={retDate}
                    onChange={(e) => setRetDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-warm-white focus:border-[#00B2FF] focus:outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* PASSENGERS POPUP STEPPER */}
              <div className="relative">
                <label className="block text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase mb-2 font-bold">
                  PASSENGERS
                </label>
                <button
                  type="button"
                  onClick={() => setIsPassengerDropdownOpen(p => !p)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-warm-white text-left flex items-center justify-between hover:border-white/20 transition-all cursor-pointer"
                >
                  <span className="truncate">{passengerSummaryText}</span>
                  <Users className="w-4 h-4 text-[#00B2FF]" />
                </button>

                {isPassengerDropdownOpen && (
                  <div className="absolute right-0 left-0 mt-2 bg-[#0e0a13] border border-[#00B2FF]/25 p-4 rounded-2xl shadow-2xl z-50 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-warm-white font-bold">Adults</p>
                        <p className="text-[9px] text-muted-gray">Age 12+</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPassengers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                          className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-white text-xs">{passengers.adults}</span>
                        <button
                          type="button"
                          onClick={() => setPassengers(p => ({ ...p, adults: p.adults + 1 }))}
                          className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-warm-white font-bold">Children</p>
                        <p className="text-[9px] text-muted-gray">Age 2-11</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPassengers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                          className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-white text-xs">{passengers.children}</span>
                        <button
                          type="button"
                          onClick={() => setPassengers(p => ({ ...p, children: p.children + 1 }))}
                          className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-warm-white font-bold">Infants</p>
                        <p className="text-[9px] text-muted-gray">Under Age 2</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPassengers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                          className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-white text-xs">{passengers.infants}</span>
                        <button
                          type="button"
                          onClick={() => setPassengers(p => ({ ...p, infants: p.infants + 1 }))}
                          className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPassengerDropdownOpen(false)}
                      className="w-full py-2 bg-[#00B2FF] text-white rounded-lg text-[10px] font-accent uppercase tracking-widest font-bold"
                    >
                      Done Select
                    </button>
                  </div>
                )}
              </div>

              {/* CABIN CLASS */}
              <div>
                <label className="block text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase mb-2 font-bold">
                  CABIN CLASS
                </label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="w-full bg-[#0a080c] border border-white/10 rounded-2xl p-3.5 text-xs text-warm-white focus:border-[#00B2FF] focus:outline-none transition-all cursor-pointer h-[48px]"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First Class">Royal First Class</option>
                </select>
              </div>
            </div>

            {/* ADVANCED FILTER SHUTTER */}
            <div className="border-t border-white/[0.05] pt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(s => !s)}
                className="text-[10px] font-accent tracking-widest uppercase font-bold text-[#00B2FF] flex items-center gap-2 hover:text-[#FFD0B4] bg-transparent cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" /> 
                {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced & Airline Filters'}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-5 bg-[#08060a] rounded-2xl border border-white/5 animate-fade-in text-xs text-warm-white">
                  {/* Preferences Checkboxes */}
                  <div className="space-y-2.5">
                    <p className="font-accent tracking-widest text-[#FFD0B4] text-[9.5px] uppercase font-bold">Flight Criteria</p>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00B2FF] transition-colors">
                      <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="accent-[#00B2FF]" />
                      Direct Flights Only
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00B2FF] transition-colors">
                      <input type="checkbox" checked={flexibleDates} onChange={(e) => setFlexibleDates(e.target.checked)} className="accent-[#00B2FF]" />
                      Flexible Dates (±3 Days)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00B2FF] transition-colors">
                      <input type="checkbox" checked={includeNearby} onChange={(e) => setIncludeNearby(e.target.checked)} className="accent-[#00B2FF]" />
                      Include Nearby Helipads
                    </label>
                  </div>

                  {/* Multi-airlines selection */}
                  <div className="space-y-2">
                    <p className="font-accent tracking-widest text-[#FFD0B4] text-[9.5px] uppercase font-bold">Preferred Carriers</p>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {['Emirates', 'IndiGo', 'Air India', 'Flydubai', 'Etihad Airways', 'Qatar Airways', 'British Airways', 'Lufthansa'].map(carrier => (
                        <label key={carrier} className="flex items-center gap-2 cursor-pointer text-[11px]">
                          <input
                            type="checkbox"
                            checked={preferredAirlines.includes(carrier)}
                            onChange={(e) => {
                              if (e.target.checked) setPreferredAirlines(p => [...p, carrier]);
                              else setPreferredAirlines(p => p.filter(a => a !== carrier));
                            }}
                            className="accent-[#00B2FF]"
                          />
                          {carrier}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pricing slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9.5px] font-accent uppercase tracking-widest font-bold">
                      <span className="text-[#FFD0B4]">Max Charter Cap</span>
                      <span className="text-[#00B2FF] font-mono">${searchMaxPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="50"
                      value={searchMaxPrice}
                      onChange={(e) => setSearchMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#00B2FF] h-1 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-muted-gray uppercase">
                      <span>$100 min</span>
                      <span>$5,000 max</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PRIMARY SEARCH DISPATCH TRIGGER */}
            <button
              onClick={() => setBookingStage('results')}
              className="w-full bg-gradient-to-r from-[#00B2FF] to-[#005F99] border border-[#00B2FF]/40 text-white hover:text-[#FFD0B4] py-4.5 rounded-full font-accent text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer shadow-xl shadow-[#00B2FF]/10 hover:shadow-[#00B2FF]/30"
            >
              <Search className="w-4 h-4 text-[#FFD0B4] animate-pulse" /> Dispatch Verified Results Gateway
            </button>
          </div>
        </div>
      )}

      {/* 3. FLIGHT RESULTS SCREEN */}
      {bookingStage === 'results' && !selectedFlight && (
        <div className="space-y-6 animate-fade-in text-warm-white">
          {/* Header Bar */}
          <div className="p-6 bg-[#0c0a0f] border border-[#00B2FF]/20 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartOver}
                  className="p-2 border border-white/10 hover:border-[#00B2FF] rounded-full text-[#00B2FF]"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h4 className="font-display text-xl md:text-2xl text-warm-white italic">
                  {fromCode} <span className="text-[#FFD0B4] text-sm not-italic font-mono">→</span> {toCode} Flights
                </h4>
              </div>
              <p className="text-xs text-muted-gray font-light ml-11">
                Departure: <span className="text-[#00B2FF] font-medium">{deptDate}</span> • {passengerSummaryText} • {cabinClass}
              </p>
            </div>
            
            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="text-[10px] font-accent text-[#FFD0B4] uppercase tracking-widest font-black">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-black/55 border border-[#00B2FF]/30 rounded-xl px-4 py-2 text-xs text-[#00B2FF] focus:outline-none cursor-pointer"
              >
                <option value="best">★ Best Recommended</option>
                <option value="cheapest">⇅ Cheapest First</option>
                <option value="fastest">⚡ Fastest Engine</option>
                <option value="earliest">🕒 Earliest takeoff</option>
              </select>
            </div>
          </div>

          {/* 7-DAY PRICE ESTIMATES CALENDAR STRIP */}
          <div className="space-y-2">
            <p className="text-[9px] font-accent tracking-widest text-muted-gray uppercase font-bold text-center">Flight Base Cost Forecast (±3 Days)</p>
            <div className="grid grid-cols-7 gap-2">
              {[
                { date: 'Dec 12', p: '$310', bg: 'bg-[#100E12] border-white/5' },
                { date: 'Dec 13', p: '$245', bg: 'bg-[#100E12] border-white/5' },
                { date: 'Dec 14', p: '$210', bg: 'bg-[#100E12] border-[#00B2FF]/15' },
                { date: 'Dec 15', p: '$175', bg: 'border-[#C9A84C] bg-[#C9A84C]/5 shadow-xl shadow-[#C9A84C]/5 text-[#C9A84C] font-black', badge: 'GOLD VALUE' },
                { date: 'Dec 16', p: '$289', bg: 'bg-[#100E12] border-white/5' },
                { date: 'Dec 17', p: '$325', bg: 'bg-[#100E12] border-white/5' },
                { date: 'Dec 18', p: '$410', bg: 'bg-[#100E12] border-white/5' }
              ].map((day, ix) => (
                <div key={day.date} className={`border p-3.5 rounded-2xl flex flex-col items-center justify-center relative text-center group transition-all hover:border-[#00B2FF]/40 ${day.bg}`}>
                  {day.badge && (
                    <span className="absolute -top-2 bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-[6.5px] font-black text-black px-2 py-0.2 rounded-full uppercase tracking-widest">
                      {day.badge}
                    </span>
                  )}
                  <span className="text-[9.5px] text-muted-gray block font-accent uppercase">{day.date}</span>
                  <span className="text-sm font-bold font-mono mt-1">{day.p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
            {/* COLLAPSIBLE SIDEBAR FILTER */}
            <div className="bg-[#0e0d16] border border-white/5 p-6 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center border-b border-white/__5 pb-3">
                <span className="font-accent tracking-widest text-xs uppercase font-bold text-[#FFD0B4]">Filters</span>
                <span className="font-mono text-[9px] text-[#00B2FF] uppercase font-bold">247 verified</span>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-muted-gray">
                  <span>Price Cap</span>
                  <span className="text-[#00B2FF] font-mono">${resultMaxPrice}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="25"
                  value={resultMaxPrice}
                  onChange={(e) => setResultMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#00B2FF]"
                />
              </div>

              {/* Stops Filter blocks */}
              <div className="space-y-2">
                <span className="text-[8.5px] font-accent tracking-widest font-bold text-muted-gray uppercase">Stops</span>
                <div className="grid grid-cols-3 gap-1 grid-flow-row">
                  {['All', '0' , '1'].map(num => (
                    <button
                      key={num}
                      onClick={() => setResultStops(num)}
                      className={`py-2 px-1 text-[9px] font-accent uppercase font-black rounded-lg border transition-all ${
                        resultStops === num
                          ? 'border-[#00B2FF] bg-[#00B2FF]/10 text-[#00B2FF]'
                          : 'border-white/5 text-muted-gray hover:text-white'
                      }`}
                    >
                      {num === 'All' ? 'All Stops' : num === '0' ? 'Direct' : '1 Stop'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure time blocks */}
              <div className="space-y-2">
                <span className="text-[8.5px] font-accent tracking-widest font-bold text-[#FFD0B4] uppercase block">Departure Schedule</span>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  {[
                    { label: '🌅 Morning', range: '06AM - 12PM', val: 'morning' },
                    { label: '☀️ Afternoon', range: '12PM - 06PM', val: 'afternoon' },
                    { label: '🌇 Evening', range: '06PM - 12AM', val: 'evening' },
                    { label: '🌌 Night', range: '12AM - 06AM', val: 'night' }
                  ].map(block => {
                    const isSel = resultTimeBlocks.includes(block.val);
                    return (
                      <button
                        key={block.val}
                        onClick={() => {
                          if (isSel) setResultTimeBlocks(p => p.filter(x => x !== block.val));
                          else setResultTimeBlocks(p => [...p, block.val]);
                        }}
                        className={`p-2.5 rounded-xl border text-center relative flex flex-col items-center justify-center transition-all ${
                          isSel ? 'border-[#00B2FF] bg-[#00B2FF]/5 text-white font-bold' : 'border-white/5 text-muted-gray hover:border-white/10'
                        }`}
                      >
                        <span className="font-bold">{block.label}</span>
                        <span className="text-[7.5px] text-muted-gray font-mono font-normal mt-0.5">{block.range}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities criteria list */}
              <div className="space-y-2">
                <span className="text-[8.5px] font-accent tracking-widest font-bold text-muted-gray uppercase block">Cabin Amenities</span>
                <div className="space-y-2 text-[10.5px]">
                  {['WiFi', 'Meals', 'USB Port', 'Live Music / Entertainment'].map(amen => {
                    const isSel = resultAmenities.includes(amen);
                    return (
                      <label key={amen} className="flex items-center gap-2 cursor-pointer hover:text-[#00B2FF] transition-colors">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={(e) => {
                            if (e.target.checked) setResultAmenities(p => [...p, amen]);
                            else setResultAmenities(p => p.filter(x => x !== amen));
                          }}
                          className="accent-[#00B2FF]"
                        />
                        {amen}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-black/55 p-4 rounded-2xl border border-white/5 space-y-2 text-[9px] leading-relaxed text-muted-gray">
                <div className="flex items-center gap-2 text-[#00B2FF] font-accent font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Checked Security Assurance
                </div>
                Every carrier holds ARGUS / Wyvern certification with verified Stage-4 environmental approvals.
              </div>
            </div>

            {/* FLIGHT TICKETS LIST */}
            <div className="space-y-4">
              {FLIGHT_RESULTS_DATA.filter(flight => {
                // Apply stops filter
                if (resultStops !== 'All') {
                  const numStopsVal = parseInt(resultStops);
                  if (flight.stops !== numStopsVal) return false;
                }
                // Apply price limit
                if (flight.price > resultMaxPrice) return false;
                
                return true;
              }).map(flight => (
                <div 
                  key={flight.id} 
                  className="bg-[#100E12] border border-[#00B2FF]/15 hover:border-[#FFD0B4]/60 rounded-3xl p-6 transition-all duration-300 relative group flex flex-col md:flex-row justify-between gap-6 shadow hover:shadow-2xl hover:shadow-[#00B2FF]/5 relative"
                >
                  {/* Recommended Ribbon */}
                  {flight.tag && (
                    <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-black text-[7px] font-black tracking-widest px-3 py-0.8 rounded-full uppercase shadow">
                      ★ {flight.tag}
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
                    {/* Airline row */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00B2FF]/10 border border-[#00B2FF]/30 flex items-center justify-center font-black font-accent text-xs text-[#00B2FF]">
                        {flight.logo}
                      </div>
                      <div>
                        <span className="font-accent text-xs font-bold text-warm-white block">{flight.airline}</span>
                        <span className="text-[8.5px] font-mono text-muted-gray uppercase">{flight.class} • Sourced Class-A</span>
                      </div>
                    </div>

                    {/* Timeline vector */}
                    <div className="grid grid-cols-3 items-center gap-2 relative">
                      <div className="text-left">
                        <span className="text-base font-bold font-mono text-warm-white block">{flight.depTime}</span>
                        <span className="text-[10px] font-accent text-muted-gray block font-light">{fromCode} ({fromCity.split(' ')[0]})</span>
                      </div>

                      <div className="text-center relative">
                        <span className="text-[9px] font-mono text-[#00B2FF] block tracking-wide">{flight.duration}</span>
                        {/* Vector graphic timeline line */}
                        <div className="h-[1.5px] w-full bg-[#00B2FF]/20 my-1 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 p-1 text-[#00B2FF] z-10">
                            ✈
                          </div>
                        </div>
                        <span className="text-[8.5px] font-mono text-muted-gray block tracking-widest uppercase font-black">{flight.stopsTxt}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-warm-white block">{flight.arrTime}</span>
                        <span className="text-[10px] font-accent text-muted-gray block font-light">{toCode} ({toCity.split(' ')[0]})</span>
                      </div>
                    </div>

                    {/* Icons and specs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-muted-gray font-mono border-t border-white/[0.04]">
                      <span className="text-[#FFD0B4] font-bold">✓ {flight.baggage}</span>
                      {flight.WiFi && <span className="flex items-center gap-1 text-[#00B2FF]">⌨ WiFi Sourced</span>}
                      {flight.Meals && <span className="flex items-center gap-1 text-[#00B2FF]">🍽 Fresh Meals</span>}
                      {flight.USB && <span className="flex items-center gap-1 text-[#00B2FF]">🔌 USB Power</span>}
                      {flight.Entertainment && <span className="flex items-center gap-1 text-[#00B2FF]">🎬 Cinema</span>}
                    </div>
                  </div>

                  {/* Pricing action bar */}
                  <div className="md:w-52 border-t md:border-t-0 md:border-l border-white/[0.05] pt-4 md:pt-0 md:pl-6 flex flex-col justify-between text-right md:text-center">
                    <div>
                      <span className="text-[9px] font-mono text-muted-gray uppercase block tracking-wider">Seats left: {flight.seatsLeft}</span>
                      {flight.seatsLeft <= 4 && (
                        <span className="text-[8px] font-black font-accent text-rose-400 block uppercase mt-0.5">⚠ Sells Fast</span>
                      )}
                    </div>

                    <div className="my-3">
                      <span className="text-2xl font-black text-[#00B2FF] font-mono block">${flight.price}</span>
                      <span className="text-[8.5px] font-mono text-muted-gray uppercase block">Base fare / seat</span>
                    </div>

                    <button
                      onClick={() => setSelectedFlight(flight)}
                      className="w-full bg-gradient-to-r from-[#00B2FF] to-[#005F99] border border-[#00B2FF]/40 text-white rounded-full py-2.5 text-[10px] font-accent tracking-widest uppercase font-bold hover:text-[#FFD0B4] transition-all cursor-pointer"
                    >
                      SELECT FLIGHT →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. HOTEL RECOMMENDATIONS SECTION (SENSITIVE NEXT PROCESS) */}
      {bookingStage === 'results' && selectedFlight && !selectedHotel && (
        <div className="space-y-6 animate-fade-in text-warm-white">
          <div className="p-6 bg-[#0c0a0f] border border-[#C9A84C]/25 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[#C9A84C] font-mono text-[10px] uppercase font-bold tracking-widest block">STEP ②: PAIR LUXURIOUS ACCOMMODATION</span>
              <h4 className="font-display text-2xl text-warm-white italic">
                🏨 Perfect Stays in {toCity.split(' ')[0]}
              </h4>
              <p className="text-xs text-muted-gray font-light">
                We discovered elite hotels matching your {toCode} FBO arrival slot • 5 Nights • 1 Guest
              </p>
            </div>
            <button
              onClick={() => setSelectedFlight(null)}
              className="px-4 py-2 text-xs font-accent tracking-wider rounded-xl border border-white/5 text-[#00B2FF] hover:border-[#00B2FF]/40"
            >
              ← Modify Flight
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getHotelsForDestination().map(hotel => (
              <div 
                key={hotel.id} 
                className="bg-[#121015] border border-white/5 hover:border-[#C9A84C]/50 rounded-[2.5rem] overflow-hidden group transition-all duration-500 shadow relative flex flex-col justify-between"
              >
                {/* Visual Accent header tag according to hotel */}
                <div className="h-44 relative bg-gradient-to-b from-indigo-950/20 to-neutral-900 flex flex-col justify-between p-5">
                  <div className="absolute inset-0 bg-neutral-900/90 mask-image-t" />
                  <div className="relative z-10 flex justify-between items-start">
                    {hotel.badge ? (
                      <span className="bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-black text-[7.5px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {hotel.badge}
                      </span>
                    ) : (
                      <div />
                    )}
                    <span className="text-[#C9A84C] flex items-center gap-0.5 text-xs bg-black/60 px-2 py-0.5 rounded-full font-mono font-bold">
                      ★ {hotel.rating}
                    </span>
                  </div>

                  <div className="relative z-10 text-left">
                    <span className="text-[8px] font-mono text-[#00B2FF] uppercase tracking-widest block">PREMIUM ACCOMMODATION</span>
                    <h5 className="font-display text-lg text-warm-white font-medium group-hover:text-[#C9A84C] transition-colors">{hotel.name}</h5>
                    <span className="text-[10px] text-muted-gray font-light italic">{hotel.area}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-gray leading-relaxed font-light">{hotel.desc}</p>
                  
                  {/* Highlights list as squircles */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/[0.04]">
                    {hotel.highlights.map(hl => (
                      <span key={hl} className="text-[8.5px] font-mono text-warm-white/80 bg-white/5 border border-white/[0.03] px-2.5 py-0.8 rounded-full uppercase">
                        {hl}
                      </span>
                    ))}
                  </div>

                  {/* Location telemetry info */}
                  <div className="flex justify-between items-end pt-3 text-left">
                    <div>
                      <span className="text-[9px] font-mono text-muted-gray uppercase block">5 Nights Base Stay</span>
                      <span className="text-xl font-bold font-mono text-[#C9A84C]" id="hotel-price">${hotel.price.toLocaleString()} <span className="text-xs font-normal text-muted-gray">/ night</span></span>
                      <span className="text-[10px] font-mono text-muted-gray block mt-0.5">Total stay: ${(hotel.price * 5).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => setSelectedHotel(hotel)}
                      className="bg-stone-900 border border-[#C9A84C]/35 hover:bg-[#C9A84C] hover:text-black hover:border-transparent text-[#C9A84C] text-[9.5px] font-accent font-black uppercase px-4 py-2.5 rounded-full tracking-widest transition-all cursor-pointer shadow"
                    >
                      + Add to Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                // Skip hotel option and proceed directly with flight total
                setSelectedHotel(null);
                setBookingStage('checkout');
                setCheckoutStep(1);
              }}
              className="text-[10.5px] font-accent uppercase tracking-widest font-black text-muted-gray hover:text-warm-white bg-transparent"
            >
              Skip pairing a stay & proceed directly to flight checkout →
            </button>
          </div>
        </div>
      )}

      {/* 5. COMBINED BOOKING PACKAGE drawer (STICKY HEADER TICKET ACCORDION) */}
      {bookingStage === 'results' && selectedFlight && selectedHotel && (
        <div className="bg-gradient-to-r from-teal-950/20 via-black to-[#0c0a0f] border border-[#00B2FF]/40 rounded-[2rem] p-6 text-warm-white animate-fade-in flex flex-col md:flex-row justify-between gap-6">
          <div className="text-left space-y-2">
            <h5 className="font-accent text-xs font-black tracking-widest text-[#00B2FF] uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD0B4] animate-spin" /> YOUR CHOSEN AIR_PORT TRIP PACKAGE
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-muted-gray">
              <div>
                <span className="text-white font-mono uppercase block text-[10px] tracking-wider">✈ Flight chartered</span>
                {selectedFlight.airline} {selectedFlight.logo} • {deptDate} • {selectedFlight.class} (${selectedFlight.price.toLocaleString()})
              </div>
              <div>
                <span className="text-[#C9A84C] font-mono uppercase block text-[10px] tracking-wider">🏨 Accommodation paired</span>
                {selectedHotel.name} • 5 nights • {selectedHotel.area} (${selectedHotel.price.toLocaleString()}/night)
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold tracking-wide uppercase">
              ★ BUNDLED SAVINGS SECURED: SAVE $340 BY COMPILING ACCOMMODATIONS TOGETHER
            </p>
          </div>

          <div className="md:w-64 border-t md:border-t-0 md:border-l border-white/[0.05] pt-4 md:pt-0 md:pl-6 text-right md:text-center flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-3xl font-black text-white font-mono">${getFinalTotal().toLocaleString()}</span>
              <span className="text-[8px] font-mono text-muted-gray uppercase block">Bundle discount compiled (Taxes inclusive)</span>
            </div>
            <button
              onClick={() => {
                setBookingStage('checkout');
                setCheckoutStep(1);
              }}
              className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-black font-accent font-black tracking-widest text-xs py-3.5 rounded-full uppercase hover:-translate-y-0.5 transition-all cursor-pointer shadow-lg shadow-[#C9A84C]/15"
            >
              PROCEED TO SECURE FLY →
            </button>
          </div>
        </div>
      )}

      {/* 6. MULTI-STEP CHECKOUT SYSTEM */}
      {bookingStage === 'checkout' && (
        <div className="space-y-8 animate-fade-in text-warm-white">
          {/* Step Indicator Wizard */}
          <div className="bg-black/45 border border-white/5 p-4 rounded-full max-w-3xl mx-auto flex justify-between text-[10.5px] font-accent uppercase tracking-widest font-black text-muted-gray">
            {[
              { id: 1, name: 'Passenger Details' },
              { id: 2, name: 'Aircraft Seat' },
              { id: 3, name: 'Lux Add-ons' },
              { id: 4, name: 'Secure Payment' },
              { id: 5, name: 'Enroute' }
            ].map(step => {
              const isComp = checkoutStep > step.id;
              const isActive = checkoutStep === step.id;
              return (
                <div key={step.id} className="flex items-center gap-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${
                    isComp ? 'bg-emerald-500 text-black font-black' : isActive ? 'bg-[#00B2FF] text-white' : 'bg-white/5'
                  }`}>
                    {isComp ? '✓' : step.id}
                  </span>
                  <span className={`hidden md:inline ${isActive ? 'text-white' : ''}`}>{step.name}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* CENTRAL WIZARD SUBPAGE CONTAINER */}
            <div className="bg-[#0e0d16] border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-6">
              
              {/* CHECKOUT STEP 1: PASSENGER REGISTRATION */}
              {checkoutStep === 1 && (
                <div className="space-y-6 text-left">
                  <div>
                    <h4 className="font-display text-xl md:text-2xl italic tracking-wide text-white">① Passenger Registration info</h4>
                    <p className="text-xs text-muted-gray font-light">Verify diplomatic or private traveler travel credentials below</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Suffix Title</label>
                      <select
                        value={passengerDetails.title}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Dr">Dr.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">First Given Name</label>
                      <input
                        type="text"
                        value={passengerDetails.firstName}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Last Family Name</label>
                      <input
                        type="text"
                        value={passengerDetails.lastName}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        value={passengerDetails.dob}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, dob: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white [color-scheme:dark]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Nationality</label>
                      <input
                        type="text"
                        value={passengerDetails.nationality}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, nationality: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Passport Number</label>
                      <input
                        type="text"
                        value={passengerDetails.passportNumber}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, passportNumber: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Contact Email Address</label>
                      <input
                        type="email"
                        value={passengerDetails.email}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-[#00B2FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Secure Phone Number</label>
                      <input
                        type="text"
                        value={passengerDetails.phone}
                        onChange={(e) => setPassengerDetails(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-muted-gray cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passengerDetails.sameForHotel}
                      onChange={(e) => setPassengerDetails(p => ({ ...p, sameForHotel: e.target.checked }))}
                    />
                    Use same passenger details for luxury hotel dispatch checks
                  </label>

                  <div className="pt-4 border-t border-white/[0.04] text-right">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="bg-[#00B2FF] text-white hover:text-[#FFD0B4] px-8 py-3.5 rounded-full text-xs font-accent tracking-widest font-bold uppercase transition-all shadow-md shadow-[#00B2FF]/10 cursor-pointer"
                    >
                      Proceed to Seat Layout →
                    </button>
                  </div>
                </div>
              )}

              {/* CHECKOUT STEP 2: CABIN SEAT SELECTOR */}
              {checkoutStep === 2 && (
                <div className="space-y-6 text-left">
                  <div>
                    <span className="text-[#00B2FF] font-mono text-[9px] uppercase tracking-widest font-black block">CABIN MATRIX ROUTING</span>
                    <h4 className="font-display text-xl md:text-2xl text-white italic">② Interactive Seat Selection</h4>
                    <p className="text-xs text-muted-gray font-light">Custom reserve your specific aerospace seating compartment</p>
                  </div>

                  {/* Visual Seat Map */}
                  <div className="max-w-md mx-auto bg-[#08060a] border border-white/5 p-6 rounded-3xl relative">
                    <div className="text-center text-[10px] uppercase font-bold tracking-widest text-[#FFD0B4] border-b border-white/[0.05] pb-3 mb-4">
                      ✈ NOSE DIRECT Flight Cabin Top View
                    </div>

                    {/* Seat Map Legend */}
                    <div className="grid grid-cols-4 gap-2 text-[8.5px] text-muted-gray uppercase mb-6 text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3.5 h-3.5 bg-emerald-500 rounded text-black font-bold flex items-center justify-center text-[7.5px]">✓</span> Available ($0)
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3.5 h-3.5 bg-blue-500 rounded flex items-center justify-center text-[7.5px] text-white">L</span> Premium (+$25)
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3.5 h-3.5 bg-amber-500 rounded flex items-center justify-center text-[7.5px] text-black">★</span> Preferred (+$15)
                      </div>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-3.5 h-3.5 bg-neutral-700 rounded block" /> Occupied
                      </div>
                    </div>

                    {/* Interactive Seat Rows Grid */}
                    <div className="space-y-3">
                      {[12, 14, 15, 16, 18, 20, 24, 25].map(row => (
                        <div key={row} className="flex justify-between items-center text-xs">
                          <span className="font-mono text-muted-gray w-6 text-center">{row}</span>
                          
                          {/* Left Seats */}
                          <div className="flex gap-2">
                            {['A', 'B'].map(col => {
                              const seatId = `${row}${col}`;
                              const isOccupied = occupiedSeats.includes(seatId);
                              const isLegroom = legroomSeats.includes(seatId);
                              const isPreferred = preferredSeats.includes(seatId);
                              const isSel = selectedSeat === seatId;
                              
                              let btnClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                              if (isSel) btnClass = 'bg-white text-black border-white outline outline-2 outline-offset-1 outline-white';
                              else if (isOccupied) btnClass = 'bg-neutral-800 text-neutral-600 border border-transparent cursor-not-allowed';
                              else if (isLegroom) btnClass = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
                              else if (isPreferred) btnClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';

                              return (
                                <button
                                  key={seatId}
                                  disabled={isOccupied}
                                  onClick={() => setSelectedSeat(seatId)}
                                  onMouseEnter={() => setHoveredSeatInfo(`${seatId}: ${isLegroom ? 'Premium Suite (+$25)' : isPreferred ? 'Preferred Row (+$15)' : 'Standard Cabin ($0)'}`)}
                                  onMouseLeave={() => setHoveredSeatInfo(null)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] transition-all cursor-pointer ${btnClass}`}
                                >
                                  {isSel ? '✈' : isOccupied ? '✕' : isLegroom ? 'L' : isPreferred ? 'P' : col}
                                </button>
                              );
                            })}
                          </div>

                          {/* AISLE */}
                          <span className="text-[7.5px] text-muted-gray uppercase tracking-widest font-mono">AISLE</span>

                          {/* Right Seats */}
                          <div className="flex gap-2">
                            {['C', 'D'].map(col => {
                              const seatId = `${row}${col}`;
                              const isOccupied = occupiedSeats.includes(seatId);
                              const isLegroom = legroomSeats.includes(seatId);
                              const isPreferred = preferredSeats.includes(seatId);
                              const isSel = selectedSeat === seatId;

                              let btnClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                              if (isSel) btnClass = 'bg-white text-black border-white outline outline-2 outline-offset-1 outline-white';
                              else if (isOccupied) btnClass = 'bg-neutral-800 text-neutral-600 border border-transparent cursor-not-allowed';
                              else if (isLegroom) btnClass = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
                              else if (isPreferred) btnClass = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';

                              return (
                                <button
                                  key={seatId}
                                  disabled={isOccupied}
                                  onClick={() => setSelectedSeat(seatId)}
                                  onMouseEnter={() => setHoveredSeatInfo(`${seatId}: ${isLegroom ? 'Premium Suite (+$25)' : isPreferred ? 'Preferred Row (+$15)' : 'Standard Cabin ($0)'}`)}
                                  onMouseLeave={() => setHoveredSeatInfo(null)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] transition-all cursor-pointer ${btnClass}`}
                                >
                                  {isSel ? '✈' : isOccupied ? '✕' : isLegroom ? 'L' : isPreferred ? 'P' : col}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive seat tooltip info on hover */}
                    {hoveredSeatInfo && (
                      <div className="mt-4 p-2.5 bg-[#00B2FF]/10 border border-[#00B2FF]/40 rounded-xl text-center text-[10px] text-white animate-fade-in font-mono">
                        {hoveredSeatInfo}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/[0.04]">
                    <span className="text-xs text-muted-gray font-mono">Chosen: <span className="text-[#00B2FF] font-bold">{selectedSeat}</span></span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="px-6 py-3 border border-white/10 hover:border-white/20 rounded-full text-xs text-muted-gray uppercase"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCheckoutStep(3)}
                        className="bg-[#00B2FF] text-white hover:text-[#FFD0B4] px-8 py-3.5 rounded-full text-xs font-accent tracking-widest font-bold uppercase transition-all shadow"
                      >
                        Proceed to Extras →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CHECKOUT STEP 3: LUXURY EXTRAS & ADD-ONS */}
              {checkoutStep === 3 && (
                <div className="space-y-6 text-left">
                  <div>
                    <h4 className="font-display text-xl md:text-2xl text-white italic">③ Customize Luxury Travel Extras</h4>
                    <p className="text-xs text-muted-gray font-light">Elevate your flight and hotel hospitality inclusions</p>
                  </div>

                  {/* Flight add-ons list */}
                  <div className="space-y-4">
                    <p className="text-xs font-accent tracking-widest text-[#00B2FF] uppercase font-bold border-b border-white/5 pb-1">✈ Flight Specific Customizations</p>
                    
                    {/* Baggage level toggle */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-black/40 rounded-xl border border-white/5 gap-3.5">
                      <div>
                        <p className="text-[11.5px] font-bold text-white">Checked Baggage Allowance</p>
                        <p className="text-[10px] text-muted-gray">Expand check weight parameters</p>
                      </div>
                      <div className="flex gap-2">
                        {['Standard' , 'Extra' , 'Elite'].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setFlightBaggageLevel(lvl)}
                            className={`px-3 py-1.5 text-[9px] font-accent uppercase rounded border transition-all ${
                              flightBaggageLevel === lvl
                                ? 'border-[#00B2FF] bg-[#00B2FF]/5 text-[#00B2FF] font-bold'
                                : 'border-white/5 text-muted-gray'
                            }`}
                          >
                            {lvl === 'Standard' ? 'Standard ($0)' : lvl === 'Extra' ? 'Extra 23kg ($35)' : 'Elite 32kg ($55)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Travel Insurance checkbox */}
                    <label className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5 cursor-pointer hover:border-[#00B2FF]/20 transition-all">
                      <div className="flex gap-3">
                        <input type="checkbox" checked={travelInsurance} onChange={(e) => setTravelInsurance(e.target.checked)} className="accent-[#00B2FF]" />
                        <div>
                          <p className="text-[11.5px] font-bold text-white">Comprehensive Executive Safeguard Insurance</p>
                          <p className="text-[10px] text-muted-gray">Covers flights cancellation up to 100% refund value</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#00B2FF] font-bold">+$28</span>
                    </label>

                    {/* Fast track checkbox */}
                    <label className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5 cursor-pointer hover:border-[#00B2FF]/20 transition-all">
                      <div className="flex gap-3">
                        <input type="checkbox" checked={fastTrackSeq} onChange={(e) => setFastTrackSeq(e.target.checked)} className="accent-[#00B2FF]" />
                        <div>
                          <p className="text-[11.5px] font-bold text-white">VIP Fast Track Security Clearance</p>
                          <p className="text-[10px] text-muted-gray">Bypass airport check-in queues under AeroLux pre-dispatch clearances</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#00B2FF] font-bold">+$15</span>
                    </label>

                    {/* VIP Lounge access */}
                    <label className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-[#00B2FF]/15 cursor-pointer hover:border-[#00B2FF]/40 transition-all bg-[#00B2FF]/2 text-left">
                      <div className="flex gap-3">
                        <input type="checkbox" checked={vipLounge} onChange={(e) => setVipLounge(e.target.checked)} className="accent-[#00B2FF]" />
                        <div>
                          <p className="text-[11.5px] font-bold text-white">La Maison Premium FBO Airport Lounge Access</p>
                          <p className="text-[10px] text-muted-gray">Direct runway gate transport, free sommelier buffet, and private sleeper beds</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#00B2FF] font-bold">+$45</span>
                    </label>
                  </div>

                  {/* Hotel specific add-ons */}
                  {selectedHotel && (
                    <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                      <p className="text-xs font-accent tracking-widest text-[#C9A84C] uppercase font-bold border-b border-white/5 pb-1">🏨 Hotel Stay Customizations</p>
                      
                      {/* Sea view bedroom upgrade */}
                      <label className="flex items-center justify-between p-3.5 bg-[#141217]/60 rounded-xl border border-white/5 cursor-pointer hover:border-[#C9A84C]/35 transition-all">
                        <div className="flex gap-3">
                          <input type="checkbox" checked={roomViewUpgrade} onChange={(e) => setRoomViewUpgrade(e.target.checked)} className="accent-[#C9A84C]" />
                          <div>
                            <p className="text-[11.5px] font-bold text-white">Signature Ocean or City skyline View Upgrade</p>
                            <p className="text-[10px] text-muted-gray">Guarantees highest hotel floor bedroom allocations</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-[#C9A84C] font-bold">+$80 / night</span>
                      </label>

                      {/* Airport private transfer */}
                      <label className="flex items-center justify-between p-3.5 bg-[#141217]/60 rounded-xl border border-[#C9A84C]/20 cursor-pointer hover:border-[#C9A84C]/45 transition-all text-left">
                        <div className="flex gap-3">
                          <input type="checkbox" checked={airportPrivateCar} onChange={(e) => setAirportPrivateCar(e.target.checked)} className="accent-[#C9A84C]" />
                          <div>
                            <p className="text-[11.5px] font-bold text-white">Dedicated Private Chauffeur Rolls-Royce Airport Transfer</p>
                            <p className="text-[10px] text-muted-gray">White-glove private transfer shuttle each way from FBO directly to hotel lobby</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-[#C9A84C] font-bold">+$45 / way</span>
                      </label>

                      {/* Breakfast,early checking, excursion */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="p-3.5 rounded-xl border border-white/5 flex gap-2 items-start cursor-pointer hover:border-[#C9A84C]/30 text-left bg-black/40">
                          <input type="checkbox" checked={earlyCheckIn} onChange={(e) => setEarlyCheckIn(e.target.checked)} className="accent-[#C9A84C]" />
                          <div>
                            <p className="font-bold text-[11px] text-white">Early Check-in (10 AM)</p>
                            <p className="text-[8.5px] text-muted-gray font-mono">+$30 single charge</p>
                          </div>
                        </label>

                        <label className="p-3.5 rounded-xl border border-white/5 flex gap-2 items-start cursor-pointer hover:border-[#C9A84C]/30 text-left bg-black/40">
                          <input type="checkbox" checked={breakfastPackage} onChange={(e) => setBreakfastPackage(e.target.checked)} className="accent-[#C9A84C]" />
                          <div>
                            <p className="font-bold text-[11px] text-white">Elite Breakfast</p>
                            <p className="text-[8.5px] text-muted-gray font-mono">+$25 / day chef meals</p>
                          </div>
                        </label>

                        <label className="p-3.5 rounded-xl border border-white/5 flex gap-2 items-start cursor-pointer hover:border-[#C9A84C]/30 text-left bg-black/40">
                          <input type="checkbox" checked={desertSafariExcursion} onChange={(e) => setDesertSafariExcursion(e.target.checked)} className="accent-[#C9A84C]" />
                          <div>
                            <p className="font-bold text-[11px] text-white">VIP Local Excursion</p>
                            <p className="text-[8.5px] text-muted-gray font-mono">+$85 / person curated</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-white/[0.04]">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Total extras integrated</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCheckoutStep(2)}
                        className="px-6 py-3 border border-white/10 hover:border-white/20 rounded-full text-xs text-muted-gray uppercase"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCheckoutStep(4)}
                        className="bg-[#00B2FF] text-white hover:text-[#FFD0B4] px-8 py-3.5 rounded-full text-xs font-accent tracking-widest font-bold uppercase transition-all shadow"
                      >
                        Proceed to Payment →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CHECKOUT STEP 4: CREDIT CARD PAYMENT PANEL */}
              {checkoutStep === 4 && (
                <div className="space-y-6 text-left">
                  <div>
                    <h4 className="font-display text-xl md:text-2xl text-white italic">④ Diplomatic Payment Hub</h4>
                    <p className="text-xs text-muted-gray font-light">Pristine, 256-bit encrypted secure transactions</p>
                  </div>

                  {/* Payment method selector */}
                  <div className="grid grid-cols-4 gap-2 border-b border-white/[0.05] pb-4">
                    {[
                      { id: 'card', name: '💳 Card' },
                      { id: 'paypal', name: '🅿 PayPal' },
                      { id: 'apple', name: ' ApplePay' },
                      { id: 'klarna', name: '⚖ Buy Now' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`py-2 px-1 text-[9.5px] font-accent uppercase font-black rounded-xl border transition-all ${
                          paymentMethod === method.id
                            ? 'border-[#00B2FF] bg-[#00B2FF]/10 text-[#00B2FF]'
                            : 'border-white/5 text-muted-gray'
                        }`}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' ? (
                    <form onSubmit={handleProceedPayment} className="space-y-4">
                      {/* Cardholder name */}
                      <div>
                        <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Cardholder Given Name</label>
                        <input
                          type="text"
                          required
                          value={paymentCardName}
                          onChange={(e) => setPaymentCardName(e.target.value.toUpperCase())}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                          placeholder="JOHN DOE"
                        />
                      </div>

                      {/* Card number with masking space helpers */}
                      <div>
                        <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Debit/Credit Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={paymentCardNum}
                            onKeyDown={(e) => {
                              // Live space formatting cardholder keys
                              if (e.key !== 'Backspace' && (paymentCardNum.replace(/\s/g, '').length % 4 === 0) && paymentCardNum.length > 0) {
                                setPaymentCardNum(p => p + ' ');
                              }
                            }}
                            onChange={(e) => setPaymentCardNum(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                            placeholder="4242 4242 4242 4242"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#00B2FF] font-black uppercase">
                            VISA/AMEX
                          </span>
                        </div>
                      </div>

                      {/* Card expiry + CVV with eye toggler */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Expiration MM/YY</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={paymentExpiry}
                            onChange={(e) => setPaymentExpiry(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                            placeholder="12/30"
                          />
                        </div>

                        <div>
                          <label className="block text-[9.5px] font-accent text-[#FFD0B4] uppercase font-bold mb-1.5">Secure Code CVV</label>
                          <div className="relative">
                            <input
                              type={showCVV ? 'text' : 'password'}
                              required
                              maxLength={4}
                              value={paymentCVV}
                              onChange={(e) => setPaymentCVV(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                              placeholder="***"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCVV(prev => !prev)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-gray hover:text-white"
                            >
                              {showCVV ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Promo Code check drawer */}
                      <div className="pt-3 border-t border-white/[0.04]">
                        <label className="block text-[8.5px] font-mono text-muted-gray uppercase mb-1">Enter Promo Voucher</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#00B2FF] uppercase font-mono flex-1 focus:outline-none"
                            placeholder="AEROLUX10"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (promoCode === 'AEROLUX10') {
                                setPromoApplied(true);
                                alert('AEROLUX10 applied! You received exactly 10% off final bundle rates.');
                              } else {
                                alert('Voucher not recognized. Try testing matching code AEROLUX10');
                              }
                            }}
                            className="px-4 py-2 bg-stone-900 border border-[#00B2FF]/40 text-xs text-white rounded-xl uppercase font-accent font-bold"
                          >
                            Apply
                          </button>
                        </div>
                        {promoApplied && (
                          <span className="text-[10px] text-emerald-400 block font-bold font-mono mt-1">★ 10% AEROLUX PROMO DISCOUNT COPIED SUCCESSFULLY!</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 bg-green-500/5 p-3 rounded-2xl border border-emerald-500/20 text-[9px] text-emerald-200/90 leading-relaxed font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        SSL SECURE ACTIVE: Verified with PCI DSS banking standards. Complete security logs.
                      </div>

                      {/* Large Submit payment */}
                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-black hover:opacity-95 font-accent text-xs font-black tracking-widest uppercase py-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#C9A84C]/15"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></span>
                            AUTHORIZING TRANSFER WIRE COMPILATION...
                          </>
                        ) : (
                          <>
                            SECURE PAY ${getFinalTotal().toLocaleString()}
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <p className="text-sm font-medium">Please authorize payment via the external pop-up frame</p>
                      
                      {paymentMethod === 'klarna' && (
                        <div className="p-4 bg-fuchsia-500/5 rounded-2xl border border-fuchsia-400/20 max-w-sm mx-auto space-y-1">
                          <span className="text-[9.5px] font-accent text-fuchsia-400 font-bold block">⚖ CLARNA BUY NOW PAY LATER ACTIVE</span>
                          <p className="text-xl font-bold font-mono">${Math.round(getFinalTotal() / 4).toLocaleString()} / month</p>
                          <p className="text-[9px] text-muted-gray">4 interest-free installment logs, zero setup fees</p>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setIsProcessingPayment(true);
                          setTimeout(() => {
                            setIsProcessingPayment(false);
                            setCheckoutStep(5);
                          }, 1200);
                        }}
                        className="bg-[#00B2FF] text-white px-8 py-3 rounded-full text-xs font-accent tracking-widest font-bold uppercase transition-all shadow-md cursor-pointer"
                      >
                        Simulate Handshake Approved
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CHECKOUT STEP 5: FINAL CONFIRMATION */}
              {checkoutStep === 5 && (
                <div className="space-y-6 text-center py-6">
                  {/* Confetti simulation wrapper */}
                  <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/60 text-emerald-400 mb-2 animate-bounce">
                    <Check className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="font-accent tracking-widest text-[#C9A84C] text-[10px] uppercase font-bold block">CONFIRMATION CLEARANCE PASSED</span>
                    <h4 className="font-display text-3xl text-white italic">🎉 You're All Set!</h4>
                    <p className="text-xs text-muted-gray leading-relaxed max-w-md mx-auto">
                      Booking reference <span className="text-[#00B2FF] font-mono">#AER-{Math.floor(100000 + Math.random() * 900000)}</span> holds absolute clearance. Check your secure inbox for full boarding vouchers.
                    </p>
                  </div>

                  {/* PREMIUM ACTUAL HIGHER FIDELITY REGULATORY BOARDING PASS CARD DESIGN */}
                  <div className="bg-gradient-to-br from-[#121015] to-[#080608] border border-[#00B2FF]/20 rounded-3xl overflow-hidden shadow-2xl relative max-w-xl mx-auto border-t-[3px] border-t-[#C9A84C]">
                    <div className="p-5 border-b border-white/[0.04] flex justify-between items-center bg-black/40">
                      <div className="text-left">
                        <span className="text-[9px] font-accent text-[#C9A84C] uppercase tracking-widest font-black block">AEROLUX CLUB</span>
                        <span className="text-xs font-bold text-white uppercase">{passengerDetails.firstName} {passengerDetails.lastName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-accent text-muted-gray uppercase tracking-widest block">FLIGHT LOG REF</span>
                        <span className="text-xs font-mono text-[#00B2FF] font-bold">ALA-7X9K2M</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-3 items-center text-center">
                        <div className="text-left">
                          <span className="text-3xl font-black font-mono text-white block">{fromCode}</span>
                          <span className="text-[9px] font-accent text-muted-gray uppercase">{fromCity.split('(')[0]}</span>
                        </div>
                        <div className="text-center relative">
                          <span className="text-[10px] font-medium text-[#C9A84C] tracking-widest block">BUSINESS</span>
                          <span className="text-lg block my-1">✈</span>
                          <span className="text-[8px] font-monospace text-muted-gray font-bold block uppercase">Direct</span>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black font-mono text-white block">{toCode}</span>
                          <span className="text-[9px] font-accent text-muted-gray uppercase">{toCity.split('(')[0]}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-left border-t border-white/[0.04] pt-4 leading-relaxed">
                        <div>
                          <span className="text-[8px] text-muted-gray uppercase block">Departure</span>
                          <span className="text-[#00B2FF] font-bold block">{deptDate}</span>
                          <span className="text-[9.5px] text-white">06:00 AM</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-muted-gray uppercase block">Boarding</span>
                          <span className="text-[#00B2FF] font-bold block">05:30 AM</span>
                          <span className="text-[9.5px] text-muted-gray">Gate B14</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-muted-gray uppercase block">Seat selection</span>
                          <span className="text-[#FFD0B4] font-bold block">{selectedSeat}</span>
                          <span className="text-[9.5px] text-muted-gray">Standard Port</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-muted-gray uppercase block">Aircraft Jet</span>
                          <span className="text-[#FFD0B4] font-bold block">A321-Neo</span>
                          <span className="text-[9.5px] text-muted-gray">Tier Verified</span>
                        </div>
                      </div>

                      {/* Mock structural Barcode indicator as requested */}
                      <div className="pt-4 border-t border-dashed border-white/10 flex flex-col items-center justify-center space-y-1.5">
                        <div className="h-10 w-full max-w-sm bg-warm-white/15 rounded flex items-center justify-around overflow-hidden p-1.5 select-none opacity-85">
                          {[...Array(38)].map((_, i) => (
                            <span 
                              key={i} 
                              className="bg-white h-full" 
                              style={{ width: `${(i % 3 === 0) ? '3.5px' : (i % 2 === 0) ? '1px' : '2px'}` }} 
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono tracking-[0.4em] text-muted-gray">ALA*SECURE*TSA*CLEARANCE</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Hotel voucher confirmation below flight ticket */}
                  {selectedHotel && (
                    <div className="bg-[#121015] border border-[#C9A84C]/25 rounded-3xl p-5 max-w-xl mx-auto flex items-start gap-4 text-left border-l-[3px] border-l-[#C9A84C]">
                      <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center text-[#C9A84C] flex-shrink-0">
                        🏨
                      </div>
                      <div className="space-y-1">
                        <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-[7.5px] font-black px-2 py-0.2 rounded uppercase block w-max">ACCOMMODATION CONFIRMED</span>
                        <h5 className="font-bold text-white text-sm">{selectedHotel.name}</h5>
                        <p className="text-[10.5px] font-light text-muted-gray">
                          Area: {selectedHotel.area} • 5 Nights Stay Verified • Late check benefits appended.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-3.5 pt-4">
                    <button
                      onClick={() => alert('Voucher PDF formatted download has been staged to device logs}')}
                      className="px-6 py-2.5 bg-stone-900 border border-[#00B2FF]/20 rounded-full text-xs font-accent uppercase"
                    >
                      Download Boarding Pass (PDF)
                    </button>
                    <button
                      onClick={() => alert('Synced on Apple wallet successfully}')}
                      className="px-6 py-2.5 bg-stone-900 border border-[#00B2FF]/20 rounded-full text-xs font-accent uppercase text-[#FFD0B4]"
                    >
                      Add to Apple/Google Wallet
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="px-8 py-2.5 bg-[#00B2FF] text-white rounded-full text-xs font-accent tracking-widest font-extrabold uppercase shadow"
                    >
                      Book Another Itinerary
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STICKY TRIP SUMMARY PANEL (RIGHT COLUMN) */}
            <div className="bg-[#0e0d16] border border-white/5 rounded-[2.5rem] p-6 space-y-6 lg:sticky lg:top-32 text-left self-stretch">
              <span className="text-[9px] font-accent tracking-widest text-[#FFD0B4] uppercase font-black block">Your Itinerary Summary</span>
              
              <div className="space-y-4">
                {/* Flight item snippet */}
                <div className="space-y-1 bg-black/35 p-3 rounded-2xl border border-white/5 text-xs font-mono">
                  <div className="flex justify-between font-bold text-white">
                    <span>✈ Flight Sourced</span>
                    <span className="text-[#00B2FF]">${deptDate ? 'Fares ready' : 'Staging'}</span>
                  </div>
                  <p className="text-[10px] text-muted-gray">{fromCode} → {toCode} ({cabinClass})</p>
                  <p className="text-[10px] text-[#00B2FF] mt-1 font-bold">{selectedFlight ? selectedFlight.airline : 'Not Selected yet'}</p>
                </div>

                {/* Hotel stay snippet */}
                <div className="space-y-1 bg-black/35 p-3 rounded-2xl border border-white/5 text-xs font-mono">
                  <div className="flex justify-between font-bold text-white">
                    <span>🏨 Hotel paired</span>
                    <span className="text-[#C9A84C]">{selectedHotel ? 'Assigned' : 'Optional'}</span>
                  </div>
                  <p className="text-[10px] text-[#C9A84C] mt-1 font-bold">{selectedHotel ? selectedHotel.name : 'Not selected yet'}</p>
                </div>

                {/* Checkout selection addons count */}
                <div className="space-y-2 text-xs font-mono border-t border-white/[0.04] pt-4 text-muted-gray">
                  {selectedFlight && (
                    <div className="flex justify-between">
                      <span>Flight Subtotal ({totalPassengersCount}x)</span>
                      <span className="text-white">${getFlightPrice().toLocaleString()}</span>
                    </div>
                  )}
                  {selectedHotel && (
                    <div className="flex justify-between">
                      <span>Hotel 5 Nights Stay</span>
                      <span className="text-[#C9A84C]">${getHotelNightsCost().toLocaleString()}</span>
                    </div>
                  )}
                  {getAddonFares() > 0 && (
                    <div className="flex justify-between">
                      <span>Luxury Extras & Addon upgrades</span>
                      <span className="text-white">${getAddonFares().toLocaleString()}</span>
                    </div>
                  )}
                  {getBundleSavings() > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Combined Bundle Discount</span>
                      <span>-${getBundleSavings().toLocaleString()}</span>
                    </div>
                  )}
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Voucher Code Promotion (10%)</span>
                      <span>-10%</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/[0.06] pt-1.5 font-bold text-[#00B2FF]">
                    <span>Gov Taxes & Aviation Fees (12%)</span>
                    <span>12% markup</span>
                  </div>
                </div>

                {/* Absolute Final total */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[8.5px] font-mono text-muted-gray uppercase block">Absolute Total</span>
                    <span className="text-2xl font-black text-white font-mono">${getFinalTotal().toLocaleString()}</span>
                  </div>
                  <div className="text-[8.5px] font-mono text-muted-gray uppercase text-right leading-tight">
                    <span>256-Bit SSL Secured</span>
                    <p className="text-[7.5px] text-[#00B2FF]">Instant Dispatch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DESTINATION GUIDES SECTION BELOW HERO */}
      <section className="pt-8 select-none">
        <div className="text-center space-y-2 mb-10">
          <span className="font-accent tracking-widest text-[#00B2FF] text-[10px] uppercase font-bold block">EXPLORE GLOBAL HAVENS</span>
          <h3 className="font-display text-2.5xl md:text-3.5xl text-warm-white italic">Top Destinations Right Now</h3>
          <p className="text-xs text-muted-gray font-light max-w-md mx-auto">Explore selected first-tier flight paths and real-time conditions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { dest: 'Dubai 🇦🇪', p: '$175', blurb: 'Gold, glamour, and endless sunshine. Perfect skyscraper pools and desert dunes.', weather: '28°C ☀ Perfect weather', time: 'Best Nov - Mar', code: 'DXB', image: '/src/assets/images/dubai_destination_1781030780825.png' },
            { dest: 'Bangkok 🇹🇭', p: '$89', blurb: 'Street food, temples, electric nightlife. Majestic rivers meeting neon.', weather: '32°C ⛅ Tropical humidity', time: 'Best Nov - Feb', code: 'BKK', image: '/src/assets/images/bangkok_destination_1781196312858.jpg' },
            { dest: 'Tokyo 🇯🇵', p: '$420', blurb: 'Tradition meets neon-lit tomorrow. Pristine sushi pairing, cherry blossoms.', weather: '19°C ☁ Mild breezes', time: 'Best Mar - May', code: 'NRT', image: '/src/assets/images/tokyo_destination_1781030762302.png' },
            { dest: 'London 🇬🇧', p: '$310', blurb: 'History, theatre, world-class museums. Royal parks and cozy taverns.', weather: '15°C ☔ Light drizzle', time: 'Best May - Sep', code: 'LHR', image: '/src/assets/images/london_destination_1781030847876.png' },
            { dest: 'Paris 🇫🇷', p: '$290', blurb: 'Romance, fashion, Michelin stars. Seine river cruises and Louvre galleries.', weather: '21°C ☼ Sunny clear sky', time: 'Best Jun - Oct', code: 'CDG', image: '/src/assets/images/paris_destination_1781196278869.jpg' },
            { dest: 'Singapore 🇸🇬', p: '$199', blurb: 'Garden city that never sleeps. Skypark structures and vertical forests.', weather: '30°C ⛈ Tropical showers', time: 'Best Dec - Jun', code: 'SIN', image: '/src/assets/images/singapore_destination_1781196294960.jpg' }
          ].map((gateway, idx) => (
            <div 
              key={gateway.dest} 
              onClick={() => {
                setToCity(`${gateway.dest.split(' ')[0]} (${gateway.code})`);
                setToCode(gateway.code);
                setBookingStage('search');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="bg-[#121015]/60 border border-white/5 hover:border-[#00B2FF]/40 rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* 4K Picture of Destination in Squircle Bracket Container */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-neutral-900 border border-white/[0.04]">
                  <img 
                    src={gateway.image} 
                    alt={gateway.dest} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="flex justify-between items-start mb-3">
                  <span className="font-accent text-sm font-bold text-white">{gateway.dest}</span>
                  <span className="text-[10px] font-mono text-[#00B2FF] font-black bg-[#00B2FF]/10 px-2 py-0.5 rounded border border-[#00B2FF]/20 uppercase">From {gateway.p}</span>
                </div>
                <p className="text-[11.5px] text-muted-gray leading-relaxed font-light">{gateway.blurb}</p>
              </div>

              <div>
                <div className="flex justify-between items-center text-[9.5px] font-mono text-[#FFD0B4] border-t border-white/[0.04] pt-3.5 mt-4">
                  <span>{gateway.weather}</span>
                  <span className="bg-white/5 border border-white/[0.03] px-2 py-0.5 rounded uppercase">{gateway.time}</span>
                </div>

                {/* Google Animated Smart Button inside the card */}
                <div className="mt-4 pt-1">
                  <button className="google-smart-button font-accent text-[8.5px] tracking-[0.12em] uppercase text-[#E8C97A] px-4 py-2 w-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow">
                    <span className="relative z-10 flex items-center gap-1.5 font-bold">
                      Explore Route <ArrowRight className="w-3 h-3 text-[#FFD0B4] transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. GOLD DEALS & OFFER COUNTDOWN */}
      <section className="bg-gradient-to-r from-[#121015] via-[#09080c] to-[#121015] border border-[#00B2FF]/15 p-6 md:p-8 rounded-[2.5rem] select-none text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00B2FF]/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A84C] tracking-widest uppercase font-black">
            <Zap className="w-4 h-4 text-[#C9A84C] animate-bounce" /> Flash Deals — Next 24 Hours Only
          </div>

          <div className="text-center font-mono text-3xl md:text-4xl font-extrabold text-[#C9A84C]" id="countdown-fbo-timer">
            {countdownHrs.toString().padStart(2, '0')}:{countdownMins.toString().padStart(2, '0')}:{countdownSecs.toString().padStart(2, '0')}
          </div>

          <p className="text-xs text-muted-gray font-light max-w-sm">Private flight allocations are priced down up to 60% standard. Lock seats instantly.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
            {[
              { route: 'Mumbai → Bangkok', date: 'Jan 5', cls: 'Economy', price: '$89', was: '$220', pct: 87, save: '59% OFF' },
              { route: 'Delhi → Singapore', date: 'Dec 28', cls: 'Business', price: '$445', was: '$890', pct: 92, save: '50% OFF' },
              { route: 'Chennai → Dubai', date: 'Jan 10', cls: 'Economy', price: '$149', was: '$310', pct: 74, save: '52% OFF' }
            ].map(deal => (
              <div 
                key={deal.route} 
                onClick={() => {
                  setBookingStage('search');
                  setFromCity(deal.route.split(' → ')[0]);
                  setToCity(deal.route.split(' → ')[1]);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="bg-black/40 border border-white/5 hover:border-[#C9A84C]/40 p-5 rounded-3xl text-left space-y-3.5 transition-all cursor-pointer relative group"
              >
                <span className="absolute -top-2.5 right-4 bg-[#C9A84C] text-black text-[7.5px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  {deal.save}
                </span>

                <div>
                  <h5 className="font-accent text-xs font-bold text-white">{deal.route}</h5>
                  <p className="text-[9.5px] font-mono text-muted-gray uppercase">{deal.date} • {deal.cls}</p>
                </div>

                <div className="flex justify-between items-end border-t border-white/[0.04] pt-3">
                  <div>
                    <span className="text-[8.5px] font-mono text-muted-gray line-through block uppercase">WAS {deal.was}</span>
                    <span className="text-lg font-black font-mono text-[#00B2FF]">{deal.price}</span>
                  </div>

                  {/* Seat progression meter */}
                  <div className="w-24 text-right">
                    <span className="text-[7.5px] font-mono text-muted-gray block mb-1 uppercase">{deal.pct}% booked</span>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-[#C9A84C] h-full" style={{ width: `${deal.pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TRAVEL COMPANION SYSTEMS */}
      <section className="select-none">
        <div className="text-center space-y-2 mb-10">
          <span className="font-accent tracking-widest text-[#FFD0B4] text-[10px] uppercase font-bold block">AEROSPACE COLOGNE COMPANION</span>
          <h3 className="font-display text-2.5xl md:text-3.5xl text-warm-white italic">More Than Just Flights</h3>
          <p className="text-xs text-muted-gray font-light">Custom real-time aerospace features available straight from AeroLux dashboards</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { id: 'c1', emoji: '🗓', name: 'Trip Itinerary Planner', desc: 'Build your entire, modular day-by-day vacation itinerary seamlessly.' },
            { id: 'c2', emoji: '🌤', name: 'Weather Forecast', desc: 'Monitor actual weather patterns or storm tracking for FBO clearances.' },
            { id: 'c3', emoji: '💱', name: 'Real-time Currency Converter', desc: 'Convert major currencies instantly under continuous banking rate checks.' },
            { id: 'c4', emoji: '🛂', name: 'Visa & Passport Assist', desc: 'Verify passport entry specifications for over 195 world countries.' },
            { id: 'c5', emoji: '💉', name: 'Global Health & Safety Advisories', desc: 'Checked safety notifications, medical alerts, and quarantine updates.' },
            { id: 'c6', emoji: '📱', name: 'Mobile Smart Boarding Pass', desc: 'Keep travel keys synced to your smartphone Wallet natively.' }
          ].map(comp => (
            <div key={comp.id} className="bg-[#121015]/60 border border-white/5 p-5 rounded-3xl text-left space-y-2 transition-all hover:border-[#00B2FF]/20 cursor-pointer">
              <span className="text-2xl block">{comp.emoji}</span>
              <h5 className="font-accent text-xs font-bold text-white">{comp.name}</h5>
              <p className="text-[10.5px] text-muted-gray font-light leading-relaxed">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. APP DOWNLOAD PROMOTION */}
      <section className="bg-[#0e0d16]/95 border border-[#00B2FF]/15 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 select-none">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/20 via-transparent to-black pointer-events-none" />
        
        <div className="text-left space-y-4 max-w-lg relative z-10">
          <span className="font-accent tracking-widest text-[#C9A84C] text-[10px] uppercase font-bold block">AEROLUX PREMIUM CORE MOBILE</span>
          <h3 className="font-display text-3xl md:text-4.5xl text-white italic leading-tight">Take AeroLux Everywhere</h3>
          <p className="text-xs md:text-sm text-muted-gray leading-relaxed font-light">
            Monitor flight telemetry, lock empty leg flight bargains instantly, and correspond directly with FBO coordinators 24/7. Offline security boarding passes natively active.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => alert('App Store marketplace launched}')}
              className="flex items-center gap-2.5 bg-black hover:bg-stone-900 border border-[#00B2FF]/20 px-5 py-3 rounded-2xl text-xs font-accent tracking-widest font-black uppercase text-white cursor-pointer shadow"
            >
              <Smartphone className="w-4 h-4 text-[#00B2FF]" /> App Store App
            </button>
            <button
              onClick={() => alert('Google Play marketplace launched}')}
              className="flex items-center gap-2.5 bg-black hover:bg-stone-900 border border-[#00B2FF]/20 px-5 py-3 rounded-2xl text-xs font-accent tracking-widest font-black uppercase text-white cursor-pointer shadow"
            >
              <Smartphone className="w-4 h-4 text-[#00B2FF]" /> Google Play
            </button>
          </div>
        </div>

        {/* CSS SMARTPHONE ILLUSTRATION */}
        <div className="w-56 h-96 border-[6px] border-stone-800 bg-neutral-900 rounded-[2.5rem] relative shadow-2xl flex-shrink-0 select-none hidden md:block outline outline-1 outline-white/10">
          {/* Inner camera notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-800 rounded-full" />
          
          <div className="absolute inset-0 p-4 pt-10 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[7.5px] font-mono text-[#00B2FF]/60 uppercase">
                <span>VIP Active Port</span>
                <span>LTE 100%</span>
              </div>

              {/* Passenger ticket sample in phone */}
              <div className="bg-black/60 border border-[#00B2FF]/30 p-2.5 rounded-xl text-white space-y-2">
                <span className="text-[6.5px] font-mono text-[#C9A84C] block uppercase tracking-widest">Active flight</span>
                <p className="text-[10px] font-bold font-accent">BOM ➔ DXB</p>
                <div className="h-[0.5px] bg-[#00B2FF]/25 w-full" />
                <div className="flex justify-between text-[6.5px] font-mono text-muted-gray uppercase">
                  <span>Gate B14</span>
                  <span>Seat 24A</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#C9A84C]/10 to-transparent p-2 rounded-xl text-[7px] text-[#C9A84C] border border-[#C9A84C]/25 text-center">
                ★ Obsidian membership verified
              </div>
            </div>

            <span className="text-[6.5px] text-center text-muted-gray text-mono block uppercase">Scroll for flight telemetry logs</span>
          </div>
        </div>
      </section>

      {/* 11. SECURE CERTIFIED TRUST FOOTER */}
      <footer className="border-t border-white/[0.05] pt-12 pb-6 text-xs text-muted-gray select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-left mb-10 leading-relaxed">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-accent tracking-widest text-[#C9A84C] text-[10px] uppercase font-black block">AEROLUX AVIATION</span>
            <p className="text-[10.5px] text-muted-gray font-light">The absolute highest standard of global dispatch, private cabin terms, and luxury flight mapping.</p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <span className="font-accent tracking-widest text-white text-[9px] uppercase font-bold block">Flights</span>
            <ul className="space-y-1.5 text-[11px] font-light">
              <li><button onClick={() => setBookingStage('search')} className="hover:text-[#00B2FF] bg-transparent transform transition-all cursor-pointer">Search Route</button></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Popular Gateways</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Airlines Partners</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Hot Flash Deals</span></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <span className="font-accent tracking-widest text-white text-[9px] uppercase font-bold block">Hotels & Stays</span>
            <ul className="space-y-1.5 text-[11px] font-light">
              <li><span className="hover:text-[#00B2FF] cursor-pointer font-light">Find paired Stay</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Partner Chains</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Luxury Villas</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Resort Alliances</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <span className="font-accent tracking-widest text-white text-[9px] uppercase font-bold block">Diplomatic Support</span>
            <ul className="space-y-1.5 text-[11px] font-light">
              <li><span className="hover:text-[#00B2FF] cursor-pointer">FBO Help Center</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer font-light">Liaison Contact</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Refund Regulations</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Baggage specs</span></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div className="space-y-3">
            <span className="font-accent tracking-widest text-white text-[9px] uppercase font-bold block">Company Specs</span>
            <ul className="space-y-1.5 text-[11px] font-light">
              <li><span className="hover:text-[#00B2FF] cursor-pointer">The AeroLux Story</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer">Careers</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer font-light">Press Releases</span></li>
              <li><span className="hover:text-[#00B2FF] cursor-pointer font-light">Compliance Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-gray uppercase tracking-widest">
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            <span className="bg-white/5 border border-white/[0.03] px-2.5 py-0.5 rounded text-[8.5px]">⭐ IATA CERTIFIED</span>
            <span className="bg-white/5 border border-white/[0.03] px-2.5 py-0.5 rounded text-[8.5px]">🛡 SSL SECURED</span>
            <span className="bg-white/5 border border-white/[0.03] px-2.5 py-0.5 rounded text-[8.5px]">⚖ PCI DSS COMPLIANT</span>
          </div>
          <span>© 2026 AeroLux Aviation • FAA PART 135 COMPLIANT</span>
        </div>
      </footer>
    </div>
  );
}
