'use client';

import React, { useEffect, useState } from 'react';
import { 
  Printer, 
  Download, 
  Share2, 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  X
} from 'lucide-react';
import { BookingRecord } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface TicketVoucherProps {
  booking: BookingRecord;
  onClose?: () => void;
}

export const TicketVoucher: React.FC<TicketVoucherProps> = ({ booking, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQr = async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const payload = `YATRA_VERIFIED_TICKET:${booking.bookingRef}:${booking.title}:${booking.date}:${booking.timeSlot}`;
        const url = await QRCode.toDataURL(payload, { width: 220, margin: 1 });
        setQrCodeUrl(url);
      } catch (e) {
        console.warn('QR generation error:', e);
      }
    };
    generateQr();
  }, [booking]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden max-w-2xl mx-auto print:border-none print:shadow-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-yatra-navy via-slate-900 to-yatra-navy text-white p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yatra-red to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md">
            CT
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-tight">Chaloo<span className="text-yatra-red">Trip</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-600 rounded-full text-white">
                VIP Fast-Track Pass
              </span>
            </div>
            <span className="text-xs text-slate-300">Official Smart Travel Boarding Voucher</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition text-xs font-bold flex items-center space-x-1.5"
            title="Print Voucher"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Ticket Details & Tear-Off Divider */}
      <div className="p-6 space-y-6">
        {/* Main Reference Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Official Booking Reference (PNR)
            </span>
            <span className="text-2xl font-black text-yatra-red tracking-wider font-mono">
              {booking.bookingRef}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-300 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Active
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Metadata Grid */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Destination / Attraction
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {booking.title}
              </h3>
              <div className="flex items-center text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{booking.destinationCity}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Date
                </span>
                <span className="text-xs font-black text-slate-800 flex items-center mt-0.5">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-yatra-red" />
                  {booking.date}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Entry Slot
                </span>
                <span className="text-xs font-black text-slate-800 flex items-center mt-0.5">
                  <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {booking.timeSlot || 'Anytime Slot'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Lead Passenger / Visitor
                </span>
                <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                  {booking.visitorNames?.[0] || 'Primary Visitor'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {booking.passengersOrGuests} Visitor{booking.passengersOrGuests > 1 ? 's' : ''} total
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Amount Paid
                </span>
                <span className="text-xs font-black text-slate-900 mt-0.5 block">
                  {formatCurrency(booking.totalAmount, booking.currency)}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Taxes & Fees Paid</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <b>AI Crowd Advantage:</b> This pass is scheduled during low-density visiting hours. Present this QR code directly at the automated turnstiles or security check.
              </div>
            </div>
          </div>

          {/* Right QR Code Scanner Card */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="E-Ticket QR Code" className="w-full h-full object-contain" />
              ) : (
                <QrCode className="w-24 h-24 text-slate-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-2">
              Scan at Entrance Gate
            </span>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5">
              {booking.bookingRef}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Customer Helpline: 1800 102 9900 • support@yatra.com</span>
          <span>Issued by Crowdy & Yatra Travel Systems</span>
        </div>
      </div>
    </div>
  );
};
