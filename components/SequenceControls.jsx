'use client';
import { ArrowDownAZ, ArrowUpZA, RotateCcw, Shuffle, Trash2 } from 'lucide-react';
import clsx from 'clsx';

function ControlButton({ onClick, icon: Icon, label, variant = 'default' }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
        variant === 'danger'
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 border border-gray-200 dark:border-gray-700'
      )}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );
}

export default function SequenceControls({ onSortAZ, onSortZA, onReverse, onReset, onClearAll, imageCount }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <ControlButton onClick={onSortAZ} icon={ArrowDownAZ} label="A → Z" />
      <ControlButton onClick={onSortZA} icon={ArrowUpZA} label="Z → A" />
      <ControlButton onClick={onReverse} icon={Shuffle} label="Reverse" />
      <ControlButton onClick={onReset} icon={RotateCcw} label="Reset Order" />
      {imageCount > 0 && (
        <ControlButton onClick={onClearAll} icon={Trash2} label="Clear All" variant="danger" />
      )}
    </div>
  );
}
