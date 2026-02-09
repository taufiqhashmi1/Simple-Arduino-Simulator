export type PinID = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type ComponentType = 'arduino' | 'led' | 'pushbutton';

export interface CircuitState {
  // Placement State (Task 1)
  isUnoPlaced: boolean;
  isLedPlaced: boolean;
  isBtnPlaced: boolean;

  // Configuration State (Task 2)
  ledPin: PinID;
  btnPin: PinID;

  // Simulation State (Task 3)
  isRunning: boolean;
  pinLevels: Record<PinID, 'HIGH' | 'LOW'>;
  
  // UI State
  showCode: boolean;
}