'use client';

import React, { useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useCircuitStore } from '@/store/useCircuitStore';

const getPinCoords = (pin: number) => {
  const centerX = 50; 
  const centerY = 50;
  const pinSpacing = 1.45;

  if (pin >= 8 && pin <= 13) {
    const index = 13 - pin;
    return { x: centerX - 8.2 + (index * pinSpacing), y: centerY - 15.5 };
  } 
  
  if (pin >= 0 && pin <= 7) {
    const index = 7 - pin; 
    return { x: centerX - 8.2 + (index * pinSpacing), y: centerY + 15.5 };
  }
  return { x: centerX, y: centerY };
};

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-zone' });
  
  const { 
    isUnoPlaced, isLedPlaced, isBtnPlaced, 
    ledPin, btnPin, pinLevels, 
    isWired, isRunning, 
    setLedState 
  } = useCircuitStore();

  const ledRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import('@wokwi/elements');
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || !isBtnPlaced) return;

    const press = () => {
      if (isRunning) setLedState(true);
    };

    const release = () => {
      setLedState(false);
    };

    btn.addEventListener('mousedown', press);
    btn.addEventListener('touchstart', press); 
    window.addEventListener('mouseup', release);
    window.addEventListener('touchend', release);

    return () => {
      btn.removeEventListener('mousedown', press);
      btn.removeEventListener('touchstart', press);
      window.removeEventListener('mouseup', release);
      window.removeEventListener('touchend', release);
    };
  }, [isRunning, isBtnPlaced, setLedState]);

  const isLedOn = isRunning && isWired && pinLevels[ledPin] === 'HIGH';

  useEffect(() => {
    if (ledRef.current) {
      (ledRef.current as any).value = isLedOn;
    }
  }, [isLedOn, isLedPlaced]);

  const ledStart = getPinCoords(ledPin);
  const btnStart = getPinCoords(btnPin);
  
  const ledEnd = { x: 80, y: 18 }; 
  const btnEnd = { x: 80, y: 82 };

  return (
    <div
      ref={setNodeRef}
      className={`
        relative w-full h-full min-h-[600px] rounded-xl transition-all duration-300 overflow-hidden shadow-inner
        ${isOver ? 'bg-blue-50/50 border-2 border-blue-400' : 'bg-slate-100 border-2 border-slate-300 border-dashed'}
      `}
    >
      {/* 1. Wiring Layer */}
      {isWired && isUnoPlaced && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          {isLedPlaced && (
            <g>
              {/* Wire Path */}
              <path
                d={`M ${ledStart.x}% ${ledStart.y}% Q 60% ${ledEnd.y}%, ${ledEnd.x}% ${ledEnd.y}%`}
                stroke={isLedOn ? "#FF0000" : "#991b1b"} 
                strokeWidth="4" fill="none" strokeLinecap="round"
                className="transition-colors duration-200"
              />
              {/* Start Connection Point (Arduino) */}
              <circle cx={`${ledStart.x}%`} cy={`${ledStart.y}%`} r="3" fill="#991b1b" />
              {/* End Connection Point (LED Module) */}
              <circle cx={`${ledEnd.x}%`} cy={`${ledEnd.y}%`} r="4" fill={isLedOn ? "#FF0000" : "#991b1b"} stroke="white" strokeWidth="2" />
            </g>
          )}
          {isBtnPlaced && (
            <g>
              {/* Wire Path */}
              <path
                d={`M ${btnStart.x}% ${btnStart.y}% Q 60% ${btnEnd.y}%, ${btnEnd.x}% ${btnEnd.y}%`}
                stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round"
              />
              {/* Start Connection Point (Arduino) */}
              <circle cx={`${btnStart.x}%`} cy={`${btnStart.y}%`} r="3" fill="#15803d" />
              {/* End Connection Point (Button Module) */}
              <circle cx={`${btnEnd.x}%`} cy={`${btnEnd.y}%`} r="4" fill="#15803d" stroke="white" strokeWidth="2" />
            </g>
          )}
        </svg>
      )}

      {/* 2. Empty State Placeholder */}
      {!isUnoPlaced && !isLedPlaced && !isBtnPlaced && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none select-none">
          <div className="w-24 h-24 border-4 border-slate-300 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-medium text-lg">Empty Workbench</p>
          <p className="text-sm opacity-75">Drag components here to start building</p>
        </div>
      )}

      {/* 3. Arduino Uno (Center) */}
      {isUnoPlaced && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-90 transition-transform duration-300" 
          style={{ zIndex: 10, filter: 'drop-shadow(0 10px 15px rgb(0 0 0 / 0.15))' }}
        >
          <wokwi-arduino-uno />
        </div>
      )}

      {/* 4. LED Module (Top Right) */}
      {isLedPlaced && (
        <div 
          className="absolute top-8 right-16 flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500" 
          style={{ zIndex: 10 }}
        >
           {/* Visual Container Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden min-w-[140px]">
            <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Output</span>
              <div className={`w-2 h-2 rounded-full ${isLedOn ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-slate-300'}`} />
            </div>
            <div className="p-4 flex justify-center bg-slate-50/50">
              <wokwi-led 
                ref={ledRef} 
                color="red" 
                label={`D${ledPin}`} 
              />
            </div>
            <div className="bg-red-50 px-3 py-1.5 border-t border-red-100 flex justify-center">
               <span className="font-mono text-[10px] text-red-800 font-bold">PIN: D{ledPin}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Button Module (Bottom Right) */}
      {isBtnPlaced && (
        <div 
          className="absolute bottom-8 right-16 flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500" 
          style={{ zIndex: 10 }}
        >
          {/* Visual Container Card */}
          <div 
            className={`
              bg-white rounded-xl shadow-lg border overflow-hidden min-w-[140px] transition-all duration-200
              ${isRunning 
                ? 'border-green-200 shadow-green-100 hover:shadow-green-200 hover:-translate-y-1' 
                : 'border-slate-200 opacity-80'
              }
            `}
          >
            <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Input Control</span>
              {isRunning && <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>}
            </div>

            <div 
              className={`p-4 flex justify-center bg-slate-50/50 
                ${isRunning ? 'cursor-pointer active:scale-95 transition-transform' : 'cursor-not-allowed grayscale-[0.5]'}
              `}
            >
              <wokwi-pushbutton ref={btnRef} color="green" label={`D${btnPin}`} />
            </div>

            <div className={`px-3 py-1.5 border-t flex justify-center ${isRunning ? 'bg-green-50 border-green-100' : 'bg-slate-100 border-slate-200'}`}>
               {!isRunning ? (
                 <span className="font-mono text-[10px] text-slate-500 font-bold flex items-center gap-1">
                   ⚠ SIM STOPPED
                 </span>
               ) : (
                 <span className="font-mono text-[10px] text-green-800 font-bold">PIN: D{btnPin}</span>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}