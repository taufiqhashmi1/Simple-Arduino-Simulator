'use client';

import dynamic from 'next/dynamic';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useCircuitStore } from '@/store/useCircuitStore';
import { PaletteItem } from '@/components/PaletteItem';
import { generateArduinoCode } from '@/lib/codeGenerator';
import { useSimulationLoop } from '@/hooks/useSimulationLoop';
import { PinID } from '@/types/circuit';
import { useEffect, useState } from 'react'; // Import hooks

// Dynamic import for Wokwi (SSR False)
const Canvas = dynamic(() => import('@/components/Canvas'), { ssr: false });

const VALID_PINS: PinID[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function Page() {
  const store = useCircuitStore();
  useSimulationLoop();

  // HYDRATION FIX: Detect if we are on the client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === 'canvas-zone') {
      const type = event.active.id as 'arduino' | 'led' | 'pushbutton';
      store.placeComponent(type);
    }
  };

  const code = generateArduinoCode(store.ledPin, store.btnPin);

  // Prevent hydration mismatch by not rendering DndContext on the server
  if (!isMounted) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-100 text-slate-500">Loading Simulator...</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd} id="unique-dnd-id">
      <div className="flex h-screen w-full flex-col bg-slate-100 overflow-hidden">
        
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm z-10">
          <h1 className="text-lg font-bold text-slate-800">OSHW Screening Task: Arduino Sim</h1>
          <div className="flex gap-3">
            <button 
              onClick={store.toggleCodeView}
              className="px-4 py-2 text-sm font-medium border rounded hover:bg-slate-50"
            >
              {store.showCode ? 'Hide Code' : 'Show Code'}
            </button>
            <button
              onClick={store.toggleSimulation}
              disabled={!store.isUnoPlaced || !store.isLedPlaced || !store.isBtnPlaced}
              className={`px-6 py-2 text-sm font-bold rounded transition-colors ${
                store.isRunning 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {store.isRunning ? 'STOP' : 'START'}
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* PALETTE */}
          <aside className="w-64 bg-white border-r p-4 flex flex-col gap-4 shadow-sm z-10">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Components</h2>
            <PaletteItem id="arduino" label="Arduino Uno" disabled={store.isUnoPlaced} />
            <PaletteItem id="led" label="LED (Red)" disabled={store.isLedPlaced} />
            <PaletteItem id="pushbutton" label="Push Button" disabled={store.isBtnPlaced} />
            
            <div className="mt-auto border-t pt-4">
              <button onClick={store.resetCanvas} className="text-xs text-red-500 hover:underline">
                Reset Canvas
              </button>
            </div>
          </aside>

          {/* CANVAS */}
          <main className="flex-1 p-6 relative bg-slate-50 overflow-auto flex flex-col">
            <Canvas />

            {/* PIN CONFIGURATION */}
            {(store.isLedPlaced && store.isBtnPlaced) && (
              <div className="mt-4 p-4 bg-white rounded border flex gap-6 items-center shadow-sm">
                <span className="text-sm font-bold text-slate-600">Pin Configuration:</span>
                
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono">LED Pin</label>
                  <select 
                    value={store.ledPin}
                    onChange={(e) => store.setPin('led', Number(e.target.value) as PinID)}
                    disabled={store.isRunning}
                    className="border rounded px-2 py-1 text-sm bg-slate-50"
                  >
                    {VALID_PINS.filter(p => p !== store.btnPin).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono">Button Pin</label>
                  <select 
                     value={store.btnPin}
                     onChange={(e) => store.setPin('btn', Number(e.target.value) as PinID)}
                     disabled={store.isRunning}
                     className="border rounded px-2 py-1 text-sm bg-slate-50"
                  >
                    {VALID_PINS.filter(p => p !== store.ledPin).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </main>

          {/* CODE VIEW */}
          {store.showCode && (
            <aside className="w-80 bg-slate-900 text-white flex flex-col border-l transition-all">
              <div className="p-3 border-b border-slate-700 font-mono text-xs text-slate-400">
                generated_firmware.ino
              </div>
              <pre className="flex-1 p-4 text-xs font-mono overflow-auto text-green-400 leading-relaxed">
                {code}
              </pre>
            </aside>
          )}

        </div>
      </div>
    </DndContext>
  );
}