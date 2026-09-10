'use client';

import React, { useState } from 'react';
import { Sparkles, Bell, BellRing, Check, Clock, ArrowRight } from 'lucide-react';
import { BestTimeSlot, Destination } from '@/lib/types';

interface BestTimeCardProps {
  bestSlots: BestTimeSlot[];
  destination?: Destination;
  destinationName?: string;
  onBookSlot?: (slot: BestTimeSlot) => void;
}

export const BestTimeCard: React.FC<BestTimeCardProps> = ({
  bestSlots,
  destination,
  destinationName,
  onBookSlot,
}) => {
  const destName = destination?.name || destinationName || 'Destination';
  const destImage = destination?.image || '';

  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const handleEnableNotification = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('Browser notifications not supported in this environment.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationEnabled(true);
        setNotificationStatus(`Alert active! You'll be notified when crowd drops at ${destName}.`);

        // Send confirmation notification
        new Notification(`Crowd Alert Set for ${destName}`, {
          body: `We'll ping you when crowd score drops below 35% during optimal visiting slots!`,
          icon: destImage || undefined,
        });

        setTimeout(() => setNotificationStatus(null), 5000);
      } else {
        setNotificationStatus('Notification permission was denied in browser settings.');
      }
    } catch (e) {
      setNotificationStatus('Unable to request notification permission.');
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/10 pb-4 mb-5">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yatra-red" />
            AI Best Time Recommender
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Optimal time windows calculated to beat tourist queues at {destName}
          </p>
        </div>

        {/* Remind Me button in Glass */}
        <button
          onClick={handleEnableNotification}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition border backdrop-blur-md shadow-sm ${
            notificationEnabled
              ? 'glass-badge-green'
              : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-yatra-red border-white/80 dark:border-white/10'
          }`}
        >
          {notificationEnabled ? (
            <>
              <BellRing className="w-3.5 h-3.5 text-emerald-600 animate-bounce-subtle" />
              <span>Reminder Active</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Remind Me When Less Crowded</span>
            </>
          )}
        </button>
      </div>

      {notificationStatus && (
        <div className="mb-4 p-3 rounded-2xl backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* Grid of Recommended Slots in Frosted Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bestSlots.map((slot, index) => {
          const isLowest = index === 0;

          return (
            <div
              key={index}
              className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 glass-card glass-card-hover ${
                isLowest
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent'
                  : ''
              }`}
            >
              {isLowest && (
                <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Best Choice</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    {slot.slot}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-2.5">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      slot.crowdLevel === 'Low'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {slot.crowdLevel} Density
                  </span>
                  {slot.savingsLabel && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {slot.savingsLabel}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {slot.reason}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {slot.recommendationTag}
                </span>

                {onBookSlot && (
                  <button
                    onClick={() => onBookSlot(slot)}
                    className="text-xs font-black text-yatra-red dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center space-x-1 transition group"
                  >
                    <span>Reserve Slot</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
