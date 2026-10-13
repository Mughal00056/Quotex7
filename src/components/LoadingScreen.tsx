import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 300);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#050811] flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none select-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Ambient glow behind logo */}
        <div className="absolute w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />

        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-2xl flex items-center justify-center mb-4">
          <div className="w-full h-full bg-[#080d16] rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              QX
            </span>
          </div>
        </div>

        <div className="text-base font-black tracking-wider text-white">
          QUOTEX <span className="text-cyan-400">PRO</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 font-medium">
          Connecting to Real-time Market Feeds...
        </div>

        {/* Loading bar */}
        <div className="w-40 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
};
