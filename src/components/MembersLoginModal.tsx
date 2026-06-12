import React, { useState, useRef, useEffect } from 'react';
import { Lock, X, Mail, Key, ShieldCheck, CornerDownRight, Signature, Eye, EyeOff, Sparkles, CheckCircle, Smartphone } from 'lucide-react';

interface MembersLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (memberName: string) => void;
}

export default function MembersLoginModal({ isOpen, onClose, onLoginSuccess }: MembersLoginModalProps) {
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [signConsent, setSignConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginStep, setLoginStep] = useState<'idle' | 'auth' | 'biometric' | 'authorized'>('idle');
  const [loadingText, setLoadingText] = useState('');

  if (!isOpen) return null;

  const handleHandshakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Verification check (Demo account credentials)
    const normUser = email.toLowerCase().trim();
    const isDocUser = normUser === 'member@aerolux.vip' && accessKey === 'obsidian';

    if (!signConsent) {
      setErrorMsg('Private electronic signature required for flight deck liaison handshake.');
      return;
    }

    // Let's allow either the correct demo account OR show an error
    if (isDocUser) {
      // Step-by-step luxurious biometric scan sequences
      setLoginStep('auth');
      setLoadingText('SECURE PROTOCOL Initiating. Verification with FBO terminal codes...');
      
      setTimeout(() => {
        setLoginStep('biometric');
        setLoadingText('BIOME KEYS: Scanning. Calibrating Retina credentials...');
      }, 1500);

      setTimeout(() => {
        setLoginStep('authorized');
        setLoadingText('VIP Handshake verified. Obsidian Access Key Approved.');
      }, 3500);

      setTimeout(() => {
        onLoginSuccess('VIP Member Roosevelt');
        onClose();
        // Reset states
        setLoginStep('idle');
        setEmail('');
        setAccessKey('');
        setSignConsent(false);
      }, 5000);

    } else {
      setErrorMsg('Invalid liaison clearance. Enter demo credentials listed below.');
    }
  };

  // Quick fill button helper
  const handleUseDemoClearance = () => {
    setEmail('member@aerolux.vip');
    setAccessKey('obsidian');
    setSignConsent(true);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="members-login-modal">
      
      {/* Container holding our beautiful Obsidian Card widget */}
      <div className="bg-[#0b090e] border border-gold-primary/45 rounded-2xl w-full max-w-lg p-6 md:p-8 relative shadow-[0_20px_50px_rgba(201,168,76,0.15)] overflow-hidden">
        
        {/* Soft aesthetic background gold gradient light glows */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-gold-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#411964]/5 rounded-full filter blur-3xl pointer-events-none" />

        {/* Global Modal Close Control */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-gray hover:text-[#E8C97A] transition-colors focus:outline-none cursor-pointer p-1.5 rounded-full bg-white/5 border border-white/5 group z-50"
          id="close-login-modal-button"
        >
          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        {/* Idle Form view state */}
        {loginStep === 'idle' ? (
          <div className="space-y-6 relative z-10">
            {/* Header Identity */}
            <div className="text-center space-y-1.5">
              <div className="mx-auto w-12 h-12 bg-gold-primary/10 border border-gold-primary/30 text-gold-primary flex items-center justify-center rounded-full mb-3 shadow-[0_4px_15px_rgba(201,168,76,0.1)]">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-accent tracking-[0.3em] text-[#C9A84C] text-[10px] uppercase font-bold block">AEROLUX GATEWAY</span>
              <h3 className="font-display text-2xl font-light text-warm-white italic">Elite Member Executive Liaison</h3>
              <p className="text-xs text-muted-gray font-light max-w-sm mx-auto">
                Enter your confidential private credentials to log FBO repoints, review fractional logs, and unlock Obsidian class benefits.
              </p>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg text-rose-300 text-xs font-mono select-none flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 animate-ping" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Inputs Form */}
            <form onSubmit={handleHandshakeSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1">
                <label className="font-accent text-[9.5px] tracking-widest text-[#E8C97A] uppercase block">
                  VIP Corporate Email:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]/45" />
                  <input
                    type="email"
                    required
                    placeholder="E.G. EXECUTIVE@AEROLUX.VIP"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-gold-muted/25 focus:border-gold-primary rounded-xl pl-10 pr-4 py-3 text-xs font-mono tracking-widest text-warm-white uppercase focus:ring-1 focus:ring-gold-primary/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Secure Liaison Key */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-accent text-[9.5px] tracking-widest text-[#E8C97A] uppercase block">
                    Access Code / Key:
                  </label>
                  <span className="text-[8.5px] font-mono text-muted-gray">FAA STAGE-4 LOG</span>
                </div>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]/45" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    required
                    placeholder="ENTER CONFIDENTIAL CODE"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full bg-black/60 border border-gold-muted/25 focus:border-gold-primary rounded-xl pl-10 pr-11 py-3 text-xs font-mono tracking-widest text-warm-white uppercase focus:ring-1 focus:ring-gold-primary/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-gray hover:text-gold-light p-1"
                    aria-label={showKey ? "Hide code" : "Show code"}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Simulated Private Digital Signature Pad Consent Toggle */}
              <div className="bg-black/40 border border-gold-muted/10 p-3.5 rounded-xl space-y-2 select-none">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sign-consent"
                    checked={signConsent}
                    onChange={(e) => setSignConsent(e.target.checked)}
                    className="accent-gold-primary h-3.5 w-3.5 rounded-sm border-gold-muted bg-neutral-900 focus:ring-0 focus:outline-none cursor-pointer"
                  />
                  <label htmlFor="sign-consent" className="text-[10px] font-mono text-warm-white/90 cursor-pointer flex items-center gap-1.5 uppercase tracking-wide">
                    <Signature className="w-3.5 h-3.5 text-[#C9A84C]" />
                    Register Private Digital Signature
                  </label>
                </div>
                <p className="text-[8.5px] font-mono text-muted-gray pl-6 uppercase">
                  Checking this logs your military-grade private signature to verify single-handshake flight clearance logs.
                </p>
              </div>

              {/* Submitting Handshake Action */}
              <button
                type="submit"
                className="w-full google-oval-btn-filled py-4 font-accent text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
                id="handshake-submit-button"
              >
                <span>Initiate Security Clearance</span>
                <CornerDownRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quiet gold info box featuring test account logs */}
            <div className="bg-[#1c1813] border border-[#C9A84C]/30 rounded-xl p-4 space-y-2">
              <span className="font-accent tracking-widest text-[9px] text-[#C9A84C] font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AeroLux Liaison Test Clearance Codes
              </span>
              <p className="text-[10px] font-body text-warm-white/70 leading-relaxed">
                To simulate elite level liaison authorization, please make sure to use these credentials:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-[#C9A84C]/10 pt-2 text-[#E8C97A]">
                <div>
                  <span className="text-muted-gray block uppercase text-[8px]">EMAIL PORT:</span>
                  <span>member@aerolux.vip</span>
                </div>
                <div>
                  <span className="text-muted-gray block uppercase text-[8px]">SECURITY KEY CODE:</span>
                  <span>obsidian</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUseDemoClearance}
                className="w-full mt-2 text-center text-[10px] font-accent text-gold-light hover:text-gold-primary google-oval-btn py-2.5 uppercase transition-all"
              >
                Bypass & Auto-Fill Demo Token
              </button>
            </div>
          </div>
        ) : (
          /* Scanning Sequences state */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 animate-fade-in z-10 relative">
            
            {/* Visual Indicator Scan Graphic animation */}
            <div className="relative w-28 h-28 flex items-center justify-center bg-black border border-[#C9A84C]/30 rounded-full shadow-[0_0_20px_rgba(201,168,76,0.1)] overflow-hidden">
              {/* Rotating biometric tracker */}
              <div className="absolute inset-2 border-2 border-dashed border-[#C9A84C]/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              
              {/* Laser scanner grid overlay lines */}
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#C9A84C] animate-pulse filter blur-[1px]" />
              
              {loginStep === 'auth' && (
                <ShieldCheck className="w-10 h-10 text-gold-light animate-bounce" />
              )}
              {loginStep === 'biometric' && (
                <Smartphone className="w-10 h-10 text-gold-light animate-pulse" />
              )}
              {loginStep === 'authorized' && (
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              )}
            </div>

            {/* Progression details labels */}
            <div className="space-y-2">
              <span className="font-mono text-xs text-gold-primary uppercase tracking-widest block font-semibold animate-pulse">
                {loginStep === 'authorized' ? 'ACCESS APPROVED' : 'HANDSHAKE CLEARANCE PENDING'}
              </span>
              <p className="text-sm font-display text-warm-white leading-relaxed">
                {loadingText}
              </p>
            </div>

            {/* Glowing operations details widget */}
            <div className="font-mono text-[9px] text-[#C9A84C]/60 space-y-1 border-t border-[#C9A84C]/10 pt-4 w-full">
              <div>DEVICE IP GATEWAY: INGRESS_SECURE</div>
              <div>VERIFICATION STATUS: LOCK_{loginStep.toUpperCase()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
