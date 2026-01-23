import React from 'react';
import { Z_INDEX } from '../../constants/app';

interface NoteResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
}

const MIN_SIZE = 180;

const NoteResizeHandle: React.FC<NoteResizeHandleProps> = ({ onResizeStart }) => {
  return (
    <div
      onMouseDown={onResizeStart}
      className="absolute bottom-1 right-1 cursor-nwse-resize p-1.5 opacity-0 group-hover:opacity-40 transition-opacity hover:opacity-100"
      style={{ zIndex: Z_INDEX.NOTE_RESIZE_HANDLE }}
      aria-label="Resize note"
    >
      <svg viewBox="0 0 1024 1024" width="12" height="12" className="fill-black/60">
        <path d="M768 0h256v256H768zM768 384h256v256H768zM384 384h256v256H384zM768 768h256v256H768zM384 768h256v256H384zM0 768h256v256H0z" />
      </svg>
    </div>
  );
};

export default NoteResizeHandle;
