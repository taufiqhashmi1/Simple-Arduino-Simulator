'use client';

import dynamic from 'next/dynamic';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useCircuitStore } from '@/store/useCircuitStore';
import { PaletteItem } from '@/components/PaletteItem';
import { generateArduinoCode } from '@/lib/codeGenerator';
import { PinID } from '@/types/circuit';
import { useEffect, useState } from 'react';

const Canvas = dynamic(() => import('@/components/Canvas'), { ssr: false });

const VALID_PINS: PinID[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function Page() {
  const store = useCircuitStore();
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === 'canvas-zone') {
      store.placeComponent(event.active.id as any);
    }
  };

  const code = generateArduinoCode(store.ledPin, store.btnPin);
  const allPlaced = store.isUnoPlaced && store.isLedPlaced && store.isBtnPlaced;

  if (!isMounted) return <div className="p-10 text-slate-500">Loading Simulator...</div>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full flex-col bg-slate-100 overflow-hidden">
        
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-20">
          <h1 className="text-lg font-bold text-slate-800">Hashlab Arduino Simulator</h1>
          <div className="flex gap-3">
             {/* 1. AUTO-WIRE BUTTON */}
             <button
              onClick={store.toggleWiring}
              disabled={!allPlaced || store.isRunning}
              className={`px-4 py-2 text-sm font-bold border rounded transition-all flex items-center gap-2
                ${store.isWired 
                  ? 'bg-blue-100 text-blue-700 border-blue-300' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50'}`}
            >
              {store.isWired ? '✓ WIRED' : '+ AUTO-WIRE'}
            </button>

            {/* 2. CODE TOGGLE */}
            <button 
              onClick={store.toggleCodeView}
              className="px-4 py-2 text-sm font-medium border rounded bg-black"
            >
              {store.showCode ? 'Hide Code' : 'Show Code'}
            </button>

            {/* 3. SIMULATION TOGGLE */}
            <button
              onClick={store.toggleSimulation}
              disabled={!store.isWired} 
              className={`px-6 py-2 text-sm font-bold rounded transition-colors ${
                store.isRunning 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {store.isRunning ? 'STOP' : 'RUN'}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
           <aside className="w-64 bg-white border-r p-4 flex flex-col gap-4 shadow-sm z-10">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Components</h2>
            <PaletteItem id="arduino" label="Arduino Uno" disabled={store.isUnoPlaced} />
            <PaletteItem id="led" label="LED (Red)" disabled={store.isLedPlaced} />
            <PaletteItem id="pushbutton" label="Push Button" disabled={store.isBtnPlaced} />
            <div className="mt-auto border-t pt-4">
              <button onClick={store.resetCanvas} className="text-xs text-red-500 hover:underline">Reset Canvas</button>
            </div>
          </aside>

          <main className="flex-1 p-6 relative bg-slate-50 overflow-auto flex flex-col">
            <Canvas />
            
            {/* PIN CONFIGURATION - Only show if WIRED */}
            {store.isWired && (
              <div className="mt-4 p-4 bg-white rounded border flex gap-6 items-center shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <span className="text-sm font-bold text-slate-600">Pin Configuration:</span>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-black">LED Pin</label>
                  <select 
                    value={store.ledPin}
                    onChange={(e) => store.setPin('led', Number(e.target.value) as PinID)}
                    disabled={store.isRunning}
                    className="border rounded px-2 py-1 text-sm bg-black"
                  >
                    {VALID_PINS.filter(p => p !== store.btnPin).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-black">Button Pin</label>
                  <select 
                     value={store.btnPin}
                     onChange={(e) => store.setPin('btn', Number(e.target.value) as PinID)}
                     disabled={store.isRunning}
                     className="border rounded px-2 py-1 text-sm bg-black"
                  >
                    {VALID_PINS.filter(p => p !== store.ledPin).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            )}
          </main>

          {store.showCode && (
            <aside className="w-80 bg-slate-900 text-white flex flex-col border-l transition-all">
              <div className="p-3 border-b border-slate-700 font-mono text-xs text-slate-400">generated_firmware.ino</div>
              <pre className="flex-1 p-4 text-xs font-mono overflow-auto text-green-400 leading-relaxed">{code}</pre>
            </aside>
          )}
        </div>
      </div>
    </DndContext>
  );
}