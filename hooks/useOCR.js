'use client';
import { useState, useCallback, useRef } from 'react';
import { createWorker } from 'tesseract.js';

export const LANGUAGES = [
  { code: 'eng', label: 'English (default)' },
  { code: 'auto', label: 'Auto-detect' },
  { code: 'hin', label: 'Hindi' },
  { code: 'fra', label: 'French' },
  { code: 'spa', label: 'Spanish' },
  { code: 'deu', label: 'German' },
  { code: 'chi_sim', label: 'Chinese (Simplified)' },
  { code: 'ara', label: 'Arabic' },
  { code: 'jpn', label: 'Japanese' },
];

/**
 * Tesseract.js OCR processing hook.
 */
export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [statusMessage, setStatusMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [sections, setSections] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const cancelRef = useRef(false);
  const pauseRef = useRef(false);
  const workerRef = useRef(null);
  const startTimeRef = useRef(null);

  const reset = useCallback(() => {
    setSections([]);
    setProgress(0);
    setStatusMessage('');
    setCurrentImageIndex(0);
    setTotalImages(0);
    setTimeRemaining(null);
    setIsProcessing(false);
    setIsPaused(false);
  }, []);

  const appendSection = useCallback((section) => {
    setSections((prev) => [...prev, section]);
  }, []);

  const processImages = useCallback(
    async (images, language, onSectionComplete) => {
      cancelRef.current = false;
      pauseRef.current = false;
      setIsProcessing(true);
      setIsPaused(false);
      setSections([]);
      setProgress(0);
      setTotalImages(images.length);
      startTimeRef.current = Date.now();

      const lang = language === 'auto' ? 'eng' : language;

      try {
        setStatusMessage('Initializing Tesseract engine...');
        const worker = await createWorker(lang, 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              // Fine-grained progress within a single image
            }
          },
        });
        workerRef.current = worker;

        for (let i = 0; i < images.length; i++) {
          if (cancelRef.current) break;

          // Wait while paused
          while (pauseRef.current) {
            await new Promise((r) => setTimeout(r, 300));
            if (cancelRef.current) break;
          }
          if (cancelRef.current) break;

          const image = images[i];
          setCurrentImageIndex(i + 1);
          setStatusMessage(`Processing image ${i + 1} of ${images.length} — ${image.file.name}`);

          const { data: { text } } = await worker.recognize(image.objectURL);

          const section = { filename: image.file.name, text };
          appendSection(section);
          if (onSectionComplete) onSectionComplete(section, i);

          // Revoke object URL after OCR to free memory
          URL.revokeObjectURL(image.objectURL);

          const pct = ((i + 1) / images.length) * 100;
          setProgress(pct);

          // Estimate time remaining
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const perImage = elapsed / (i + 1);
          const remaining = Math.round(perImage * (images.length - i - 1));
          setTimeRemaining(remaining);
        }

        await worker.terminate();
        workerRef.current = null;
        setStatusMessage(cancelRef.current ? 'Processing cancelled.' : 'All images processed!');
      } catch (err) {
        setStatusMessage(`Error: ${err.message}`);
        throw err;
      } finally {
        setIsProcessing(false);
        setIsPaused(false);
      }
    },
    [appendSection]
  );

  const cancel = useCallback(async () => {
    cancelRef.current = true;
    pauseRef.current = false;
    if (workerRef.current) {
      try {
        await workerRef.current.terminate();
      } catch (_) {}
      workerRef.current = null;
    }
    setIsProcessing(false);
    setIsPaused(false);
    setStatusMessage('Processing cancelled.');
  }, []);

  const pause = useCallback(() => {
    pauseRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    pauseRef.current = false;
    setIsPaused(false);
  }, []);

  return {
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
    reset,
    setSections,
  };
}
