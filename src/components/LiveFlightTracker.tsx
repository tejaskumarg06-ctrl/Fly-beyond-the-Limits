import { useState, useEffect } from 'react';
import { Plane, Compass, Clock, Wind, ArrowRight, Activity, MapPin } from 'lucide-react';

interface ActiveFlight {
  id: string;
  callsign: string;
  aircraft: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  status: string;
  progress: number; // percentage covered
  altitude: number; // in feet
  speed: string; // mach
  eta: string;
  coords: {
    fromPercentX: number;
    fromPercentY: number;
    toPercentX: number;
    toPercentY: number;
  };
  cockpitLogs: string[];
}

const ACTIVE_FLIGHTS: ActiveFlight[] = [
  {
    id: 'f1',
    callsign: 'AEROLUX 017',
    aircraft: 'Gulfstream G700',
    from: 'London EGGW',
    fromCode: 'LTN',
    to: 'Dubai OMDB',
    toCode: 'DXB',
    status: 'In Flight - Cruising Phase',
    progress: 68,
    altitude: 43000,
    speed: 'Mach 0.90',
    eta: '1h 45m remaining',
    coords: {
      fromPercentX: 47.8,
      fromPercentY: 24.0,
      toPercentX: 62.5,
      toPercentY: 39.0,
    },
    cockpitLogs: [
      'Operational liaison contact verified with regional ATC.',
      'Adjusting flight deck altitude settings to 43,000 ft.',
      'Bespoke culinary course 2 prepped and waiting in master galley.',
      'Winds neutral. Transitioning around Mediterranean airspace.'
    ]
  },
  {
    id: 'f2',
    callsign: 'AEROLUX 320',
    aircraft: 'VIP Airbus ACJ320neo',
    from: 'New York KTEB',
    fromCode: 'TEB',
    to: 'Maldives VRMM',
    toCode: 'MLE',
    status: 'In Flight - Oceanic Entry',
    progress: 42,
    altitude: 39000,
    speed: 'Mach 0.82',
    eta: '5h 12m remaining',
    coords: {
      fromPercentX: 26.5,
      fromPercentY: 35.0,
      toPercentX: 67.2,
      toPercentY: 51.0,
    },
    cockpitLogs: [
      'In-flight communications secure. Primary satellite link active.',
      'Cabin ambient pressure normalized at optimal ARGUS safety levels.',
      'Executive suite master lighting configured for quiet-time cycle.',
      'Atlantic crossing pattern matched with optimal tailwinds.'
    ]
  },
  {
    id: 'f3',
    callsign: 'AEROLUX 750',
    aircraft: 'Bombardier Global 7500',
    from: 'Tokyo RJTT',
    fromCode: 'HND',
    to: 'Aspen KASE',
    toCode: 'ASE',
    status: 'In Flight - Desired Descent Course',
    progress: 84,
    altitude: 41000,
    speed: 'Mach 0.925',
    eta: '0h 58m remaining',
    coords: {
      fromPercentX: 84.5,
      fromPercentY: 36.0,
      toPercentX: 18.5,
      toPercentY: 34.0,
    },
    cockpitLogs: [
      'Beginning descent preparation. Intersecting Rocky Mountain approach vector.',
      'Cabin Crew preparing state-of-the-art chef station for arrival sequence.',
      'Ground Rolls-Royce chauffeur transfer team notified in Aspen.',
      'Anti-ice modules tested. Standard flight envelope compliance locked.'
    ]
  }
];

export default function LiveFlightTracker() {
  const [selectedFlightId, setSelectedFlightId] = useState<string>('f1');
  const [flights, setFlights] = useState<ActiveFlight[]>(ACTIVE_FLIGHTS);
  const [ticker, setTicker] = useState<number>(0);

  // Simulate flight progress ticking and coordinates updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFlights(prev => prev.map(f => {
        let nextProg = f.progress + 0.1;
        if (nextProg > 100) nextProg = 10; // reset loop for visual continuity
        return {
          ...f,
          progress: Number(nextProg.toFixed(2))
        };
      }));
      setTicker(t => t + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentFlight = flights.find(f => f.id === selectedFlightId) || flights[0];

  // Helper to calculate current airplane coordinate based on start, end, progress, and altitude curving factors
  const getFlightCurrentCoords = (f: ActiveFlight) => {
    const { fromPercentX, fromPercentY, toPercentX, toPercentY } = f.coords;
    const p = f.progress / 100;
    
    // Linear interpolation
    let x = fromPercentX + (toPercentX - fromPercentX) * p;
    let y = fromPercentY + (toPercentY - fromPercentY) * p;

    // Add a curve offset (bezier height) for visual rendering
    const midX = (fromPercentX + toPercentX) / 2;
    const distance = Math.sqrt(Math.pow(toPercentX - fromPercentX, 2) + Math.pow(toPercentY - fromPercentY, 2));
    const h = distance * 0.15; // arc amplitude
    const offset = Math.sin(p * Math.PI) * h;

    // Shift y upwards to create a curved arch
    y = y - offset;

    return { x, y };
  };

  const planePos = getFlightCurrentCoords(currentFlight);

  return (
    <div className="bg-[#0c0a0f] border border-[#C9A84C]/25 rounded-2xl p-6 md:p-8 space-y-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden" id="live-flight-tracker">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Title & Stats Headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C9A84C]/10 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-accent tracking-[0.25em] text-[#C9A84C] text-[10px] uppercase font-bold">24/7 Monitored Skynet</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-light text-warm-white italic">AEROLUX Live Flight Operations</h3>
          <p className="text-xs text-muted-gray font-light mt-1">Real-time telemetry and FBO terminal coordinate updates for active member cabins.</p>
        </div>

        {/* Top-Right general flight data card */}
        <div className="flex gap-4 font-mono text-[11px] text-right">
          <div className="border-r border-gold-muted/15 pr-4">
            <span className="text-muted-gray block uppercase text-[9px] tracking-wider">ACTIVE FLIGHTS</span>
            <span className="text-gold-light font-bold text-sm">3 Flagships Radar</span>
          </div>
          <div className="border-r border-gold-muted/15 pr-4">
            <span className="text-muted-gray block uppercase text-[9px] tracking-wider">ALTITUDE CAP</span>
            <span className="text-gold-light font-bold text-sm">FL450 Max</span>
          </div>
          <div>
            <span className="text-muted-gray block uppercase text-[9px] tracking-wider">NETWORK CONTROL</span>
            <span className="text-[#34d399] font-bold text-sm flex items-center justify-end gap-1">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> SECURED
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Side: Live Radar SVG Map Widget (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/8] bg-[#050406] border border-[#C9A84C]/15 rounded-xl overflow-hidden select-none shadow-inner group">
            {/* Background Map Grid */}
            <svg 
              viewBox="0 0 100 50" 
              className="absolute inset-0 w-full h-full opacity-20 stroke-[#C9A84C]/5 stroke-[0.25]"
            >
              {[10, 20, 30, 40].map(val => (
                <line key={`lat-${val}`} x1="0" y1={val} x2="100" y2={val} />
              ))}
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(val => (
                <line key={`lon-${val}`} x1={val} y1="0" x2={val} y2="50" />
              ))}
            </svg>

            {/* Simulated Continent Polygons in SVG (Ultra low-vertex minimal style for luxurious design) */}
            <svg 
              viewBox="0 0 100 50" 
              className="absolute inset-0 w-full h-full fill-[#131117] stroke-[#C9A84C]/10 stroke-[0.3]"
            >
              {/* North America */}
              <polygon points="5,8 18,5 28,10 24,20 18,22 14,19 10,21 8,16" />
              {/* South America */}
              <polygon points="20,24 25,24 35,32 30,45 28,48 24,38 21,30" />
              {/* Eurasia (Europe + Asia) */}
              <polygon points="40,8 55,6 63,12 85,9 90,18 92,26 82,35 74,32 72,25 64,25 55,18 43,15" />
              {/* Africa */}
              <polygon points="42,21 52,19 58,26 59,34 52,44 48,42 43,30" />
              {/* Australia */}
              <polygon points="78,36 88,34 90,40 84,45 78,41" />
            </svg>

            {/* Draw Flight Paths For All Active Flights */}
            <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full pointer-events-none">
              {flights.map((f) => {
                const { fromPercentX, fromPercentY, toPercentX, toPercentY } = f.coords;
                // Draw bezier curved paths using curve parameters M from Q mid to
                const midX = (fromPercentX + toPercentX) / 2;
                const midY = (fromPercentY + toPercentY) / 2;
                const distance = Math.sqrt(Math.pow(toPercentX - fromPercentX, 2) + Math.pow(toPercentY - fromPercentY, 2));
                const h = distance * 0.15; // arc height
                const controlX = midX;
                const controlY = midY - h;

                const isCurrent = f.id === selectedFlightId;

                return (
                  <g key={`route-${f.id}`}>
                    {/* Path underlay for neon glowing effect */}
                    <path 
                      d={`M ${fromPercentX},${fromPercentY} Q ${controlX},${controlY} ${toPercentX},${toPercentY}`}
                      fill="none"
                      stroke={isCurrent ? '#C9A84C' : '#C9A84C'}
                      strokeWidth={isCurrent ? '0.8' : '0.3'}
                      className={`transition-all duration-500 opacity-60 ${isCurrent ? 'stroke-gold-primary filter blur-[1px]' : 'opacity-20'}`}
                    />
                    {/* Active dotted route lines */}
                    <path 
                      style={{ strokeDasharray: '1.2, 1' }}
                      d={`M ${fromPercentX},${fromPercentY} Q ${controlX},${controlY} ${toPercentX},${toPercentY}`}
                      fill="none"
                      stroke={isCurrent ? '#F2EDE8' : '#C9A84C'}
                      strokeWidth={isCurrent ? '0.5' : '0.25'}
                      className={`transition-all duration-500 ${isCurrent ? 'opacity-90' : 'opacity-30'}`}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Airport Pinpoints */}
            {flights.map((f) => (
              <div key={`pins-${f.id}`}>
                <div 
                  className="absolute pointer-events-none"
                  style={{ left: `${f.coords.fromPercentX}%`, top: `${f.coords.fromPercentY}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <span className="relative flex h-1.5 w-1.5 rounded-full bg-[#E8C97A] border border-black shadow-[0_0_4px_rgba(201,168,76,0.8)]" />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[8px] text-muted-gray select-none tracking-tighter bg-black/50 px-1 py-0.2 rounded border border-white/5 opacity-60">
                    {f.fromCode}
                  </span>
                </div>
                <div 
                  className="absolute pointer-events-none"
                  style={{ left: `${f.coords.toPercentX}%`, top: `${f.coords.toPercentY}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <span className="relative flex h-1.5 w-1.5 rounded-full bg-gold-primary border border-black shadow-[0_0_4px_rgba(201,168,76,0.8)] animate-pulse" />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[8px] text-[#E8C97A] select-none tracking-tighter bg-black/50 px-1 py-0.2 rounded border border-[#C9A84C]/10">
                    {f.toCode}
                  </span>
                </div>
              </div>
            ))}

            {/* Glowing Active Airplane Icon dynamically calculated along the curve */}
            <div 
              className="absolute z-20 pointer-events-none transition-all duration-[4000ms] ease-out flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${planePos.x}%`, top: `${planePos.y}%` }}
            >
              {/* Radar ring effect */}
              <span className="absolute flex h-7 w-7 rounded-full bg-gold-primary/20 animate-ping" />
              <div className="bg-[#120f17] border border-gold-primary/50 text-gold-primary rounded-full p-1.5 shadow-[0_0_10px_rgba(201,168,76,0.6)]">
                <Plane className="w-3.5 h-3.5 rotate-45 transform" />
              </div>
              <span className="text-[7.5px] font-mono font-bold text-gold-primary bg-black/80 px-1.2 py-0.5 mt-1 border border-gold-primary/30 rounded select-none shadow">
                {currentFlight.callsign} ({currentFlight.progress}%)
              </span>
            </div>

            {/* Radar Coordinates Sweep Panel */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-gold-light bg-black/60 px-2.5 py-1 rounded border border-[#C9A84C]/25 backdrop-blur-sm shadow z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>RADAR LAT: +{(24.5 + planePos.y * 0.4).toFixed(4)}° / LNG: -{(72.8 - planePos.x * 1.2).toFixed(4)}°</span>
            </div>

            {/* Progress Bar inside Radar footer */}
            <div className="absolute bottom-3 right-3 bg-black/80 px-3 py-1.5 rounded border border-[#C9A84C]/20 text-[9px] font-mono text-muted-gray w-48 shadow">
              <div className="flex justify-between items-center mb-1 text-[8.5px]">
                <span>HUD {currentFlight.fromCode} → {currentFlight.toCode}</span>
                <span className="text-gold-light font-bold">{currentFlight.progress}%</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded overflow-hidden">
                <div className="bg-gold-primary h-full rounded transition-all duration-[4000ms] ease-out" style={{ width: `${currentFlight.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Quick flight deck details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="telemetry-grid">
            <div className="bg-[#121016] border border-gold-muted/10 p-3.5 rounded-xl space-y-1 text-center">
              <span className="text-[9px] font-mono text-muted-gray uppercase block tracking-wider">ALTITUDE CAP</span>
              <span className="text-warm-white font-mono text-[13px] font-semibold block">{currentFlight.altitude.toLocaleString()} FT</span>
            </div>
            <div className="bg-[#121016] border border-gold-muted/10 p-3.5 rounded-xl space-y-1 text-center">
              <span className="text-[9px] font-mono text-muted-gray uppercase block tracking-wider">CRUISE VELOCITY</span>
              <span className="text-warm-white font-mono text-[13px] font-semibold block text-[#E8C97A]">{currentFlight.speed}</span>
            </div>
            <div className="bg-[#121016] border border-gold-muted/10 p-3.5 rounded-xl space-y-1 text-center">
              <span className="text-[9px] font-mono text-muted-gray uppercase block tracking-wider">ESTIMATED REMAIN</span>
              <span className="text-warm-white font-mono text-[13px] font-semibold block">{currentFlight.eta}</span>
            </div>
            <div className="bg-[#121016] border border-gold-muted/10 p-3.5 rounded-xl space-y-1 text-center">
              <span className="text-[9px] font-mono text-muted-gray uppercase block tracking-wider">CURRENT POSITION</span>
              <span className="text-emerald-400 font-mono text-[13px] font-semibold block uppercase">AIRBORNE</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Flights Selector & Live Cockpit Logs Feed (4 columns) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          {/* Active Flight Selector Buttons */}
          <div className="space-y-3">
            <span className="text-[10px] font-accent tracking-widest text-gold-muted uppercase font-bold block">
              Active Premium Transports:
            </span>
            <div className="space-y-2.5">
              {flights.map((f) => {
                const isCurrent = f.id === selectedFlightId;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlightId(f.id)}
                    className={`w-full text-left p-3.5 px-5 border transition-all cursor-pointer flex justify-between items-center ${
                      isCurrent 
                        ? 'google-oval-btn-filled text-[#0c0a0f] shadow-md border-gold-primary' 
                        : 'google-oval-btn text-muted-gray hover:text-warm-white bg-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Plane className={`w-3.5 h-3.5 ${isCurrent ? 'text-black rotate-45' : 'text-muted-gray'}`} />
                        <span className="font-mono text-xs font-semibold">{f.callsign}</span>
                      </div>
                      <p className={`text-[10px] font-body block ${isCurrent ? 'text-black/80 font-medium' : 'text-warm-white/70'}`}>{f.aircraft}</p>
                    </div>

                    <div className="text-right font-mono text-[10px]">
                      <span className={`tracking-wide font-bold ${isCurrent ? 'text-black' : 'text-gold-light'}`}>{f.fromCode} → {f.toCode}</span>
                      <span className={`block text-[8px] px-1 rounded-sm mt-0.5 border ${isCurrent ? 'border-black/20 bg-black/5 text-black/80' : 'border-white/5 bg-white/5 text-muted-gray'}`}>
                        ETA: {f.eta.replace(' remaining', '')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Flight Cockpit Log */}
          <div className="bg-black/50 border border-gold-muted/15 rounded-xl p-4 flex-1 flex flex-col min-h-[180px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <span className="font-accent tracking-wider text-[9px] text-[#E8C97A] font-bold uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-gold-primary animate-pulse" />
                  COCKPIT LIAISON FEED
                </span>
                <span className="text-[8px] font-mono text-muted-gray">SSL ENABLED</span>
              </div>

              {/* Feed outputs */}
              <div className="space-y-2.5 max-h-[140px] overflow-y-auto font-mono text-[9px] leading-relaxed text-muted-gray">
                {currentFlight.cockpitLogs.map((log, index) => (
                  <div key={index} className="flex gap-1.5 items-start">
                    <span className="text-gold-primary font-bold flex-shrink-0">[{12 + index}:{(40 + index * 5) % 60}]</span>
                    <p className="text-[#F2EDE8]/85">{log}</p>
                  </div>
                ))}
                <div className="flex gap-1.5 items-start text-[#34d399]/90 animate-pulse">
                  <span className="font-bold flex-shrink-0">[*] SYS:</span>
                  <p>AOG Liaison online. Continual telemetry scan complete.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-muted-gray flex justify-between items-center">
              <span>CABIN COMFORT: SECURE</span>
              <span className="text-gold-primary font-semibold">TEMP: 21.5°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
