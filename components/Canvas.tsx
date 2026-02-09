'use client';

// 1. Import React explicitly
import React, { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useCircuitStore } from '@/store/useCircuitStore';

// 2. Types for Wokwi Elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wokwi-arduino-uno': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; value?: string; label?: string }, HTMLElement>;
      'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { color?: string; label?: string }, HTMLElement>;
    }
  }
}

// --- HELPER: Calculate Pin Coordinates ---
// Returns percentage {x, y} relative to the Canvas center for the Arduino pins
// Assumes Arduino is centered (50%, 50%) and scaled to roughly 300x400px visual space
const getPinCoordinates = (pin: number) => {
  // Arduino Uno Layout Approximation:
  // Top Header (Pins 8-13): Located roughly at Y=42%
  // Bottom Header (Pins 0-7): Located roughly at Y=58%
  
  const centerX = 50; // Center of canvas in %
  const centerY = 50;
  
  const widthStep = 1.5; // Horizontal spacing between pins in %

  if (pin >= 8 && pin <= 13) {
    // Top Row: Pin 13 is Left, Pin 8 is Right
    // Map 8->13 to offsets
    const offset = (10.5 - pin) * widthStep; 
    return { x: centerX + offset - 4, y: centerY - 14 };
  } else {
    // Bottom Row: Pin 7 is Left, Pin 2 is Right
    // Map 7->0
    const offset = (3.5 - pin) * widthStep;
    return { x: centerX + offset + 4, y: centerY + 14 };
  }
};

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-zone' });
  const { isUnoPlaced, isLedPlaced, isBtnPlaced, ledPin, btnPin, pinLevels, setPinLevel } = useCircuitStore();

  const ledRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLElement>(null);

  // Load Wokwi Web Components
  useEffect(() => {
    import('@wokwi/elements');
  }, []);

  // Sync LED state
  useEffect(() => {
    if (ledRef.current) {
      ledRef.current.setAttribute('value', pinLevels[ledPin] === 'HIGH' ? 'true' : 'false');
    }
  }, [pinLevels, ledPin]);

  // Button Interaction
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || !isBtnPlaced) return;

    const press = () => setPinLevel(btnPin, 'HIGH');
    const release = () => setPinLevel(btnPin, 'LOW');

    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('touchstart', press);
    btn.addEventListener('touchend', release);

    return () => {
      btn.removeEventListener('mousedown', press);
      btn.removeEventListener('mouseup', release);
      btn.removeEventListener('touchstart', press);
      btn.removeEventListener('touchend', release);
    };
  }, [btnPin, setPinLevel, isBtnPlaced]);

  // --- DYNAMIC WIRING CALCULATION ---
  const ledCoords = getPinCoordinates(ledPin);
  const btnCoords = getPinCoordinates(btnPin);

  // Fixed positions of components (matching CSS below)
  const ledPos = { x: 90, y: 15 }; // Top-Right
  const btnPos = { x: 90, y: 85 }; // Bottom-Right

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full h-full min-h-[500px] border-2 border-dashed rounded-xl transition-colors overflow-hidden
        ${isOver ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-300'}`}
    >
      {/* 1. WIRING LAYER (SVG) - Rendered behind components */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* LED WIRE (Red) */}
        {isUnoPlaced && isLedPlaced && (
          <path
            d={`M ${ledCoords.x}% ${ledCoords.y}% C ${ledCoords.x + 10}% ${ledCoords.y}%, ${ledPos.x - 10}% ${ledPos.y}%, ${ledPos.x}% ${ledPos.y}%`}
            stroke="red"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="opacity-60"
          />
        )}
        
        {/* BUTTON WIRE (Green) */}
        {isUnoPlaced && isBtnPlaced && (
          <path
            d={`M ${btnCoords.x}% ${btnCoords.y}% C ${btnCoords.x + 10}% ${btnCoords.y}%, ${btnPos.x - 10}% ${btnPos.y}%, ${btnPos.x}% ${btnPos.y}%`}
            stroke="green"
            strokeWidth="3"
            fill="none"
            className="opacity-60"
          />
        )}
      </svg>

      {/* 2. EMPTY STATE */}
      {!isUnoPlaced && !isLedPlaced && !isBtnPlaced && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none z-10">
          Drag components here from the palette
        </div>
      )}

      {/* 3. ARDUINO UNO (Centered) */}
      {isUnoPlaced && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-90 z-10">
          <wokwi-arduino-uno />
        </div>
      )}

      {/* 4. LED (Top Right) */}
      {isLedPlaced && (
        <div className="absolute top-10 right-10 flex flex-col items-center z-10">
          <div className="p-2 bg-white/80 backdrop-blur rounded shadow-sm border">
            <wokwi-led ref={ledRef} color="red" label={`D${ledPin}`} />
          </div>
          <div className="mt-2 text-xs font-mono bg-black text-white px-2 py-1 rounded shadow-sm">
            LED → D{ledPin}
          </div>
        </div>
      )}

      {/* 5. BUTTON (Bottom Right) */}
      {isBtnPlaced && (
        <div className="absolute bottom-10 right-10 flex flex-col items-center z-10">
          <div className="p-2 bg-white/80 backdrop-blur rounded shadow-sm border cursor-pointer hover:bg-blue-50 transition-colors">
            <wokwi-pushbutton ref={btnRef} color="green" label={`D${btnPin}`} />
          </div>
          <div className="mt-2 text-xs font-mono bg-black text-white px-2 py-1 rounded shadow-sm">
            BTN → D{btnPin}
          </div>
        </div>
      )}
    </div>
  );
}