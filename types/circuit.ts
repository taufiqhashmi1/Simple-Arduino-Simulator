export type PinID = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface CircuitState {
  // Placement State
  isUnoPlaced: boolean;
  isLedPlaced: boolean;
  isBtnPlaced: boolean;

  // Configuration State
  ledPin: PinID;
  btnPin: PinID;

  // Simulation State
  isWired: boolean;  
  isRunning: boolean;
  pinLevels: Record<PinID, 'HIGH' | 'LOW'>;
  
  // UI State
  showCode: boolean;
}