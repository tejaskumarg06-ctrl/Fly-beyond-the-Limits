export interface Aircraft {
  id: string;
  name: string;
  category: string;
  specs: {
    range: string;
    passengers: string;
    cruise: string;
  };
  features: string[];
  price: string;
  gradient: string; // luxurious aesthetic backup background
  image: string; // photorealistic aircraft image source
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  badge: 'Most Popular' | 'Trending' | 'Exclusive';
  flightTime: string;
  gradient: string;
  lat: number; // approximate map percentages for the custom SVG coordinates
  lng: number;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface EmptyLeg {
  id: string;
  route: string;
  aircraft: string;
  time: string;
  price: string;
  originalPrice: string;
  depImg?: string;
  arrImg?: string;
  depCode?: string;
  arrCode?: string;
  depCity?: string;
  arrCity?: string;
}

export interface MembershipTier {
  name: string;
  tagline: string;
  price: string;
  perks: string[];
  color: string;
  borderColor: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  location: string;
}

export const FLEET_DATA: Aircraft[] = [
  {
    id: 'g700',
    name: 'Gulfstream G700',
    category: 'ULTRA LONG RANGE',
    specs: {
      range: '7,500 nm',
      passengers: '19',
      cruise: 'Mach 0.90',
    },
    features: ['Full bedroom suite with queen bed', 'En-suite shower facility', '20 panoramic oval windows', 'Lowest cabin altitude in class'],
    price: 'From $18,000/hr',
    gradient: 'from-slate-900 via-indigo-950 to-[#221e2b]',
    image: '/src/assets/images/g700_jet_1781031447261.png',
  },
  {
    id: 'global7500',
    name: 'Bombardier Global 7500',
    category: 'FLAGSHIP',
    specs: {
      range: '7,700 nm',
      passengers: '17',
      cruise: 'Mach 0.925',
    },
    features: ['4 distinct living spaces', 'Full size master suite', 'State-of-the-art chef galley', 'Nuage sleep ergonomic seating'],
    price: 'From $20,000/hr',
    gradient: 'from-[#0d141e] via-[#1a1424] to-[#120f18]',
    image: '/src/assets/images/global_7500_jet_1781031462542.png',
  },
  {
    id: 'falcon10x',
    name: 'Dassault Falcon 10X',
    category: 'ULTRA WIDE CABIN',
    specs: {
      range: '7,500 nm',
      passengers: '16',
      cruise: 'Mach 0.90',
    },
    features: ['Largest cabin cross-section in class', 'Luxury dining room configuration', 'Spacious dual-lounge space', 'Extremely high-efficiency wing architecture'],
    price: 'From $17,500/hr',
    gradient: 'from-[#181119] via-[#0b1b22] to-[#110e13]',
    image: '/src/assets/images/falcon_10x_jet_1781031479622.png',
  },
  {
    id: 'phenom300e',
    name: 'Embraer Phenom 300E',
    category: 'LIGHT JET',
    specs: {
      range: '2,010 nm',
      passengers: '9',
      cruise: '453 ktas',
    },
    features: ['Best-in-class multi-zone performance', 'Ergonomic plush leather seats', 'Highly responsive pilot interfaces', 'Generous baggage compartments'],
    price: 'From $4,500/hr',
    gradient: 'from-[#111115] via-[#1c1815] to-[#0d0d0f]',
    image: '/src/assets/images/phenom_300e_jet_1781031500680.png',
  },
  {
    id: 'acj320neo',
    name: 'Airbus ACJ329neo',
    category: 'VIP AIRLINER',
    specs: {
      range: '6,300 nm',
      passengers: '19 - 60+',
      cruise: 'Mach 0.78',
    },
    features: ['Fully bespoke VIP interiors', 'Separate executive meeting room', 'Private master en-suite and office', 'Extended overhead high-density storage'],
    price: 'Contact for Pricing',
    gradient: 'from-zinc-950 via-[#1d1c31] to-stone-950',
    image: '/src/assets/images/acj329neo_jet_1781031518481.png',
  },
];

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'maldives',
    name: 'Maldives',
    description: 'Overwater villas, crystalline turquoise lagoons, total island seclusion.',
    badge: 'Exclusive',
    flightTime: '~11 hrs from NYC',
    gradient: 'from-[#051118] to-[#152e3d]',
    lat: 70, // percent on custom SVG map overlay
    lng: 60,
    image: '/src/assets/images/dest_maldives_1781063407461.png',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    description: 'Gold-plated desert wonders, futuristic skyline hospitality, and private helipads.',
    badge: 'Most Popular',
    flightTime: '~13 hrs from NYC',
    gradient: 'from-[#1a1410] to-[#3a2c20]',
    lat: 68,
    lng: 48,
    image: '/src/assets/images/dest_dubai_1781063421451.png',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    description: 'Breathtaking Aegean sunsets, whitewashed curves, and elite cliffside villa pools.',
    badge: 'Trending',
    flightTime: '~9 hrs from NYC',
    gradient: 'from-[#0b1c28] to-[#172e42]',
    lat: 56,
    lng: 41,
    image: '/src/assets/images/dest_santorini_1781063436034.png',
  },
  {
    id: 'aspen',
    name: 'Aspen',
    description: 'Champagne powder snow peaks, ski-in/ski-out accessibility, and exquisite fireside lounges.',
    badge: 'Exclusive',
    flightTime: '~4 hrs from NYC',
    gradient: 'from-[#1a1e26] to-[#343e4f]',
    lat: 50,
    lng: 15,
    image: '/src/assets/images/dest_aspen_1781063448987.png',
  },
  {
    id: 'monaco',
    name: 'Monaco',
    description: 'Grand yacht harbors, high-stakes casino glamour, and private Formula 1 box entry.',
    badge: 'Trending',
    flightTime: '~8 hrs from NYC',
    gradient: 'from-[#191016] to-[#331c2c]',
    lat: 53,
    lng: 36,
    image: '/src/assets/images/dest_monaco_1781063462528.png',
  },
  {
    id: 'borabora',
    name: 'Bora Bora',
    description: 'The untouched crown pearl of French Polynesia, pristine waters and private corals.',
    badge: 'Exclusive',
    flightTime: '~10 hrs from LAX',
    gradient: 'from-[#061c28] to-[#14424e]',
    lat: 78,
    lng: 8,
    image: '/src/assets/images/dest_borabora_1781063479849.png',
  },
];

export const SERVICES_DATA: Service[] = [
  {
    id: 'concierge',
    title: 'Concierge Planning',
    icon: 'Compass', // Use icon mapping key
    description: 'From coordinated luxury yacht arrivals to exclusive Michelin-starred dinners and invite-only gallery accesses — your personal concierge advisor stands ready to fulfill every delicate command.',
  },
  {
    id: 'inflight',
    title: 'In-Flight Luxury',
    icon: 'Wine',
    description: 'Tailor your high-altitude experience with dishes curated by master culinary minds, rare-vintage wine selections, and ultra-secure communication systems designed to shield state meetings or entertainment arrays.',
  },
  {
    id: 'ground',
    title: 'Secure Ground Transfers',
    icon: 'Car',
    description: 'Transition effortlessly from tarmac to suite. An elite fleet of private-chauffeur Rolls-Royce, Bentley, or heavy armored SUVs seamlessly aligns with your arrival schedule at any international FBO.',
  },
  {
    id: 'villas',
    title: 'Yacht & Villa Pairing',
    icon: 'Anchor',
    description: 'Crafted multi-modal itineraries. Connect your private flight directly to a chartered 80-meter mega-yacht in the Mediterranean or a secluded family estate nestled along the Amalfi Coast or Aspen slopes.',
  },
];

export const EMPTY_LEGS_DATA: EmptyLeg[] = [
  {
    id: 'leg1',
    route: 'New York (KTEB) → Miami (KOPF)',
    aircraft: 'Gulfstream G550',
    time: 'Tomorrow, Departure 14:00 EST',
    price: '$8,500',
    originalPrice: '$28,000',
    depImg: '/src/assets/images/reposition_ny_kteb_1781186235650.jpg',
    arrImg: '/src/assets/images/reposition_miami_kopf_1781186169866.jpg',
    depCode: 'KTEB',
    arrCode: 'KOPF',
    depCity: 'New York',
    arrCity: 'Miami',
  },
  {
    id: 'leg2',
    route: 'London (EGGW) → Dubai (OMDB)',
    aircraft: 'Bombardier Global 6000',
    time: 'June 15, Departure 11:30 BST',
    price: '$42,000',
    originalPrice: '$95,000',
    depImg: '/src/assets/images/reposition_lon_eggw_1781186258359.jpg',
    arrImg: '/src/assets/images/reposition_dxb_omdb_1781186277503.jpg',
    depCode: 'EGGW',
    arrCode: 'OMDB',
    depCity: 'London',
    arrCity: 'Dubai',
  },
  {
    id: 'leg3',
    route: 'Los Angeles (KVNY) → Las Vegas (KLAS)',
    aircraft: 'Cessna Citation XLS+',
    time: 'Tonight, Departure 18:00 PST',
    price: '$3,200',
    originalPrice: '$12,500',
    depImg: '/src/assets/images/reposition_la_kvny_1781186213709.jpg',
    arrImg: '/src/assets/images/reposition_vegas_klas_1781186193714.jpg',
    depCode: 'KVNY',
    arrCode: 'KLAS',
    depCity: 'Los Angeles',
    arrCity: 'Las Vegas',
  },
];

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    name: 'SILVER CLUB',
    tagline: 'The Gateway to Private Aviation',
    price: '$150,000 /yr deposit',
    color: 'from-zinc-400 to-zinc-600',
    borderColor: 'border-zinc-500/30',
    perks: [
      'Guaranteed aircraft on 24-hour response notice',
      'Priority access to last-minute regional Empty Legs',
      'Exclusive bespoke menus drafted on-demand',
      'Dedicated member services specialist'
    ],
  },
  {
    name: 'GOLD ELITE',
    tagline: 'Optimized for Multi-Regional Flight Needs',
    price: '$350,000 /yr deposit',
    color: 'from-amber-500 via-yellow-600 to-amber-700',
    borderColor: 'border-gold-primary/40',
    perks: [
      'Guaranteed flight availability on only 12-hour notice',
      'Zero positioning fees within continental flight zones',
      'Full catering curated with sommelier collections',
      'Complimentary ultra-broadband in-flight connectivity',
      'Companion flight service discounts'
    ],
  },
  {
    name: 'OBSIDIAN',
    tagline: 'The Ultimate Standard of Global Command',
    price: '$1,000,000 /yr deposit',
    color: 'from-neutral-800 via-neutral-950 to-stone-900',
    borderColor: 'border-gold-primary/80 shadow-[0_0_15px_rgba(201,168,76,0.15)]',
    perks: [
      'Guaranteed flagship ultra-long-range jet on 6-hour notice',
      'Zero holiday premium fees & peak-day surcharges',
      'Helicopter airport-to-city transfers included globally',
      'Custom menus designed by active Michelin-starred chefs',
      'Private villa, yacht, and Formula 1 trackside access VIP tickets',
      'Full aircraft personalization (family crests, custom linens)'
    ],
  },
];

export interface AirportOption {
  code: string;
  city: string;
  airport: string;
}

export interface FlightResult {
  id: string;
  airline: string;
  logo: string;
  depTime: string;
  arrTime: string;
  duration: string;
  stops: number;
  stopsTxt: string;
  price: number;
  class: string;
  tag?: string;
  WiFi: boolean;
  Meals: boolean;
  USB: boolean;
  Entertainment: boolean;
  baggage: string;
  seatsLeft: number;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  area: string;
  desc: string;
  price: number;
  badge?: string;
  highlights: string[];
}

export const POPULAR_AIRPORTS: AirportOption[] = [
  { code: 'JFK', city: 'New York', airport: 'John F. Kennedy Intl' },
  { code: 'LHR', city: 'London', airport: 'Heathrow Airport' },
  { code: 'DXB', city: 'Dubai', airport: 'Dubai International' },
  { code: 'CDG', city: 'Paris', airport: 'Charles de Gaulle' },
  { code: 'NRT', city: 'Tokyo', airport: 'Narita International' },
  { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji' },
  { code: 'SIN', city: 'Singapore', airport: 'Changi Airport' },
  { code: 'SYD', city: 'Sydney', airport: 'Kingsford Smith' },
  { code: 'YYZ', city: 'Toronto', airport: 'Pearson International' },
  { code: 'BKK', city: 'Bangkok', airport: 'Suvarnabhumi Intl' },
  { code: 'IST', city: 'Istanbul', airport: 'Istanbul Airport' },
  { code: 'FRA', city: 'Frankfurt', airport: 'Frankfurt Airport' }
];

export const FLIGHT_RESULTS_DATA: FlightResult[] = [
  {
    id: 'f1',
    airline: 'Emirates',
    logo: 'EK',
    depTime: '10:30 AM',
    arrTime: '02:15 PM',
    duration: '3h 45m',
    stops: 0,
    stopsTxt: 'Direct',
    price: 289,
    class: 'Business',
    tag: 'Recommended',
    WiFi: true,
    Meals: true,
    USB: true,
    Entertainment: true,
    baggage: '35" 23kg Checked Bag Included',
    seatsLeft: 4
  },
  {
    id: 'f2',
    airline: 'IndiGo',
    logo: '6E',
    depTime: '06:00 AM',
    arrTime: '09:55 AM',
    duration: '3h 55m',
    stops: 0,
    stopsTxt: 'Direct',
    price: 198,
    class: 'Economy',
    tag: 'Cheapest Direct',
    WiFi: false,
    Meals: false,
    USB: true,
    Entertainment: false,
    baggage: '20" 15kg Cabin Bag',
    seatsLeft: 12
  },
  {
    id: 'f3',
    airline: 'Air India',
    logo: 'AI',
    depTime: '02:20 PM',
    arrTime: '06:30 PM',
    duration: '4h 10m',
    stops: 0,
    stopsTxt: 'Direct',
    price: 221,
    class: 'Economy',
    WiFi: true,
    Meals: true,
    USB: false,
    Entertainment: true,
    baggage: '23kg Checked Bag Included',
    seatsLeft: 8
  },
  {
    id: 'f4',
    airline: 'Flydubai',
    logo: 'FZ',
    depTime: '10:45 PM',
    arrTime: '02:40 AM+1',
    duration: '3h 55m',
    stops: 0,
    stopsTxt: 'Direct',
    price: 175,
    class: 'Economy',
    tag: 'Red-Eye Value',
    WiFi: true,
    Meals: false,
    USB: true,
    Entertainment: true,
    baggage: '7kg Cabin Bag Only',
    seatsLeft: 2
  },
  {
    id: 'f5',
    airline: 'Etihad Airways',
    logo: 'EY',
    depTime: '08:15 AM',
    arrTime: '03:30 PM',
    duration: '7h 15m',
    stops: 1,
    stopsTxt: '1 Stop (AUH)',
    price: 245,
    class: 'Economy',
    WiFi: true,
    Meals: true,
    USB: true,
    Entertainment: true,
    baggage: '23kg checked bag',
    seatsLeft: 5
  },
  {
    id: 'f6',
    airline: 'Qatar Airways',
    logo: 'QR',
    depTime: '11:00 AM',
    arrTime: '08:30 PM',
    duration: '9h 30m',
    stops: 1,
    stopsTxt: '1 Stop (DOH)',
    price: 210,
    class: 'Economy',
    tag: '5-Star Quality',
    WiFi: true,
    Meals: true,
    USB: true,
    Entertainment: true,
    baggage: '25kg Checked Bag',
    seatsLeft: 3
  },
  {
    id: 'f7',
    airline: 'British Airways',
    logo: 'BA',
    depTime: '09:00 AM',
    arrTime: '06:45 PM',
    duration: '9h 45m',
    stops: 1,
    stopsTxt: '1 Stop (LHR)',
    price: 315,
    class: 'Premium Economy',
    WiFi: true,
    Meals: true,
    USB: true,
    Entertainment: true,
    baggage: '2x 23kg Checked Bags',
    seatsLeft: 6
  },
  {
    id: 'f8',
    airline: 'Lufthansa',
    logo: 'LH',
    depTime: '07:30 AM',
    arrTime: '09:00 PM',
    duration: '13h 30m',
    stops: 2,
    stopsTxt: '2 Stops (FRA/MUC)',
    price: 289,
    class: 'Economy',
    WiFi: true,
    Meals: true,
    USB: true,
    Entertainment: true,
    baggage: '1 Piece checked baggage',
    seatsLeft: 4
  }
];

export const HOTEL_DATABASE: Record<string, { city: string; hotels: Hotel[] }> = {
  "DXB": {
    city: "Dubai",
    hotels: [
      {
        id: "h1",
        name: "Burj Al Arab Jumeirah",
        rating: 9.8,
        reviews: 4231,
        area: "Jumeirah Beach",
        desc: "The world's most iconic hotel. Ultra-luxury suites, personal butler, private helicopter transfers available.",
        price: 1850,
        badge: "ICONIC STAY",
        highlights: ["Butler service", "Private beach", "9 restaurants", "Underwater dining"]
      },
      {
        id: "h2",
        name: "Atlantis The Palm",
        rating: 9.2,
        reviews: 12450,
        area: "Palm Jumeirah",
        desc: "Epic resort with the world's largest waterpark, aquarium, and celebrity restaurants.",
        price: 450,
        badge: "BESTSELLER",
        highlights: ["Aquaventure Waterpark", "Private beach", "Nobu restaurant", "Dolphin Bay"]
      },
      {
        id: "h3",
        name: "Address Downtown",
        rating: 9.4,
        reviews: 8762,
        area: "Downtown Dubai",
        desc: "Sky-high luxury steps from Burj Khalifa. Infinity pool overlooking the Dubai Fountain.",
        price: 380,
        badge: "GREAT LOCATION",
        highlights: ["Burj Khalifa view", "Infinity pool", "Metro access", "Dubai Fountain"]
      },
      {
        id: "h4",
        name: "JW Marriott Marquis",
        rating: 9.0,
        reviews: 6340,
        area: "Business Bay",
        desc: "World's tallest hotel. Perfect for business travelers — 14 restaurants, massive spa, high-end suites.",
        price: 280,
        badge: "BUSINESS FAVORITE",
        highlights: ["Tallest hotel", "14 restaurants", "Saray Spa", "Executive Lounge"]
      },
      {
        id: "h5",
        name: "Rove Downtown",
        rating: 8.7,
        reviews: 15230,
        area: "Downtown Dubai",
        desc: "Stylish, affordable urban hotel. Walking distance to everything that matters.",
        price: 95,
        badge: "BEST VALUE",
        highlights: ["Walking to Mall", "Cinema room", "Saltwater pool", "Free WiFi"]
      },
      {
        id: "h6",
        name: "ibis Dubai Al Barsha",
        rating: 8.3,
        reviews: 22100,
        area: "Al Barsha",
        desc: "Clean, comfortable, unbeatable price. Next to Dubai Metro and Mall of the Emirates.",
        price: 55,
        badge: "BUDGET PICK",
        highlights: ["Close to metro", "24/7 dining", "Comfortable beds", "Free parking"]
      }
    ]
  },
  "BKK": {
    city: "Bangkok",
    hotels: [
      {
        id: "hb1",
        name: "Mandarin Oriental Bangkok",
        rating: 9.5,
        reviews: 11200,
        area: "Chao Phraya Riverside",
        desc: "Historic, ultra-refined luxury along the river of kings.",
        price: 350,
        badge: "LEGENDARY SERVICE",
        highlights: ["Michelin Dining", "Bespoke boat shuttle", "Renowned wellness spa", "River views"]
      },
      {
        id: "hb2",
        name: "The Peninsula Bangkok",
        rating: 9.6,
        reviews: 9500,
        area: "Riverside",
        desc: "Timeless sophistication, elegant three-tiered resort style swimming pool.",
        price: 420,
        badge: "ICONIC RIVERFRONT",
        highlights: ["Helipad port", "Traditional Thai hospitality", "Wellness retreats", "Riverside dining"]
      },
      {
        id: "hb3",
        name: "Anantara Riverside Resort",
        rating: 9.1,
        reviews: 8400,
        area: "Thonburi",
        desc: "An urban oasis set on 11 acres of lush greenery away from city bustle.",
        price: 180,
        badge: "FAMILY RESORT",
        highlights: ["Lush gardens", "Swim-up pool bar", "Evening fire shows", "Excellent buffet"]
      },
      {
        id: "hb4",
        name: "Chatrium Hotel Riverside",
        rating: 8.8,
        reviews: 14200,
        area: "Riverside",
        desc: "Towering luxury with premium oversized executive suites.",
        price: 120,
        badge: "SPACIOUS SUITES",
        highlights: ["Infinity pool", "Kitchenettes", "River shuttles", "Sky lounge"]
      },
      {
        id: "hb5",
        name: "ibis Styles Bangkok Silom",
        rating: 8.2,
        reviews: 4300,
        area: "Silom Central",
        desc: "Funky, energetic design hotel right in the heart of the business zone.",
        price: 45,
        badge: "BEST VALUE",
        highlights: ["Rooftop bar", "Vibrant murals", "Next to BTS Skytrain", "Great brunch"]
      }
    ]
  },
  "NRT": {
    city: "Tokyo",
    hotels: [
      {
        id: "ht1",
        name: "Aman Tokyo",
        rating: 9.9,
        reviews: 1450,
        area: "Otemachi",
        desc: "Sanctuary at the top of Otemachi tower. Breathtaking views of Mount Fuji.",
        price: 1200,
        badge: "THE pinnacle OF LUXURY",
        highlights: ["Stone garden in lobby", "30m basalt pool", "Masterful sake pairing", "Nigiri sushi bar"]
      },
      {
        id: "ht2",
        name: "Park Hyatt Tokyo",
        rating: 9.7,
        reviews: 6500,
        area: "Shinjuku Sky",
        desc: "Perched high in Shinjuku, famous for Lost in Translation and New York Bar.",
        price: 650,
        badge: "CULT CLASSIC",
        highlights: ["New York Bar", "Peak Lounge breakfast", "Stunning Mount Fuji views", "Bespoke spa"]
      },
      {
        id: "ht3",
        name: "Shinjuku Granbell Hotel",
        rating: 8.9,
        reviews: 12100,
        area: "Kabukicho District",
        desc: "Arty design hotel in the center of Shinjuku's neon entertainment avenue.",
        price: 180,
        badge: "MODERN DESIGN",
        highlights: ["Art rooms", "Rooftop neon bar", "Trendy lounges", "Near JR Shinjuku Station"]
      },
      {
        id: "ht4",
        name: "Dormy Inn Akihabara",
        rating: 8.5,
        reviews: 8300,
        area: "Akihabara Electric Town",
        desc: "Famous for its open-air rooftop hot springs (Onsen) and free evening ramen.",
        price: 85,
        badge: "NATURAL ONSEN",
        highlights: ["Outdoor hot spring bath", "Free draft beers", "Free soy sauce ramen", "Tech hub closeness"]
      },
      {
        id: "ht5",
        name: "APA Hotel Shinjuku Kabukicho",
        rating: 8.0,
        reviews: 24700,
        area: "Center Shinjuku",
        desc: "Ultra-compact, super-functional business rooms with pristine accessibility.",
        price: 60,
        badge: "EFFICIENT WORKSTAY",
        highlights: ["Fast automated check-in", "Pristine public baths", "High-speed WiFi", "Steps from Godzilla monument"]
      }
    ]
  },
  "LHR": {
    city: "London",
    hotels: [
      {
        id: "hl1",
        name: "The Savoy",
        rating: 9.6,
        reviews: 7900,
        area: "Covent Garden",
        desc: "Elegant Edwardian landmark hotel beloved by royalty, actors, and world leaders.",
        price: 850,
        badge: "ROYAL HERITAGE",
        highlights: ["American Bar cocktails", "Savoy Grill", "River views", "Bespoke butler"]
      },
      {
        id: "hl2",
        name: "Claridge's",
        rating: 9.8,
        reviews: 4300,
        area: "Mayfair",
        desc: "The ultimate Art Deco masterwork of luxury lodging, refined hospitality.",
        price: 700,
        badge: "MAYFAIR ELITE",
        highlights: ["English High Tea", "Art Deco design", "Personal butler assist", "Michelin star chefs"]
      },
      {
        id: "hl3",
        name: "The Hoxton Shoreditch",
        rating: 8.9,
        reviews: 14500,
        area: "Shoreditch",
        desc: "Hip industrial lobby, curated design bedrooms, energetic workspace culture.",
        price: 220,
        badge: "TRENDSETTER FAV",
        highlights: ["Cozy fireplace lounge", "Local art galleries", "Lively restaurant", "Free micro breakfast"]
      },
      {
        id: "hl4",
        name: "citizenM Tower of London",
        rating: 8.7,
        reviews: 11900,
        area: "Tower Bridge District",
        desc: "Outstanding smart-controlled bedrooms, premium rooftop bar with Tower views.",
        price: 160,
        badge: "SMART TECH",
        highlights: ["iPad room controls", "Rooftop view of Thames", "24/7 boutique pantry", "Fast check-in"]
      },
      {
        id: "hl5",
        name: "Premier Inn Heathrow Airport",
        rating: 8.0,
        reviews: 35000,
        area: "Heathrow",
        desc: "Ultra-quiet triple-glazed windows and comfortable beds directly adjacent to runway terminals.",
        price: 89,
        badge: "TERMINAL LAYOVER",
        highlights: ["Terminal shuttle bus", "All-you-can-eat breakfast", "Comfortable beds", "Quiet rooms"]
      }
    ]
  },
  "CDG": {
    city: "Paris",
    hotels: [
      {
        id: "hp1",
        name: "Four Seasons Hotel George V",
        rating: 9.9,
        reviews: 3100,
        area: "Champs-Elysées",
        desc: "Art-filled Parisian palace with three Michelin-starred restaurants totaling 5 stars.",
        price: 1400,
        badge: "PALACE CLASSIFIED",
        highlights: ["Triple Michelin dining", "Stunning floral designs", "Grand pool", "Champs-Elysées steps"]
      },
      {
        id: "hp2",
        name: "Le Meurice",
        rating: 9.8,
        reviews: 2400,
        area: "Louvre-Tuileries",
        desc: "The hotel of artists and thinkers, featuring whimsical interior styling by Philippe Starck.",
        price: 1100,
        badge: "SOPHISTICATED ART",
        highlights: ["Alain Ducasse dining", "Tuileries garden view", "Spa Valmont", "Dali bar lounge"]
      },
      {
        id: "hp3",
        name: "Hotel Monge",
        rating: 9.2,
        reviews: 4700,
        area: "Latin Quarter",
        desc: "Charming Boutique hotel decorated with watercolor silks and classic French literature sets.",
        price: 280,
        badge: "BOUTIQUE CHARM",
        highlights: ["Honesty bar", "Macaron tea hour", "Hammams", "Central Latin Quarter location"]
      },
      {
        id: "hp4",
        name: "Generator Paris",
        rating: 8.3,
        reviews: 21900,
        area: "Canal Saint-Martin",
        desc: "Vibrant design hostel with retro leather booths and a rooftop overlooking Sacré-Cœur.",
        price: 85,
        badge: "SOCIAL HOTSPOT",
        highlights: ["Rooftop sunset views", "Late night club lounge", "Private ensuite rooms", "Art gallery lobby"]
      }
    ]
  },
  "SIN": {
    city: "Singapore",
    hotels: [
      {
        id: "hs1",
        name: "Marina Bay Sands",
        rating: 9.5,
        reviews: 25400,
        area: "Marina Bay",
        desc: "The world's largest rooftop infinity pool spanning three massive skyscrapers.",
        price: 500,
        badge: "GLOBAL ICON",
        highlights: ["World's largest infinity pool", "Luxury casino access", "Gardens by the Bay walkway", "Celebrity chef row"]
      },
      {
        id: "hs2",
        name: "Capella Singapore",
        rating: 9.8,
        reviews: 2200,
        area: "Sentosa Island",
        desc: "Nestled in colonial heritage manors and rainforests on Sentosa Island.",
        price: 750,
        badge: "ISLAND SANCTUARY",
        highlights: ["Private plunge pools", "Peacocks in garden", "Auriga premium spa", "Direct beachfront access"]
      }
    ]
  }
};
export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    quote: "AeroLux redefined my standard for private transportation. The attention to detail on the Gulfstream G700 from Dubai to New York was pure perfection, with Michelin-starred catering and flawless Wi-Fi connectivity.",
    author: "Alexander R.",
    title: "Chief Executive Officer",
    location: "Dubai",
  },
  {
    quote: "Every single touchpoint was immaculate. Our anniversary flight to the Maldives felt utterly bespoke — from the floral styling inside the cabin to our direct yacht connection waiting at the terminal.",
    author: "Isabella M.",
    title: "HNWI Portfolio Investor",
    location: "Monaco",
  },
  {
    quote: "I have flown with almost every notable charter fleet over the last two decades. AeroLux operates in an entirely different league of service, safety, and operational discretion.",
    author: "Hiroshi T.",
    title: "Global Venture Chairman",
    location: "Tokyo",
  },
];
