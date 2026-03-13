'use client';
import clsx from 'clsx';

export default function ProgressBar({ percent, statusMessage, currentIndex, total, timeRemaining, isPaused }) {
  const formatTime = (sec) => {
    if (sec === null || sec === undefined) return '';
    if (sec < 60) return `~${sec}s remaining`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `~${m}m ${s}s remaining`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className={clsx(
          'font-medium truncate max-w-[70%]',
          isPaused ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'
        )}>
          {isPaused ? '⏸ Paused — ' : ''}{statusMessage}
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-xs ml-2 shrink-0">
          {formatTime(timeRemaining)}
        </span>
      </div>
      <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            isPaused ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'
          )}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{currentIndex} / {total} images</span>
        <span>{Math.round(percent)}%</span>
      </div>
    </div>
  );
}
