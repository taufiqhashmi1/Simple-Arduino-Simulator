import { create } from 'zustand';
import { CircuitState, PinID } from '@/types/circuit';

interface CircuitActions {
  placeComponent: (type: 'arduino' | 'led' | 'pushbutton') => void;
  resetCanvas: () => void;
  setPin: (component: 'led' | 'btn', pin: PinID) => void;
  toggleSimulation: () => void;
  toggleCodeView: () => void;
  toggleWiring: () => void;
  setLedState: (isOn: boolean) => void;
}

const getInitialPins = () => {
  const pins: any = {};
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach(p => pins[p] = 'LOW');
  return pins;
};

export const useCircuitStore = create<CircuitState & CircuitActions>((set, get) => ({
  isUnoPlaced: false,
  isLedPlaced: false,
  isBtnPlaced: false,
  isWired: false,
  ledPin: 10,
  btnPin: 2,
  isRunning: false,
  
  pinLevels: getInitialPins(), 
  showCode: false,

  placeComponent: (type) => {
    if (type === 'arduino') set({ isUnoPlaced: true });
    if (type === 'led') set({ isLedPlaced: true });
    if (type === 'pushbutton') set({ isBtnPlaced: true });
  },

  resetCanvas: () => set({ 
    isUnoPlaced: false, isLedPlaced: false, isBtnPlaced: false, 
    isRunning: false, isWired: false, 
    pinLevels: getInitialPins() 
  }),

  setPin: (component, newPin) => {
    const state = get();
    const cleanLevels = { ...state.pinLevels, [newPin]: 'LOW' };
    set({ 
      [component === 'led' ? 'ledPin' : 'btnPin']: newPin,
      pinLevels: cleanLevels
    });
  },

  toggleSimulation: () => set((state) => {
    if (state.isRunning) {
      return { isRunning: false, pinLevels: getInitialPins() };
    }
    return { isRunning: true };
  }),

  toggleWiring: () => set((state) => ({ isWired: !state.isWired })),
  toggleCodeView: () => set((state) => ({ showCode: !state.showCode })),

  setLedState: (isOn) => set((state) => ({
    pinLevels: { ...state.pinLevels, [state.ledPin]: isOn ? 'HIGH' : 'LOW' }
  })),
}));