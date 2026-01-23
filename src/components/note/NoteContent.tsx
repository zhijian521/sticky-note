import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Note } from '../../types';
import { NOTE_TEXT_CLASSES } from '../../constants/note';
import { Z_INDEX } from '../../constants/app';
import { formatDate } from '../../utils/noteHelpers';

interface NoteContentProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}

const NoteContent: React.FC<NoteContentProps> = ({ note, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate({ text: tempText });
    setIsEditing(false);
  };

  return (
    <div
      className="relative flex-grow flex flex-col overflow-hidden"
      style={{ zIndex: Z_INDEX.NOTE_CONTENT }}
    >
      {note.imageUrl ? (
        <div className="relative w-full h-40 mb-3 group/img shrink-0">
          <img
            src={note.imageUrl}
            alt="Note Content"
            className="w-full h-full object-cover rounded shadow-inner"
          />
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { imageUrl, ...rest } = note;
              onUpdate(rest);
            }}
            className="absolute top-1 right-1 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : null}

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={tempText}
          onChange={e => setTempText(e.target.value)}
          onBlur={handleSave}
          className={`${NOTE_TEXT_CLASSES} flex-grow h-full`}
          placeholder="Write something..."
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={`${NOTE_TEXT_CLASSES} flex-grow whitespace-pre-wrap cursor-text overflow-hidden`}
        >
          {note.text || (
            <span className="opacity-30 font-normal italic text-sm">
              Tap to edit...
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 shrink-0">
        <span className="text-[10px] font-normal uppercase tracking-wider text-black/20">
          {formatDate(note.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteContent;
