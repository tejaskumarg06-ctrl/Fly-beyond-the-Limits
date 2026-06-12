import { useState } from 'react';
import { Sparkles, Check, CreditCard } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../data';

export default function MembershipTiers() {
  const [activeTier, setActiveTier] = useState<number>(2); // Default to Obsidian
  const [userNameInput, setUserNameInput] = useState('MARCUS VANCE');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  return (
    <div className="w-full bg-[#0e0d16] border border-[#00B2FF]/15 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Controller inputs and membership card builder */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="font-accent tracking-widest text-[#FFD0B4] text-xs uppercase block mb-1">AEROLUX EMBARK CARD</span>
            <h4 className="font-display text-2xl md:text-3xl text-warm-white">Global Capital Command</h4>
            <p className="text-xs text-muted-gray mt-2">
              Bespoke member designations enable instantaneous flight dispatch, zero positioning surcharges, and complimentary FBO transfers.
            </p>
          </div>

          {/* User Name Preview Tool */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono tracking-widest text-[#005F99] uppercase font-bold">Customize Embark Card Holder</label>
            <input
              type="text"
              maxLength={22}
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value.toUpperCase())}
              placeholder="ENTER CARDHOLDER NAME"
              className="w-full bg-[#141221] border border-white/5 focus:border-[#00B2FF] rounded-[1.5rem] px-5 py-2.5 text-xs font-mono tracking-widest text-[#FFD0B4] uppercase focus:outline-none placeholder-muted-gray/50"
            />
          </div>

          {/* Interactive Membership Mock Card Preview with Google-style cross-fade */}
          <div 
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="group relative h-52 w-full max-w-sm mx-auto cursor-pointer select-none overflow-hidden rounded-[2rem] border border-[#00B2FF]/20 hover:border-[#FFD0B4]/60 transition-all duration-500 shadow-xl"
            id="membership-mock-card-container"
          >
            {/* Glowing assist back shadow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00B2FF]/5 to-[#FFD0B4]/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />

            {/* FRONT SIDE */}
            <div 
              className={`absolute inset-0 h-full w-full p-6 flex flex-col justify-between bg-[#141221] transition-all duration-500 ease-in-out ${
                isCardFlipped ? 'opacity-0 translate-y-4 pointer-events-none scale-95' : 'opacity-100 translate-y-0 scale-100 z-10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-accent text-[11px] tracking-widest text-[#00B2FF] font-bold">AEROLUX</span>
                  <span className="text-[7px] font-mono text-muted-gray tracking-wider">PRIVATE FLEET NETWORK</span>
                </div>
                {/* Smart Card Chip */}
                <div className="w-8 h-6 bg-gradient-to-tr from-[#005F99] via-[#7AD9FF] to-[#00B2FF] rounded opacity-85 shadow border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-x-2 top-2 h-[1px] bg-white/20" />
                  <div className="absolute inset-x-2 bottom-2 h-[1px] bg-white/20" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[7px] font-mono text-muted-gray tracking-widest block uppercase">MEMBER TIER EXCLUSION</span>
                <span className="font-accent text-sm tracking-widest text-warm-white font-bold block">
                  {MEMBERSHIP_TIERS[activeTier].name}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[7px] font-mono text-muted-gray tracking-widest block uppercase">AUTHORIZED CLIENT</span>
                  <span className="font-mono text-[10px] tracking-widest text-[#FFD0B4] uppercase truncate max-w-[200px] block font-semibold">
                    {userNameInput || 'MARCUS VANCE'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[7px] font-mono text-muted-gray block">MEMBER ID</span>
                  <span className="font-mono text-[9px] text-warm-white tracking-wider">AL-90{activeTier}2-847</span>
                </div>
              </div>
            </div>

            {/* BACK SIDE */}
            <div 
              className={`absolute inset-0 h-full w-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#0c0a0f] to-[#120f18] transition-all duration-500 ease-in-out ${
                !isCardFlipped ? 'opacity-0 -translate-y-4 pointer-events-none scale-95' : 'opacity-100 translate-y-0 scale-100 z-10'
              }`}
            >
              <div className="space-y-4">
                <div className="w-full h-8 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 justify-end">
                  <span className="font-accent text-[10px] text-[#FFD0B4] italic tracking-widest font-semibold">{userNameInput || 'Marcus Vance'}</span>
                </div>
                <p className="text-[7px] font-mono text-muted-gray leading-normal">
                  This card remains the private operational property of AeroLux Aviation. Use constitutes absolute compliance with global FAA Section 135 flight safety mandates, private cabin terms, and confidential positioning procedures.
                </p>
              </div>

              <div className="flex justify-between items-end border-t border-[#00B2FF]/10 pt-3">
                <span className="text-[8px] font-mono text-[#00B2FF]">24/7 Concierge Hotline: +1 (800) AEROLUX</span>
                <span className="text-[8px] font-mono text-[#005F99]">EST. 2009</span>
              </div>
            </div>

            {/* Interactive Sweep Sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out z-30 pointer-events-none" />
          </div>

          <p className="text-[10px] font-mono text-center text-muted-gray">Click card to view details (smooth Google cross-fade transition)</p>
        </div>

        {/* Right Side: Tier comparisons and Perks listing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs header selector - Styled as Squircle Tab */}
          <div className="flex flex-col sm:flex-row gap-3 bg-black/40 p-2 border border-[#00B2FF]/15 rounded-[2rem]">
            {MEMBERSHIP_TIERS.map((tier, idx) => (
              <button
                key={tier.name}
                type="button"
                onClick={() => { setActiveTier(idx); setIsCardFlipped(false); }}
                className={`flex-1 text-left p-3.5 px-5 rounded-[1.5rem] border transition-all cursor-pointer ${
                  activeTier === idx 
                    ? 'google-oval-btn-filled text-[#0c0a0f] shadow-md border-[#00B2FF]' 
                    : 'google-oval-btn text-muted-gray hover:text-warm-white bg-transparent border-transparent'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-accent text-xs font-bold tracking-widest block">{tier.name}</span>
                  {idx === 2 && <Sparkles className="w-3 h-3 text-[#FFD0B4]" />}
                </div>
                <span className="text-[10px] font-mono text-muted-gray block">{tier.tagline}</span>
              </button>
            ))}
          </div>

          {/* Current selected tier perks detailed breakdown - Styled as Squircle Box */}
          <div className="bg-black/20 p-6 rounded-[2rem] border border-[#00B2FF]/10 space-y-4">
            <div className="flex justify-between items-end pb-3 border-b border-[#00B2FF]/15">
              <div>
                <span className="text-[10px] font-mono text-[#005F99] uppercase block font-semibold">Staged Capital Level</span>
                <span className="text-xl font-bold font-mono text-[#FFD0B4]">{MEMBERSHIP_TIERS[activeTier].price}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-gray uppercase">Refundable on balance</span>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-accent tracking-widest text-[#FFD0B4] uppercase font-bold block mb-1">
                EXEMPT PRIVILEGES & INCLUSIONS:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="membership-perks-list">
                {MEMBERSHIP_TIERS[activeTier].perks.map((perk, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs font-body text-warm-white">
                    <span className="w-4 h-4 rounded-full bg-[#00B2FF]/10 border border-[#00B2FF]/30 text-[#00B2FF] flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className="leading-tight text-muted-gray group-hover:text-warm-white">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#00B2FF]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[10px] font-mono text-muted-gray">Requires accredited HNWI verification.</span>
              <button 
                onClick={() => alert(`A secure verification secure token has been sent to check credentials for ${userNameInput || 'your account'}.`)}
                className="google-oval-btn-filled text-[#0c0a0f] font-accent tracking-widest text-[10px] font-bold px-6 py-3 uppercase"
                id="apply-for-membership-button"
              >
                Initiate Membership Access →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
