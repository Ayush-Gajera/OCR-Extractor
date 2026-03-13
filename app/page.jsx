'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ScanText, ImageIcon, Info, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import ImageUploader from '@/components/ImageUploader';
import SequenceControls from '@/components/SequenceControls';
import OCRProcessor from '@/components/OCRProcessor';
import ExportButtons from '@/components/ExportButtons';
import { useImageSequence } from '@/hooks/useImageSequence';
import { useOCR } from '@/hooks/useOCR';
import toast from 'react-hot-toast';
import clsx from 'clsx';

// Dynamically imported to avoid SSR issues with dnd-kit
const ImageGrid = dynamic(() => import('@/components/ImageGrid'), { ssr: false });
const TextOutput = dynamic(() => import('@/components/TextOutput'), { ssr: false });

const DEMO_IMAGES = [
  '/demo-images/sample1.png',
  '/demo-images/sample2.png',
  '/demo-images/sample3.png',
];

export default function Home() {
  const {
    images,
    addImages,
    removeImage,
    reorderImages,
    moveImage,
    moveToPosition,
    sortAZ,
    sortZA,
    reverseOrder,
    resetOrder,
    clearAll,
  } = useImageSequence();

  const {
    isProcessing,
    isPaused,
    progress,
    statusMessage,
    currentImageIndex,
    totalImages,
    sections,
    timeRemaining,
    processImages,
    cancel,
    pause,
    resume,
    reset: resetOCR,
    setSections,
  } = useOCR();

  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [combined, setCombined] = useState(false);
  const [activeTab, setActiveTab] = useState('images'); // 'images' | 'output' (mobile tabs)

  const handleFilesAdded = useCallback(
    (files) => {
      const count = addImages(files);
      return count;
    },
    [addImages]
  );

  const handleStartOCR = useCallback(async () => {
    if (images.length === 0) return;
    resetOCR();
    setActiveTab('output');
    try {
      await processImages(images, selectedLanguage, () => {});
      toast.success(`Text extracted from all ${images.length} images!`);
    } catch (err) {
      toast.error(`OCR failed: ${err.message}`);
    }
  }, [images, processImages, selectedLanguage, resetOCR]);

  const handleClearAll = useCallback(() => {
    clearAll();
    resetOCR();
    toast('Cleared all images and output.', { icon: '🗑️' });
  }, [clearAll, resetOCR]);

  const handleDemo = useCallback(async () => {
    if (isProcessing) return;
    toast.loading('Loading demo images...', { id: 'demo' });
    try {
      const files = await Promise.all(
        DEMO_IMAGES.map(async (url) => {
          const res = await fetch(url);
          const blob = await res.blob();
          const name = url.split('/').pop();
          return new File([blob], name, { type: blob.type || 'image/png' });
        })
      );
      clearAll();
      resetOCR();
      const count = addImages(files);
      toast.success(`${count} demo images loaded! Click "Start OCR Extraction" to try.`, { id: 'demo' });
    } catch (e) {
      toast.error('Could not load demo images.', { id: 'demo' });
    }
  }, [addImages, clearAll, resetOCR, isProcessing]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
              <ScanText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text leading-tight">OCR Extractor</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">100% free · runs in browser · no API key</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDemo}
              disabled={isProcessing}
              className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800 transition-colors font-medium disabled:opacity-50"
            >
              <Sparkles size={14} />
              Try Demo
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* Mobile tabs */}
        <div className="flex lg:hidden mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {['images', 'output'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 py-2.5 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {tab === 'images' ? (
                <span className="flex items-center justify-center gap-1.5"><ImageIcon size={14} /> Images {images.length > 0 && `(${images.length})`}</span>
              ) : (
                <span className="flex items-center justify-center gap-1.5"><ScanText size={14} /> OCR Output {sections.length > 0 && `(${sections.length})`}</span>
              )}
            </button>
          ))}
        </div>

        {/* Two-panel layout */}
        <div className="flex gap-6 h-[calc(100vh-160px)] min-h-[600px]">

          {/* LEFT: Image management panel */}
          <div className={clsx(
            'flex flex-col gap-4 lg:w-[55%] xl:w-[60%] min-w-0',
            activeTab !== 'images' && 'hidden lg:flex'
          )}>
            {/* Upload area */}
            <div className="shrink-0">
              <ImageUploader onFilesAdded={handleFilesAdded} currentCount={images.length} />
            </div>

            {/* Image header row */}
            {images.length > 0 && (
              <div className="shrink-0 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold px-2.5 py-1 rounded-full">
                    {images.length} image{images.length !== 1 ? 's' : ''}
                  </span>
                  {images.length > 60 && (
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full">
                      ⚠️ Exceeds 60 — consider batching
                    </span>
                  )}
                </div>
                <SequenceControls
                  onSortAZ={sortAZ}
                  onSortZA={sortZA}
                  onReverse={reverseOrder}
                  onReset={resetOrder}
                  onClearAll={handleClearAll}
                  imageCount={images.length}
                />
              </div>
            )}

            {/* Scrollable image grid */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-1">
              {images.length > 0 ? (
                <ImageGrid
                  images={images}
                  onReorder={reorderImages}
                  onRemove={removeImage}
                  onMoveUp={(id) => moveImage(id, 'up')}
                  onMoveDown={(id) => moveImage(id, 'down')}
                  onMoveToPosition={moveToPosition}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-300 dark:text-gray-700 gap-3">
                  <ImageIcon size={48} className="opacity-40" />
                  <p className="text-sm">No images uploaded yet</p>
                  <button
                    onClick={handleDemo}
                    className="flex items-center gap-1.5 text-xs text-violet-500 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    <Sparkles size={12} />
                    Load demo images
                  </button>
                </div>
              )}
            </div>

            {/* OCR Processor */}
            <div className="shrink-0">
              <OCRProcessor
                imageCount={images.length}
                isProcessing={isProcessing}
                isPaused={isPaused}
                progress={progress}
                statusMessage={statusMessage}
                currentImageIndex={currentImageIndex}
                totalImages={totalImages}
                timeRemaining={timeRemaining}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onStart={handleStartOCR}
                onCancel={cancel}
                onPause={pause}
                onResume={resume}
              />
            </div>
          </div>

          {/* RIGHT: Output panel */}
          <div className={clsx(
            'flex flex-col gap-4 lg:w-[45%] xl:w-[40%] min-w-0',
            activeTab !== 'output' && 'hidden lg:flex'
          )}>
            <div className="flex items-center justify-between flex-wrap gap-2 shrink-0">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ScanText size={16} className="text-violet-500" />
                Extracted Text
              </h2>
              <ExportButtons sections={sections} combined={combined} />
            </div>

            <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              <TextOutput sections={sections} onSectionsChange={setSections} />
            </div>

            {/* Info panel */}
            <div className="shrink-0 flex items-start gap-2 text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>All processing happens entirely in your browser. No images are uploaded to any server. Tesseract.js is free and open-source.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        OCR Extractor — Powered by <a href="https://tesseract.projectnaptha.com" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">Tesseract.js</a> · Free forever · Zero cost · Zero API keys
      </footer>
    </div>
  );
}
