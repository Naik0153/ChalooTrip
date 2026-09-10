'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck,
  ArrowRight,
  Users,
  Baby,
  Wallet,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { BookingType, BookingRecord, VisitorTier } from '@/lib/types';
import { saveBooking } from '@/lib/bookings-store';
import { formatCurrency } from '@/lib/utils';
import { 
  detectWeb3Provider, 
  connectMetaMaskWallet, 
  processBlockchainPayment, 
  Web3PaymentResult 
} from '@/lib/web3-payment';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: BookingType;
  prefillData: any;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingType,
  prefillData,
  onBookingSuccess,
}) => {
  const [primaryName, setPrimaryName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [visitorTier, setVisitorTier] = useState<VisitorTier>(prefillData.visitorTier || 'family');
  const [adultsCount, setAdultsCount] = useState(visitorTier === 'family' ? 2 : 2);
  const [kidsCount, setKidsCount] = useState(visitorTier === 'family' ? 2 : 0);
  const [paymentMethod, setPaymentMethod] = useState<'blockchain' | 'upi' | 'card' | 'paylater'>('blockchain');
  const [cryptoCurrency, setCryptoCurrency] = useState<'ETH' | 'MATIC' | 'USDT'>('ETH');
  const [web3WalletAddress, setWeb3WalletAddress] = useState<string>('');
  const [hasWeb3Provider, setHasWeb3Provider] = useState<boolean>(false);
  const [blockchainResult, setBlockchainResult] = useState<Web3PaymentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // Check Web3 availability on mount
  useEffect(() => {
    detectWeb3Provider().then(res => {
      setHasWeb3Provider(res.available);
      if (res.account) setWeb3WalletAddress(res.account);
    });
  }, []);

  if (!isOpen) return null;

  const basePricePerPerson = prefillData.unitPrice || (prefillData.totalAmount ? Math.round(prefillData.totalAmount / (prefillData.passengersOrGuests || 1)) : 100);
  let calculatedTotal = basePricePerPerson * adultsCount;
  if (kidsCount > 0) {
    calculatedTotal += Math.round(basePricePerPerson * 0.5 * kidsCount);
  }
  if (visitorTier === 'group' && adultsCount >= 4) {
    calculatedTotal = Math.round(calculatedTotal * 0.85);
  }

  const handleConnectWallet = async () => {
    const res = await connectMetaMaskWallet();
    if (res.success && res.address) {
      setWeb3WalletAddress(res.address);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let txProof: Web3PaymentResult | undefined;
      const bookingRef = `CT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      if (paymentMethod === 'blockchain') {
        txProof = await processBlockchainPayment({
          amountInInr: calculatedTotal,
          cryptoCurrency,
          bookingRef,
          userAddress: web3WalletAddress,
        });
        setBlockchainResult(txProof);
      }

      const totalPeople = adultsCount + kidsCount;
      const newRecord = saveBooking({
        type: bookingType,
        title: prefillData.title || 'Chaloo Trip Fast-Track Ticket',
        destinationCity: prefillData.destinationCity || 'India',
        date: prefillData.date || new Date().toISOString().split('T')[0],
        timeSlot: prefillData.timeSlot || '06:30 AM - 08:30 AM',
        visitorTier,
        passengersOrGuests: totalPeople,
        visitorNames: [primaryName, ...(kidsCount > 0 ? [`+${kidsCount} Kids`] : []), ...(adultsCount > 1 ? [`+${adultsCount - 1} Adults`] : [])],
        totalAmount: calculatedTotal,
        currency: 'INR',
        crowdLevelAtBooking: 'Low',
        meta: {
          email,
          phone,
          visitorTier,
          adultsCount,
          kidsCount,
          paymentMethod: paymentMethod === 'blockchain' ? `Blockchain (${cryptoCurrency})` : paymentMethod.toUpperCase(),
          blockchainTxHash: txProof?.txHash,
          blockchainNetwork: txProof?.network,
          entryGate: 'VIP Gate 1 (Chaloo Fast-Track)',
          qrCodePayload: `CHALOO-${Date.now()}-${bookingRef}`,
        },
      });

      // Also persist to Next.js API database
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        });
      } catch (e) {}

      // Trigger celebration
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      setIsProcessing(false);
      setConfirmedBooking(newRecord);
      onBookingSuccess(newRecord);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  const copyHash = (hash: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(hash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow">
              CT
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {confirmedBooking ? 'Reservation Confirmed' : 'Instant Travel Reservation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {confirmedBooking ? 'Your e-pass and blockchain proof are ready' : 'Fast-track passes & Web3 secure payment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">E-Pass Confirmed!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  PNR: <span className="font-mono font-semibold text-red-600 dark:text-red-400">{confirmedBooking.bookingRef}</span>
                </p>
              </div>

              {/* Blockchain Receipt Banner */}
              {blockchainResult?.txHash && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-left space-y-1 text-xs">
                  <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-semibold">
                    <span className="flex items-center space-x-1.5">
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Web3 Blockchain Payment Verified</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 font-bold">
                      Block #{blockchainResult.blockNumber || 19845241}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/60 mt-1">
                    <span className="truncate pr-2">{blockchainResult.txHash}</span>
                    <button
                      type="button"
                      onClick={() => copyHash(blockchainResult.txHash)}
                      className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 shrink-0"
                      title="Copy TX Hash"
                    >
                      {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Destination:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{confirmedBooking.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Slot & Date:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{confirmedBooking.timeSlot} • {confirmedBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Guests:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{confirmedBooking.passengersOrGuests} Travelers ({visitorTier})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Total Paid:</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(confirmedBooking.totalAmount)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow transition"
                >
                  View My Tickets
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white font-medium text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleConfirm} className="space-y-4">
              
              {/* Destination Header Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{prefillData.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-red-500" /> {prefillData.date}
                    </span>
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {prefillData.timeSlot}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Total Amount</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(calculatedTotal)}</span>
                </div>
              </div>

              {/* Visitor Tier Selector */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-red-500" />
                  Booking Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'solo', label: 'Solo', desc: '1 Traveler' },
                    { id: 'couple', label: 'Couple', desc: '2 Travelers' },
                    { id: 'family', label: 'Family', desc: 'Kids 50% Off' },
                    { id: 'group', label: 'Group (4+)', desc: '15% Off' },
                  ].map(tier => (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => {
                        setVisitorTier(tier.id as VisitorTier);
                        if (tier.id === 'solo') { setAdultsCount(1); setKidsCount(0); }
                        if (tier.id === 'couple') { setAdultsCount(2); setKidsCount(0); }
                        if (tier.id === 'family') { setAdultsCount(2); setKidsCount(2); }
                        if (tier.id === 'group') { setAdultsCount(4); setKidsCount(0); }
                      }}
                      className={`p-2.5 rounded-xl text-left transition border text-xs ${
                        visitorTier === tier.id
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 dark:text-red-400 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div>{tier.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Passenger Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Adults (12+)
                  </label>
                  <select
                    value={adultsCount}
                    onChange={e => setAdultsCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map(n => (
                      <option key={n} value={n} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {n} {n === 1 ? 'Adult' : 'Adults'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center mb-1">
                    <Baby className="w-3.5 h-3.5 mr-1 text-amber-500" /> Kids (3-11)
                  </label>
                  <select
                    value={kidsCount}
                    onChange={e => setKidsCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4].map(n => (
                      <option key={n} value={n} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        {n} {n === 1 ? 'Kid (50% Off)' : n > 1 ? 'Kids (50% Off)' : 'No Kids'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visitor Contact details */}
              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Primary Traveler Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={primaryName}
                      onChange={e => setPrimaryName(e.target.value)}
                      placeholder="Full Name as on Govt ID"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">Email ID</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Payment Methods (Web3 Blockchain Featured) */}
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Select Secure Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('blockchain')}
                    className={`p-2 rounded-xl text-xs transition border flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === 'blockchain'
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Web3 Blockchain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-xl text-xs transition border flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl text-xs transition border flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Card / NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paylater')}
                    className={`p-2 rounded-xl text-xs transition border flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === 'paylater'
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Pay at Gate</span>
                  </button>
                </div>

                {/* Web3 Blockchain Details Box */}
                {paymentMethod === 'blockchain' && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Decentralized Escrow Contract</span>
                      </span>
                      <div className="flex space-x-1">
                        {(['ETH', 'MATIC', 'USDT'] as const).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCryptoCurrency(c)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              cryptoCurrency === c
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span>Connected Wallet:</span>
                      {web3WalletAddress ? (
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          {web3WalletAddress.substring(0, 6)}...{web3WalletAddress.slice(-4)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleConnectWallet}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Connect MetaMask / Web3
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Securing Reservation & Blockchain Proof...</span>
                  ) : (
                    <>
                      <span>Confirm & Secure Pass ({formatCurrency(calculatedTotal)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
