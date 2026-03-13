'use client';
import { Play, StopCircle, Pause, Play as ResumeIcon, Languages } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { LANGUAGES } from '@/hooks/useOCR';
import clsx from 'clsx';

export default function OCRProcessor({
  imageCount,
  isProcessing,
  isPaused,
  progress,
  statusMessage,
  currentImageIndex,
  totalImages,
  timeRemaining,
  selectedLanguage,
  onLanguageChange,
  onStart,
  onCancel,
  onPause,
  onResume,
}) {
  const canStart = imageCount > 0 && !isProcessing;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Languages size={18} className="text-violet-500" />
          OCR Processing
        </h3>

        {/* Language selector */}
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-500 dark:text-gray-400 text-xs font-medium">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={isProcessing}
            className="border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress */}
      {isProcessing && (
        <ProgressBar
          percent={progress}
          statusMessage={statusMessage}
          currentIndex={currentImageIndex}
          total={totalImages}
          timeRemaining={timeRemaining}
          isPaused={isPaused}
        />
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {!isProcessing ? (
          <button
            onClick={onStart}
            disabled={!canStart}
            className={clsx(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
              canStart
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30 hover:scale-[1.02]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            <Play size={16} />
            Start OCR Extraction
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={onResume}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-green-500 hover:bg-green-600 text-white shadow transition-all"
              >
                <ResumeIcon size={16} />
                Resume
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-white shadow transition-all"
              >
                <Pause size={16} />
                Pause
              </button>
            )}
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-500 hover:bg-red-600 text-white shadow transition-all"
            >
              <StopCircle size={16} />
              Cancel
            </button>
          </>
        )}

        {imageCount === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Upload images to begin
          </p>
        )}
        {imageCount > 60 && (
          <div className="w-full mt-1 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
            ⚠️ More than 60 images loaded — consider splitting into smaller batches for best performance.
          </div>
        )}
      </div>
    </div>
  );
}
