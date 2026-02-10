'use client';
import { useDraggable } from '@dnd-kit/core';

interface Props {
  id: string;
  label: string;
  disabled: boolean;
}

const getItemConfig = (id: string) => {
  switch (id) {
    case 'arduino':
      return { 
        color: 'border-l-blue-500', 
        icon: (
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )
      };
    case 'led':
      return { 
        color: 'border-l-red-500', 
        icon: (
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      };
    case 'pushbutton':
      return { 
        color: 'border-l-green-500', 
        icon: (
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      };
    default:
      return { color: 'border-l-gray-400', icon: null };
  }
};

export function PaletteItem({ id, label, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled });
  const config = getItemConfig(id);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999, 
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative flex items-center gap-3 p-4 mb-3 rounded-lg border shadow-sm transition-all duration-200
        ${config.color} border-l-4
        ${disabled 
          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-70' 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md cursor-grab active:cursor-grabbing active:scale-105'
        }
      `}
    >
      {/* Drag Handle Icon */}
      {!disabled && (
        <div className="text-slate-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      )}

      {/* Item Icon */}
      <div className={`${disabled ? 'grayscale opacity-50' : ''}`}>
        {config.icon}
      </div>

      {/* Label & Status */}
      <div className="flex-1">
        <span className={`font-semibold text-sm ${disabled ? 'line-through' : 'text-slate-700'}`}>
          {label}
        </span>
      </div>

      {/* Checkmark for placed items */}
      {disabled && (
        <div className="text-green-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}