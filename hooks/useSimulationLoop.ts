import { useEffect, useRef } from 'react';
import { useCircuitStore } from '@/store/useCircuitStore';

export const useSimulationLoop = () => {
  const { isRunning, btnPin, ledPin, pinLevels, setPinLevel } = useCircuitStore();
  const stateRef = useRef({ btnPin, ledPin, pinLevels });

  useEffect(() => {
    stateRef.current = { btnPin, ledPin, pinLevels };
  }, [btnPin, ledPin, pinLevels]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = setInterval(() => {
      const { btnPin, ledPin, pinLevels } = stateRef.current;

      // 1. Read Input (Simulated Hardware)
      const btnState = pinLevels[btnPin];

      // 2. Execute Logic (The Arduino Code Logic)
      // Logic: If Button is High, LED is High. Else Low.
      const targetLedState = btnState === 'HIGH' ? 'HIGH' : 'LOW';

      // 3. Write Output
      if (pinLevels[ledPin] !== targetLedState) {
        setPinLevel(ledPin, targetLedState);
      }
    }, 50); // 20Hz refresh rate

    return () => clearInterval(tick);
  }, [isRunning, setPinLevel]);
};