import React from 'react';
import { Trash2, Palette } from 'lucide-react';
import { Z_INDEX } from '../../constants/app';

interface NoteToolbarProps {
  isStyling: boolean;
  onToggleStyling: () => void;
  onDelete: () => void;
}

const NoteToolbar: React.FC<NoteToolbarProps> = ({
  isStyling,
  onToggleStyling,
  onDelete
}) => {
  const handleButtonClick =
    (callback: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      callback();
    };

  return (
    <div
      className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ zIndex: Z_INDEX.NOTE_TOOLBAR }}
    >
      <button
        onClick={handleButtonClick(onToggleStyling)}
        className={`p-1.5 hover:bg-black/5 rounded-md transition-colors ${isStyling ? 'bg-gray-100' : ''}`}
        title="更换颜色"
        aria-label="更换便签颜色"
      >
        <Palette size={14} className="text-black/40" />
      </button>
      <button
        onClick={handleButtonClick(onDelete)}
        className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-red-500/60 hover:text-red-500"
        title="删除便签"
        aria-label="删除便签"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default NoteToolbar;
