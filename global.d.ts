import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wokwi-arduino-uno': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        color?: string;
        value?: string | number | boolean;
        label?: string;
      }, HTMLElement>;
      'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        color?: string;
        label?: string;
        value?: string | number | boolean;
      }, HTMLElement>;
      // Add any other components like wokwi-resistor or wokwi-lcd here
    }
  }
}