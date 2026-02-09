import { create } from 'zustand';
import { CircuitState, PinID } from '@/types/circuit';

interface CircuitActions {
  placeComponent: (type: 'arduino' | 'led' | 'pushbutton') => void;
  resetCanvas: () => void;
  setPin: (component: 'led' | 'btn', pin: PinID) => void;
  toggleSimulation: () => void;
  toggleCodeView: () => void;
  setPinLevel: (pin: PinID, level: 'HIGH' | 'LOW') => void;
}

const INITIAL_PINS = {
  2: 'LOW', 3: 'LOW', 4: 'LOW', 5: 'LOW', 6: 'LOW', 
  7: 'LOW', 8: 'LOW', 9: 'LOW', 10: 'LOW', 11: 'LOW', 
  12: 'LOW', 13: 'LOW'
} as const;

export const useCircuitStore = create<CircuitState & CircuitActions>((set, get) => ({
  // Task 1: Initial Placement State
  isUnoPlaced: false,
  isLedPlaced: false,
  isBtnPlaced: false,

  // Task 2: Mandatory Defaults (LED -> 10, Btn -> 2)
  ledPin: 10,
  btnPin: 2,

  // Task 3: Simulation State
  isRunning: false,
  pinLevels: { ...INITIAL_PINS },
  showCode: false,

  placeComponent: (type) => {
    if (type === 'arduino') set({ isUnoPlaced: true });
    if (type === 'led') set({ isLedPlaced: true });
    if (type === 'pushbutton') set({ isBtnPlaced: true });
  },

  resetCanvas: () => set({ 
    isUnoPlaced: false, isLedPlaced: false, isBtnPlaced: false, 
    isRunning: false, pinLevels: { ...INITIAL_PINS } 
  }),

  setPin: (component, newPin) => {
    const state = get();
    // Task 2 Constraint: Prevent Duplicate Assignment
    if (component === 'led' && state.btnPin === newPin) return; 
    if (component === 'btn' && state.ledPin === newPin) return;

    set({ [component === 'led' ? 'ledPin' : 'btnPin']: newPin });
  },

  toggleSimulation: () => set((state) => {
    if (!state.isUnoPlaced || !state.isLedPlaced || !state.isBtnPlaced) return state; // Only run if complete
    if (state.isRunning) return { isRunning: false, pinLevels: { ...INITIAL_PINS } };
    return { isRunning: true };
  }),

  toggleCodeView: () => set((state) => ({ showCode: !state.showCode })),

  setPinLevel: (pin, level) => set((state) => ({
    pinLevels: { ...state.pinLevels, [pin]: level }
  })),
}));