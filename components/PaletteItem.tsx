'use client';
import { useDraggable } from '@dnd-kit/core';

interface Props {
  id: string;
  label: string;
  disabled: boolean;
}

export function PaletteItem({ id, label, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 mb-2 rounded border text-sm font-bold cursor-grab active:cursor-grabbing shadow-sm
        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-blue-50 border-gray-300'}`}
    >
      {disabled ? `✓ ${label} Placed` : `:: ${label}`}
    </div>
  );
}