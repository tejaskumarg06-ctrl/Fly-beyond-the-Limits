import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Compass, Shield, Activity, RefreshCw, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  {
    label: "🏖️ 5-Day Maldives Itinerary",
    prompt: "Draft a bespoke 5-day itinerary to the Maldives. Include a Gulfstream G700 flight from NYC, direct VIP yacht transfer, and exclusive private island recommendations."
  },
  {
    label: "🏎️ 14 Pax Flight to Monaco F1",
    prompt: "I need to coordinate travel for 14 executive passengers to Monaco for the GP. Recommend the best heavy aircraft (Bombardier Global 7500 or Airbus ACJ320) and helipad transfers."
  },
  {
    label: "❄️ Aspen Luxury Ski Chalet",
    prompt: "Recommend ultra-exclusive fireside ski chalets adjacent to the Aspen FBO (KASE) with private chef and armored vehicle setups."
  }
];

export default function AITripPlanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Welcome back, Admiral. I am your AeroLux Elite Travel Liaison. How can I assist you in plotting your next luxury voyage, selecting an airborne flagship, or coordinating direct water and ground transfers?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorText, setErrorText] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [narratorEnabled, setNarratorEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize SpeechRecognition on load if available
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setErrorText('');
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            setInputText(transcript);
            // Automatically send the message
            handleSendMessage(transcript);
          }
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorText('Microphone permission is currently blocked. To use voice chat, please click the microphone icon in your browser address bar to allow access, or try opening this application in a new tab using the "Open Window" button in the top right.');
          } else if (event.error === 'network') {
            setErrorText('Network error encountered during voice recognition. Please confirm your internet connection.');
          } else {
            setErrorText(`Voice input: No speech detected. Please speak clearly into your microphone.`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.warn('Speech recognition instantiation failed:', err);
      }
    }

    // Clean up speaking on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      setErrorText('Voice narration (TTS) is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel(); // kill active speech to prevent overlap

    // Clear Markdown tags or list dots/emojis from speech for natural vocalization
    const cleanText = text
      .replace(/[\#\*\_`\-\uD800-\uDFFF]/g, '') // remove markdown/emojis
      .replace(/https?:\/\/\S+/g, '') // remove urls
      .replace(/[0-9]+\.\s/g, ''); // clean list numbers for smoother flow

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    // Try selecting a premium english/narrator voice if possible
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || 
                        voices.find(v => v.lang.startsWith('en-')) || 
                        voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const triggerFeatureTour = () => {
    stopSpeaking();
    const tourText = `Welcome to AeroLux! I am pleased to tell you about our website's core features in simple words:
    
    First, the Custom Air Charters tool lets you search, buy, and schedule flights on-demand.
    
    Second, our Interactive Radar Map lets you target and select terminal pins directly on the 3D World Map.
    
    Third, the Live Flight Operations tracker registers real-time airborne flights in active airspace.
    
    Fourth, the Luxury destination listings pair curated ultra-villas and hotels with custom 4K pictures of Tokyo, London, Paris, and Singapore.
    
    Fifth, the Private Jet Fleet section compares cabin spaces and specs of jets like the Gulfstream G700 and Airbus ACJ329neo.
    
    And sixth, our elite Card Membership system provides special VIP perks for Silver, Black, and Gold card members.
    
    I hope that was a helpful overview! How can I assist you with your flight schedule or custom itinerary today?`;

    const botMessage: ChatMessage = {
      id: `tour-${Date.now()}`,
      role: 'assistant',
      text: tourText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMessage]);
    speakText(tourText);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // High-end offline client fallback content based on user input keywords
  const getClientOfflineBespokeReply = (msg: string): string => {
    const raw = msg.toLowerCase();
    if (raw.includes("tokyo")) {
      return `### 🇯🇵 TOKYO DIRECTIVES (LOCAL SECURE CHANNELS)
Greetings, Admiral. Your targeted flight coordinates to **Tokyo Haneda (RJTT)** have been locked with our Prestige client-side backup.

*   **Bespoke Airframe:** We have designated a *Gulfstream G700* departing from your preferred FBO terminal with custom flight crew.
*   **Stay Partners:** Exclusive accommodations are pre-arranged in partnership with the exquisite **Aman Tokyo** or the high-altitude **Park Hyatt Tokyo** presidential suite.
*   **Private Ground Liaison:** A dedicated executive transport chauffeur with private security detail will be on standby immediately upon touchdown at Haneda.

Please confirm if you would like me to lock these flight coordinates and arrange terminal clearances.`;
    }
    if (raw.includes("london")) {
      return `### 🇬🇧 LONDON STATION LOGS (LOCAL SECURE CHANNELS)
Coordinates for **London Luton/Farnborough (EGGW/EGLF)** have been mapped into our local client telemetry system.

*   **Flight Dispatch:** A direct positioning leg in our *Bombardier Global 7500* has been drafted for immediate crew clearance.
*   **Stay Partners:** Enjoy bespoke arrangements at **The Savoy** or **Rosewood London**, featuring round-the-clock dedicated butler service.
*   **FBO Services:** Signature Flight Support at London Luton is briefed to grant your private diplomatic party expedited curbside arrivals.

How would you like to structure your departure timings?`;
    }
    if (raw.includes("paris")) {
      return `### 🇫🇷 PARIS COMMAND POST (LOCAL SECURE CHANNELS)
Your private voyage parameters to **Paris Le Bourget (LFPB)** have been registered.

*   **Airframe Selection:** We recommend our ultra-long-range *Bombardier Global 7500* or customized *Airbus ACJ329neo* for optimal trans-Atlantic dining space.
*   **Stay Partners:** Exquisite arrangements can be made at **Four Seasons Hotel George V** or **Hôtel de Crillon**, with VIP Michelin-starred dining priority.
*   **Helicopter Transfer:** On-demand helipad transfers are pre-cleared to transport you directly to private châteaux or seaside estates.

Are there any specific catering or vintage champagne preferences to register for your flight cabin?`;
    }
    if (raw.includes("singapore")) {
      return `### 🇸🇬 SINGAPORE VIP DISPATCH (LOCAL SECURE CHANNELS)
Your luxury connection to **Singapore Changi (WSSS)** is ready for local offline flight clearance.

*   **Fleet Suggestion:** Our fleet's high-efficiency flagship, the *Gulfstream G700*, is available for long-range oceanic routing.
*   **Stay Partners:** Confirmed partnerships are active with **Marina Bay Sands** (Infinity Pool Suite access) or the tranquil sanctuary of **Capella Singapore** along Sentosa.
*   **Pre-Arrival VIP:** Speed through customs using our private AeroLux VIP terminal arrivals gate with custom courier clearance.

Would you like our FBO operators to initiate the final flight manifest?`;
    }
    if (raw.includes("maldives")) {
      return `### 🇲🇻 MALDIVES PRIVATE ATOLL (LOCAL SECURE CHANNELS)
Your private tropical coordinates for **Malé (VRMM)** are drafted in our local offline database.

*   **Flight Route:** Direct private flight from your origin terminal to our exclusive partner luxury seaplane transfers.
*   **Stay Partners:** Private island villas at **Soneva Jani** or **One&Only Reethi Rah** pre-configured with dedicated personal concierges.
*   **Private Yacht:** Direct VIP boarding to our chartered 80-meter yacht for deep ocean exploration.

Shall we coordinate custom catering options for your charter?`;
    }
    if (raw.includes("fleet") || raw.includes("g700") || raw.includes("aircraft") || raw.includes("jet") || raw.includes("bombardier") || raw.includes("falcon")) {
      return `### ✈️ AEROLUX OPERATIONAL FLEET SPECS
Our operational fleet remains fully pre-cleared for elite member flight plans:

*   **Gulfstream G700:** The pinnacle of cabin speed, offering dual living zones and the lowest pressure cabin altitude in its class.
*   **Bombardier Global 7500:** Ideal for long routing, equipped with a full master bedroom, stand-up shower, and dedicated chef galley.
*   **Dassault Falcon 10X:** Feature-rich widebody configuration, engineered for transoceanic luxury voyages.
*   **Airbus ACJ329neo:** Perfect for boardroom delegations, with executive meeting spaces and quietest decibel rating.

Which elite airframe configuration is appropriate for your flight party?`;
    }
    if (raw.includes("feature") || raw.includes("tour") || raw.includes("help") || raw.includes("what can you do") || raw.includes("how to use")) {
      return `### 🎙️ AEROLUX CORE CAPABILITIES & SERVICES
AeroLux stands as the top tier of private flight routing. Here is an overview of our layout and operations:

1.  **Direct Booking Planner:** Enter flight routes, choose custom cabin specs, configure catering, and generate private agreements instantly.
2.  **3D World Map Radar:** Click on targeted city nodes to lock coordinates and display flight trajectories.
3.  **AeroLux Live Operations:** A live tracking screen mapped to active mock flights with altitude telemetry.
4.  **Pairing Hotels:** High-end listings combining world-class hotels in Tokyo, London, Paris, and Singapore.
5.  **Elite Membership Tiers:** Upgrade cards (Silver, Black, Gold) to reveal unique flight and hotel rate terms.

I am prepared to assist you with any of these systems. What coordinates shall we explore?`;
    }
    return `### 🛰️ AUXILIARY COMMUNICATIONS LINK ACTIVE
Greetings, Admiral. Your instructions have been processed locally by our AeroLux Prestige client-side database.

*   **Active Telemetry:** Mapped to safe private FBO airfields.
*   **VIP Clearance:** Fully certified FAA Part 135 fleets are standing by.

We are ready to coordinate coordinates for **Tokyo, London, Paris, Singapore, and Maldives** or provide details about our high-performance fleet (*Gulfstream G700*, *Bombardier Global 7500*, etc.). Please let me know how we should coordinate your global travel route target!`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setErrorText('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Map existing messages into required model role syntax for back-and-forth history conversation context
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Connection failure with the VIP concierge server.");
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      // Automatically speak replies if voice narrator is enabled!
      if (narratorEnabled) {
        speakText(data.text);
      }

    } catch (err: any) {
      console.warn("Liaison connection offline or overloaded. Activating client-side intelligence fallback:", err);
      
      // Let the user know we're in high-volume offline backup mode
      setErrorText("AeroLux secure auxiliary link engaged — server connection offline or overloaded. Active telemetry continues.");

      const fallbackText = getClientOfflineBespokeReply(textToSend);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot-fallback`,
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);

      if (narratorEnabled) {
        speakText(fallbackText);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleResetChat = () => {
    if (window.confirm("Do you wish to log off your confidential travel session?")) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: "Confidential session loaded. Welcome back, Admiral. How can I assist you in plotting your next luxury voyage or choosing an airborne flagship?",
          timestamp: 'Just now'
        }
      ]);
      setErrorText('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] font-sans" id="ai-trip-planner-widget">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black border-2 border-[#C9A84C] hover:border-[#E8C97A] text-gold-primary hover:text-gold-light p-4 rounded-full shadow-[0_10px_30px_rgba(201,168,76,0.25)] flex items-center justify-center relative cursor-pointer group active:scale-95 transition-all animate-bounce"
          style={{ animationDuration: '3s' }}
          id="chat-toggle-anchor"
          aria-label="Open AI Trip Companion"
        >
          {/* Unseen badge indicating AI concierge activity */}
          <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-emerald-500 rounded-full border border-black flex items-center justify-center text-[7.5px] font-mono font-bold text-black animate-pulse">
            AI
          </span>
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-accent text-[10px] tracking-widest font-bold uppercase pl-0 group-hover:pl-2 whitespace-nowrap">
            Elite AI Planner
          </span>
        </button>
      )}

      {/* Floating vertical Chat Cabinet */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[550px] bg-[#0c0a0f] border-2 border-[#C9A84C]/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden relative animate-fade-in">
          
          {/* Content Backdrop light accent filter */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1d122b]/30 via-transparent to-transparent pointer-events-none" />

          {/* Floating Widget Header */}
          <div className="bg-[#09070b] border-b border-[#C9A84C]/25 p-4 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-black animate-ping" />
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-black" />
                <div className="bg-gold-primary/10 border border-gold-primary/35 text-gold-primary p-1.5 rounded-full">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-accent tracking-widest text-[#E8C97A] text-[10.5px] font-bold uppercase">AEROLUX VIP LIAISON</span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-mono px-1.5 py-0.2 rounded">LIVE SECURE</span>
                </div>
                <p className="text-[8.5px] font-mono text-muted-gray uppercase tracking-wider">AI Automated Flight Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Speaker Text Narrator Toggle */}
              <button
                onClick={() => {
                  const newVal = !narratorEnabled;
                  setNarratorEnabled(newVal);
                  if (!newVal) {
                    stopSpeaking();
                  } else {
                    // Speak the latest bot reply to give instant gratification
                    const lastBotMsg = [...messages].reverse().find(m => m.role === 'assistant');
                    if (lastBotMsg) speakText(lastBotMsg.text);
                  }
                }}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  narratorEnabled 
                    ? 'text-[#00B2FF] bg-[#00B2FF]/10 border-[#00B2FF]/30' 
                    : 'text-muted-gray bg-white/5 border-white/5 hover:text-warm-white'
                }`}
                title={narratorEnabled ? "Mute automatic read-aloud" : "Enable automatic read-aloud"}
              >
                {narratorEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetChat}
                className="text-muted-gray hover:text-gold-light p-1.5 rounded bg-white/5 border border-white/5 transition-colors cursor-pointer"
                title="Clear liaison log"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => { stopSpeaking(); setIsOpen(false); }}
                className="text-muted-gray hover:text-gold-light p-1.5 rounded bg-white/5 border border-white/5 transition-colors cursor-pointer"
                id="close-chat-cabinet-button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Equalizer Speaking Wave overlay when Speech Synthesis is active */}
          {isSpeaking && (
            <div className="mx-4 mt-3 bg-[#00B2FF]/10 border border-[#00B2FF]/25 rounded-2xl p-3 flex items-center justify-between text-[10.5px] font-mono animate-fade-in relative z-20">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-5 pb-1">
                  <span className="w-1 h-3 bg-[#00B2FF] rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '0.8s' }} />
                  <span className="w-1 h-4.5 bg-[#FFD0B4] rounded-full animate-bounce" style={{ animationDelay: '0.15s', animationDuration: '0.6s' }} />
                  <span className="w-1 h-3.5 bg-[#00B2FF] rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.9s' }} />
                  <span className="w-1 h-2 bg-[#FFD0B4] rounded-full animate-bounce" style={{ animationDelay: '0.45s', animationDuration: '0.7s' }} />
                </div>
                <span className="text-warm-white tracking-widest font-black uppercase text-[8.5px]">Speaker routing is active</span>
              </div>
              <button 
                onClick={stopSpeaking}
                className="bg-black/60 hover:bg-black/80 border border-[#FFD0B4]/30 hover:border-[#FFD0B4]/60 text-[#FFD0B4] px-3 py-1 rounded-full text-[8.5px] uppercase tracking-wider font-extrabold cursor-pointer transition-all active:scale-95"
              >
                Mute Audio
              </button>
            </div>
          )}

          {/* Messages list view */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 min-h-0 bg-[#070508]/40">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Sender Avatar */}
                  <div className={`p-1.5 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    isUser 
                      ? 'bg-neutral-800 border-neutral-700 text-warm-white' 
                      : 'bg-gold-primary/10 border-gold-primary/30 text-gold-primary'
                  }`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed whitespace-pre-line font-body ${
                      isUser 
                        ? 'bg-neutral-900 border border-neutral-850 text-warm-white rounded-tr-none' 
                        : 'bg-[#120f16] border border-[#C9A84C]/15 text-warm-white font-light rounded-tl-none pr-3 container-bullet-formatting'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`block font-mono text-[7px] text-muted-gray ${isUser ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulated Live Typing Progress */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%] animate-pulse">
                <div className="p-1.5 h-7 w-7 rounded-full flex items-center justify-center bg-gold-primary/10 border border-gold-primary/30 text-gold-primary flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div className="space-y-1">
                  <div className="p-3 bg-black/40 border border-[#C9A84C]/20 rounded-2xl rounded-tl-none text-[10.5px] font-mono text-[#C9A84C] flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#C9A84C] animate-ping" />
                    <span>Liaison is drafting tailored coordinates...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error indicators */}
            {errorText && (
              <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-rose-300 text-[10px] font-mono space-y-1">
                <p className="font-bold">CONCIERGE LINK LOST:</p>
                <p>{errorText}</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick presets area (Visible if message history is minimal to jumpstart user) */}
          {messages.length < 3 && !isTyping && (
            <div className="p-3 bg-[#09070a] border-t border-[#C9A84C]/15 space-y-2.5 relative z-10 select-none">
              <span className="text-[9px] font-accent tracking-widest text-[#FFD0B4] uppercase font-bold block">
                Confidential Voice Assistant option:
              </span>
              
              {/* Tour trigger in simple words with audio */}
              <button
                onClick={triggerFeatureTour}
                className="w-full text-left bg-gradient-to-r from-[#00B2FF]/15 to-[#FFD0B4]/15 hover:from-[#00B2FF]/25 hover:to-[#FFD0B4]/25 border border-[#00B2FF]/40 rounded-2xl py-3 px-4 transition-all duration-300 cursor-pointer text-xs flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(0,178,255,0.15)] group hover:scale-[1.01]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-gradient-to-br from-[#00B2FF] to-[#FFD0B4] rounded-xl text-black shadow-md relative">
                    <svg 
                      className="w-3.5 h-3.5 text-black animate-thunder" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M19 11h-6V3a1 1 0 0 0-1.895-.448l-8 14A1 1 0 0 0 4 18h6v6a1 1 0 0 0 1.895.448l8-14A1 1 0 0 0 19 11z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="font-accent tracking-[0.08em] font-black text-[#00B2FF] block text-[9.5px]">🎙️ PLAY AUDIO FEATURE TOUR</span>
                    <span className="text-[8.5px] text-muted-gray block truncate">Explains our layout and interface in simple words</span>
                  </div>
                </div>
                <div className="h-1.5 w-1.5 bg-[#FFD0B4] rounded-full animate-ping mr-1" />
              </button>

              <div className="h-[0.5px] bg-[#C9A84C]/15 w-full my-1" />

              <span className="text-[9px] font-accent tracking-widest text-gold-muted uppercase font-bold block">
                Suggested Private Itineraries:
              </span>
              <div className="flex flex-col gap-1.5">
                {PRESET_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.prompt)}
                    className="w-full text-left bg-black hover:bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-full py-2 px-4 transition-all cursor-pointer font-accent truncate text-[9.5px] text-[#F2EDE8]/80 hover:text-gold-light"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input text form footer with Mic for true voice chat */}
          <form 
            onSubmit={handleSubmit}
            className="p-3 bg-[#070508] border-t border-[#C9A84C]/25 flex gap-2 relative z-10 items-center"
            id="chat-input-form"
          >
            {recognitionRef.current && (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  if (isListening) {
                    recognitionRef.current?.stop();
                  } else {
                    recognitionRef.current?.start();
                  }
                }}
                className={`p-3 rounded-full aspect-square w-11 h-11 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md border transition-all ${
                  isListening 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse scale-105' 
                    : 'bg-black/60 border-[#C9A84C]/30 text-[#E8C97A] hover:border-gold-primary hover:text-white'
                }`}
                title={isListening ? "Listening... click to pause" : "Activate microphone click-to-speak"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Mic className="w-4 h-4 text-[#FFD0B4]" />
                )}
              </button>
            )}

            <input
              type="text"
              required
              placeholder={isListening ? "LISTENING FOR VOICE INPUT..." : "ASK LIAISON CHATBOT..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-black/60 border border-gold-muted/20 focus:border-gold-primary rounded-full px-5 py-3.5 text-xs font-mono tracking-widest text-[#E8C97A] uppercase focus:outline-none placeholder-muted-gray/50 text-warm-white"
            />
            <button
              type="submit"
              disabled={isTyping || !inputText.trim()}
              className="google-oval-btn-filled text-black p-3.5 rounded-full aspect-square w-11 h-11 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 shadow-md"
              id="chat-send-message-button"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
