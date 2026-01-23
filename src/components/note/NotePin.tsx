import React from 'react';
import { NoteColor } from '../../types';
import { getPuckColor } from '../../utils/noteHelpers';
import { Z_INDEX } from '../../constants/app';

interface NotePinProps {
  color: NoteColor;
}

const NotePin: React.FC<NotePinProps> = ({ color }) => {
  const puckColor = getPuckColor(color);

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none w-6 h-6 flex items-center justify-center"
      style={{ zIndex: Z_INDEX.NOTE_PIN }}
    >
      <div className="absolute inset-0 bg-black/50 blur-[1.5px] rounded-full scale-[0.7] translate-y-[1.5px]" />
      <div className="absolute inset-0 bg-black/15 blur-[5px] rounded-full translate-y-[3px] translate-x-[1px] scale-[0.9]" />
      <div
        className="w-full h-full rounded-full relative overflow-hidden flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,1) 0%, ${puckColor} 45%, ${puckColor} 75%, rgba(0,0,0,0.4) 100%)`,
          boxShadow: `inset 0 -1.5px 3px rgba(0,0,0,0.3), inset 0 1px 1.5px rgba(255,255,255,0.7)`,
          border: '0.5px solid rgba(0,0,0,0.05)'
        }}
      >
        <div className="absolute top-[12%] left-[12%] w-[45%] h-[45%] bg-gradient-to-br from-white/50 to-transparent rounded-full blur-[1px]" />
        <div className="absolute bottom-[8%] w-[70%] h-[15%] bg-white/30 rounded-full blur-[0.8px]" />
        <div className="absolute top-[22%] left-[28%] w-1 h-1 bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.6)]" />
      </div>
    </div>
  );
};

export default NotePin;
