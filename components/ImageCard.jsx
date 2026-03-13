'use client';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react';
import { formatFileSize } from '@/utils/fileValidation';
import clsx from 'clsx';

export default function ImageCard({ image, index, total, onRemove, onMoveUp, onMoveDown, onMoveToPosition }) {
  const [posInput, setPosInput] = useState('');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handlePositionSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(posInput);
    if (!isNaN(num) && num >= 1 && num <= total) {
      onMoveToPosition(image.id, num);
    }
    setPosInput('');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 overflow-hidden group',
        isDragging
          ? 'shadow-2xl border-violet-400 scale-105 z-10 opacity-90'
          : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 shadow-sm hover:shadow-md'
      )}
    >
      {/* Sequence badge */}
      <div className="absolute top-2 left-2 z-10 bg-violet-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
        {index + 1}
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
        title="Remove image"
      >
        <X size={12} />
      </button>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing text-gray-400 hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.objectURL}
          alt={image.file.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-2 space-y-1">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate" title={image.file.name}>
          {image.file.name}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatFileSize(image.file.size)}</p>

        {/* Controls */}
        <div className="flex items-center gap-1 pt-1">
          <button
            onClick={() => onMoveUp(image.id)}
            disabled={index === 0}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => onMoveDown(image.id)}
            disabled={index === total - 1}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>

          {/* Position input */}
          <form onSubmit={handlePositionSubmit} className="flex items-center gap-1 ml-auto">
            <input
              type="number"
              min={1}
              max={total}
              value={posInput}
              onChange={(e) => setPosInput(e.target.value)}
              placeholder="#"
              className="w-10 text-xs text-center border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 bg-transparent focus:outline-none focus:border-violet-400 dark:focus:border-violet-500"
            />
            <button
              type="submit"
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
