import React, { useState } from 'react';
import { MapPin, Plane, Sparkles, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { Destination } from '../data';

interface WorldMapProps {
  destinations: Destination[];
  onSelectDestination: (destName: string) => void;
}

// Coordinate locations of our 15 luxury cities / FBO terminals overlaid on a beautiful 1000x500 map canvas
interface MapPinpoint {
  id: string;
  name: string;
  code: string;
  x: number; // percentage value
  y: number; // percentage value
}

const LUXURY_PINS: MapPinpoint[] = [
  { id: 'nyc', name: 'New York (KTEB)', code: 'TEB', x: 26.5, y: 35 },
  { id: 'london', name: 'London (EGGW)', code: 'LTN', x: 47.8, y: 24 },
  { id: 'dubai', name: 'Dubai (OMDB)', code: 'DXB', x: 62.5, y: 39 },
  { id: 'santorini', name: 'Santorini (LGSR)', code: 'JTR', x: 52.8, y: 30 },
  { id: 'aspen', name: 'Aspen (KASE)', code: 'ASE', x: 18.5, y: 34 },
  { id: 'monaco', name: 'Monaco (LNMC)', code: 'MCM', x: 48.8, y: 28.5 },
  { id: 'borabora', name: 'Bora Bora (NTTB)', code: 'BOB', x: 10.5, y: 74 },
  { id: 'maldives', name: 'Maldives (VRMM)', code: 'MLE', x: 67.2, y: 51 },
  { id: 'tokyo', name: 'Tokyo (RJTT)', code: 'HND', x: 84.5, y: 36 },
  { id: 'paris', name: 'Paris (LFPB)', code: 'LBG', x: 48.0, y: 26 },
  { id: 'cape_town', name: 'Cape Town (FACT)', code: 'CPT', x: 53.0, y: 79 },
  { id: 'rio', name: 'Rio de Janeiro (SBGL)', code: 'GIG', x: 34.5, y: 71 },
  { id: 'singapore', name: 'Singapore (WSSS)', code: 'SIN', x: 76.5, y: 53 },
  { id: 'sydney', name: 'Sydney (YSSY)', code: 'SYD', x: 89.5, y: 82 },
  { id: 'st_moritz', name: 'St. Moritz (LSZS)', code: 'SMV', x: 49.5, y: 27.5 },
];

export default function WorldMap({ destinations, onSelectDestination }: WorldMapProps) {
  const [hoveredPin, setHoveredPin] = useState<MapPinpoint | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  const activePinObj = LUXURY_PINS.find(p => p.id === activePin) || null;

  const handlePinClicked = (pin: MapPinpoint) => {
    setActivePin(pin.id);
    setZoomScale(2.2);
  };

  const handleResetZoom = () => {
    setActivePin(null);
    setZoomScale(1.0);
  };

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.4, 3.5));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => {
      const next = Math.max(prev - 0.4, 1.0);
      if (next === 1.0) {
        setActivePin(null);
      }
      return next;
    });
  };

  // Triggered when clicking a beautiful 4K Destination Card below the map
  const handleCardClicked = (destName: string, destId: string) => {
    const pin = LUXURY_PINS.find(p => p.id === destId || p.name.toLowerCase().includes(destName.toLowerCase()));
    if (pin) {
      setActivePin(pin.id);
      setZoomScale(2.2);
    }
    
    // Smooth scroll back to map viewport to watch the gorgeous pan/zoom animation
    const headerElement = document.getElementById('destinations-map-section-header');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Triggered when requesting the final travel plan booking form navigation
  const handleRequestBooking = (e: React.MouseEvent, destName: string) => {
    e.stopPropagation();
    onSelectDestination(destName);
  };

  // Flight trajectory calculations (from London/New York core hub to targeted terminal)
  // New York coordinate percentages: x=26.5, y=35
  const nycPin = LUXURY_PINS.find(p => p.id === 'nyc') || { x: 26.5, y: 35 };
  
  // Bezier curve calculations for 1000x500 box size
  const startX = nycPin.x * 10;
  const startY = nycPin.y * 5;
  const targetX = activePinObj ? activePinObj.x * 10 : startX;
  const targetY = activePinObj ? activePinObj.y * 5 : startY;

  const midX = (startX + targetX) / 2;
  const midY = Math.min(startY, targetY) - 80; // High arching bezier trajectory

  const bezierPath = `M ${startX} ${startY} Q ${midX} ${midY} ${targetX} ${targetY}`;

  return (
    <div className="relative w-full overflow-hidden bg-[#0a080d]/95 border border-[#00B2FF]/20 rounded-[2.5rem] p-6 md:p-8 shadow-3xl">
      
      {/* BACKGROUND PEACH/BLUE WEB AMBIENCY DRIFT (Google elegance visual style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem] z-0 opacity-40">
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-16 -left-16 w-96 h-96 bg-[#FFD0B4]/10 rounded-full blur-[90px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-[#00B2FF]/10 rounded-full blur-[110px]"
        />
        {/* Aesthetic horizontal lines and grid scan lines */}
        <div className="absolute inset-0 bg-transparent bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      {/* Decorative Vector Corners for aesthetic tracking / high tech elite styling */}
      <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-[#00B2FF]/40 pointer-events-none z-10" />
      <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-[#00B2FF]/40 pointer-events-none z-10" />
      <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-[#00B2FF]/40 pointer-events-none z-10" />
      <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-[#00B2FF]/40 pointer-events-none z-10" />

      {/* Header telemetry area */}
      <div id="destinations-map-section-header" className="relative flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 z-10">
        <div>
          <span className="font-accent tracking-widest text-[#FFD0B4] text-xs uppercase block mb-1">
            GLOBAL MONITORED SKYNET
          </span>
          <h4 className="font-display text-2xl md:text-3xl text-warm-white tracking-tight">
            Explore Custom Flight Geographies
          </h4>
          <p className="text-xs text-muted-gray mt-1 max-w-lg">
            Tap directly on terminal coordinate dots to configure active flight paths and lock in real-time pricing grids.
          </p>
        </div>
        <div className="text-xs font-mono text-[#00B2FF] bg-black/50 px-4 py-2 rounded-full border border-[#00B2FF]/20 flex items-center shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FFD0B4] animate-ping mr-2.5"></span>
          15 Elite FBO Terminals Active Line
        </div>
      </div>

      {/* Inner World Map with glowing margins/borders and active city names */}
      <div className="relative aspect-[16/8] w-full border border-[#00B2FF]/20 rounded-[2rem] overflow-hidden bg-[#0c0a0f] select-none shadow-2xl z-10">
        
        {/* VIEWPORT CONTROLLER LAYER - Handles the smooth scale, pan, translate coordinates seamlessly */}
        <motion.div
          className="w-full h-full relative"
          style={{
            transformOrigin: activePinObj 
              ? `${activePinObj.x}% ${activePinObj.y}%` 
              : 'center center'
          }}
          animate={{
            scale: zoomScale,
            x: activePinObj ? `${50 - activePinObj.x}%` : '0%',
            y: activePinObj ? `${50 - activePinObj.y}%` : '0%',
          }}
          transition={{
            type: 'spring',
            stiffness: 75,
            damping: 18,
            mass: 0.8
          }}
        >
          {/* Grid outline layout */}
          <svg 
            viewBox="0 0 1000 500" 
            className="absolute inset-0 w-full h-full opacity-40 stroke-[#00B2FF]/15 stroke-[0.5]"
            aria-hidden="true"
          >
            {/* Latitude lines */}
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="200" x2="1000" y2="200" />
            <line x1="0" y1="300" x2="1000" y2="300" />
            <line x1="0" y1="400" x2="1000" y2="400" />
            {/* Longitude lines */}
            <line x1="166" y1="0" x2="166" y2="500" />
            <line x1="333" y1="0" x2="333" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="666" y1="0" x2="666" y2="500" />
            <line x1="833" y1="0" x2="833" y2="500" />

            {/* Aesthetic vector paths depicting stylized glowing world lands */}
            <g fill="none" stroke="url(#mapGrad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.32" className="animate-pulse">
              {/* North America */}
              <path d="M 80,100 T 150,90 T 260,110 T 320,130 T 280,190 T 180,240 T 150,290 T 80,220 T 50,160 Z" />
              {/* South America */}
              <path d="M 180,290 T 260,330 T 310,380 T 280,485 T 230,480 T 180,380 Z" />
              {/* Eurasia / Africa */}
              <path d="M 400,100 T 480,82 T 580,75 T 720,80 T 820,100 T 860,180 T 780,260 T 640,240 T 580,285 T 465,220 T 425,160 Z" />
              <path d="M 465,220 T 545,260 T 578,320 T 560,450 T 510,430 T 450,300 Z" />
              {/* Australia */}
              <path d="M 780,380 T 880,360 T 895,440 T 810,450 Z" />
            </g>

            {/* Bezier Active Flight Trajectory Arc (New York Hub to Selected Terminal) */}
            {activePinObj && activePinObj.id !== 'nyc' && (
              <g>
                <path
                  d={bezierPath}
                  fill="none"
                  stroke="#FFD0B4"
                  strokeWidth="3.5"
                  opacity="0.1"
                  strokeLinecap="round"
                />
                <motion.path
                  d={bezierPath}
                  fill="none"
                  stroke="#00B2FF"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                
                {/* Visual airplane flight bullet indicator pulsing along trajectory */}
                <circle r="4" fill="#FFD0B4" className="shadow-[0_0_8px_rgb(255,208,180)] filter drop-shadow-[0_0_4px_#FFD0B4]">
                  <animateMotion
                    path={bezierPath}
                    dur="5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                </circle>
              </g>
            )}

            <defs>
              <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00B2FF" />
                <stop offset="100%" stopColor="#FFD0B4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Real-world continent labels in soft typography */}
          <span className="absolute left-[15%] top-[20%] text-[8px] font-mono text-[#00B2FF]/20 tracking-[0.3em] uppercase">North America</span>
          <span className="absolute left-[20%] top-[70%] text-[8px] font-mono text-[#00B2FF]/20 tracking-[0.3em] uppercase">South America</span>
          <span className="absolute left-[45%] top-[15%] text-[8px] font-mono text-[#00B2FF]/20 tracking-[0.3em] uppercase">Eurasia</span>
          <span className="absolute left-[48%] top-[60%] text-[8px] font-mono text-[#00B2FF]/20 tracking-[0.3em] uppercase">Africa</span>
          <span className="absolute left-[80%] top-[80%] text-[8px] font-mono text-[#00B2FF]/20 tracking-[0.3em] uppercase">Australia</span>

          {/* Dynamic map pinpoint target indicators with PERSISTENT labels */}
          {LUXURY_PINS.map((pin) => {
            const isSelected = activePin === pin.id;
            const isHovered = hoveredPin?.id === pin.id;

            return (
              <div
                key={pin.id}
                className="absolute z-10"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <button
                  onClick={() => handlePinClicked(pin)}
                  onMouseEnter={() => setHoveredPin(pin)}
                  onMouseLeave={() => setHoveredPin(null)}
                  className="relative flex items-center justify-center group/btn -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  aria-label={`Select Route to ${pin.name}`}
                >
                  {/* Pulsing ring outer */}
                  <span className={`absolute inline-flex rounded-full bg-[#00B2FF]/30 opacity-75 animate-ping ${
                    isSelected || isHovered ? 'h-8 w-8' : 'h-5 w-5'
                  }`}></span>
                  
                  {/* Outer golden/neon core */}
                  <span className={`relative flex rounded-full border border-black shadow-[0_0_8px_rgba(0,178,255,0.6)] transition-all duration-300 ${
                    isSelected 
                      ? 'h-3.5 w-3.5 bg-[#FFD0B4]' 
                      : isHovered 
                      ? 'h-3.5 w-3.5 bg-white scale-125' 
                      : 'h-2.5 w-2.5 bg-[#00B2FF]'
                  }`}></span>

                  {/* Aesthetic vector crosshairs indicator around active point */}
                  {(isSelected || isHovered) && (
                    <div className="absolute -inset-2.5 border border-[#FFD0B4]/60 rounded-full border-dashed animate-spin duration-3000 pointer-events-none" />
                  )}
                </button>

                {/* PERSISTENT TEXT LABELS directly on the world map layout (Addresses user request) */}
                <div 
                  className={`absolute left-4 top-0 -translate-y-1/2 transition-all duration-300 flex items-center gap-1 bg-[#0c0a0f]/90 border px-2 py-0.5 rounded-full backdrop-blur-sm shadow pointer-events-none whitespace-nowrap ${
                    isSelected 
                      ? 'border-[#FFD0B4] text-[#FFD0B4] scale-105 z-20 bg-[#0e0d16]' 
                      : isHovered 
                      ? 'border-[#00B2FF] text-white scale-105 z-20' 
                      : 'border-[#00B2FF]/15 text-muted-gray/80 text-[8px] md:text-[9px]'
                  }`}
                >
                  <span className="font-mono font-bold text-[7px] text-[#00B2FF]">{pin.code}</span>
                  <span className="font-sans text-[8px] md:text-[8.5px] font-medium tracking-tight">
                    {pin.name.split(' (')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* HIGH-TECH AVIONICS MANUAL MAP CONTROLLERS (Overlayed on map outside animated viewport) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2 text-[9px] font-mono text-[#00B2FF]/80 text-right uppercase tracking-wider bg-black/50 border border-[#00B2FF]/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <span>ZOOM: {zoomScale.toFixed(1)}X</span>
            <span>GRID: RADAR-LOCK</span>
          </div>

          <div className="flex bg-black/60 border border-[#00B2FF]/30 rounded-xl overflow-hidden backdrop-blur-md shadow-lg">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="px-3.5 py-2.5 text-[#00B2FF] hover:text-[#FFD0B4] hover:bg-white/5 border-r border-[#00B2FF]/15 transition-colors cursor-pointer text-sm font-bold"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="px-3.5 py-2.5 text-[#00B2FF] hover:text-[#FFD0B4] hover:bg-white/5 border-r border-[#00B2FF]/15 transition-colors cursor-pointer text-sm font-bold"
            >
              -
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset View"
              className="px-3 py-2.5 text-xs text-[#00B2FF] hover:text-[#FFD0B4] hover:bg-white/5 transition-colors cursor-pointer font-mono"
            >
              ⟲
            </button>
          </div>
        </div>

        {/* Real-time details overlay panel in corner with Google-type button action */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-85 bg-[#0c0a0f]/95 border border-[#00B2FF]/30 p-5 rounded-3xl backdrop-blur-lg z-20 shadow-2xl">
          {hoveredPin || activePin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FFD0B4] animate-pulse" />
                <span className="font-accent tracking-widest text-[9.5px] text-[#00B2FF] font-black uppercase">
                  {hoveredPin ? 'TARGETING RADAR SIGNAL' : 'DISPATCH ROUTE SELECTED'}
                </span>
              </div>
              <div>
                <p className="font-display text-2xl text-warm-white tracking-tight">
                  {hoveredPin ? hoveredPin.name : LUXURY_PINS.find(p => p.id === activePin)?.name}
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 border-t border-[#00B2FF]/10 pt-2 font-mono text-[9px] text-[#00B2FF]">
                  <div>LAT: {((activePinObj ? activePinObj.y : 35) * 1.8 - 90).toFixed(4)}° S</div>
                  <div>LNG: {((activePinObj ? activePinObj.x : 26.5) * 3.6 - 180).toFixed(4)}° E</div>
                  <div>ALTITUDE: FL410</div>
                  <div>SPEED: MACH 0.85</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3.5 border-t border-[#00B2FF]/15">
                <span className="text-[10px] font-mono text-muted-gray uppercase font-semibold">Immediate Dispatch</span>
                
                {/* Sleek Google-type oval filled button (Addresses user request) */}
                <button 
                  onClick={(e) => handleRequestBooking(e, hoveredPin ? hoveredPin.name : (LUXURY_PINS.find(p => p.id === activePin)?.name || ''))}
                  className="google-oval-btn-filled text-[#0c0a0f] text-[10px] font-accent font-extrabold tracking-widest px-4.5 py-2.5 rounded-full uppercase shadow-md shadow-[#00B2FF]/15 cursor-pointer flex items-center gap-1.5 hover:scale-103 active:scale-97 transition-all"
                >
                  Configure Route <Plane className="w-3.5 h-3.5 text-[#0c0a0f]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2.5">
              <span className="font-mono text-[#FFD0B4] text-[9.5px] tracking-widest font-black block uppercase mb-1">
                AEROLUX EMBARK RADAR
              </span>
              <p className="text-[11px] text-muted-gray font-body leading-relaxed">
                Click any direct gold nodes to chart precise high-altitude flights and configure coordinates securely.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grid of the 6 featured locations with cards below the map */}
      {/* Featuring Picture of country as consistent background inside each card, legibly masked (Addresses user request) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 z-10 relative">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => handleCardClicked(dest.name, dest.id)}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-[#00B2FF]/20 hover:border-[#FFD0B4] bg-[#0c0a0f] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,178,255,0.3)] h-[380px] md:h-[450px] flex flex-col justify-between"
          >
            {/* Visual real background 4K picture with optimized bright/saturate framing overlay */}
            <div className="absolute inset-0 select-none overflow-hidden rounded-[2.5rem] z-0">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.65] group-hover:brightness-[0.8] contrast-[1.1] saturate-[1.2] pointer-events-none"
                referrerPolicy="no-referrer"
              />
              {/* Premium cinematic lighting overlay - subtle dark backing only at bottom/top for perfect legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60" />
            </div>

            {/* Content template layer */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Header section with badges */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest text-[#FFD0B4] font-bold bg-black/75 border border-[#FFD0B4]/60 px-4 py-1.5 rounded-full uppercase shadow">
                    {dest.badge}
                  </span>
                  <span className="text-[10px] font-mono text-white bg-[#00B2FF]/20 backdrop-blur-md px-3 py-1 rounded-full border border-[#00B2FF]/40 font-bold shadow-sm">
                    {dest.flightTime}
                  </span>
                </div>
                
                <h5 className="font-display text-3xl md:text-4xl text-warm-white tracking-tight group-hover:text-[#FFD0B4] transition-colors pt-2 italic font-light drop-shadow-md">
                  {dest.name}
                </h5>
              </div>

              {/* Description and Action Button at bottom */}
              <div className="space-y-4 pt-16">
                <p className="text-xs md:text-sm text-neutral-200 font-light leading-relaxed drop-shadow bg-black/30 p-3 rounded-2xl backdrop-blur-2xs border border-white/[0.03]">
                  {dest.description}
                </p>

                {/* Google-type button action indicator (Addresses user request) */}
                <div className="pt-4 border-t border-[#00B2FF]/20 flex items-center justify-between text-xs font-accent text-[#00B2FF] group-hover:text-[#FFD0B4] transition-colors">
                  <button 
                    onClick={(e) => handleRequestBooking(e, dest.name)}
                    className="text-[10px] font-mono tracking-widest uppercase font-black text-black bg-[#FFD0B4] border border-[#FFD0B4] px-5 py-3 rounded-full hover:bg-white hover:border-white group-hover:bg-[#FFD0B4] group-hover:text-black transition-all shadow-lg shadow-[#00B2FF]/15 cursor-pointer"
                  >
                    Request Travel Plan
                  </button>
                  <span className="transform translate-x-0 group-hover:translate-x-2.5 transition-transform font-bold text-xl text-[#FFD0B4]">→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
