import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wokwi-arduino-uno': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      'wokwi-led': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          color?: string;
          value?: string;
          label?: string;
        },
        HTMLElement
      >;

      'wokwi-pushbutton': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          color?: string;
          label?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
