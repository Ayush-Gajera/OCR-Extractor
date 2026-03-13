'use client';
import { useState, useCallback } from 'react';
import { validateFiles } from '@/utils/fileValidation';

/**
 * Manages image list ordering, sequence numbering, and all sorting operations.
 */
export function useImageSequence() {
  const [images, setImages] = useState([]); // { id, file, objectURL, originalIndex }

  const addImages = useCallback((newFiles) => {
    const { valid } = validateFiles(newFiles);
    setImages((prev) => {
      const startIndex = prev.length;
      const added = valid.map((file, i) => ({
        id: `img-${Date.now()}-${i}`,
        file,
        objectURL: URL.createObjectURL(file),
        originalIndex: startIndex + i,
      }));
      return [...prev, ...added];
    });
    return valid.length;
  }, []);

  const removeImage = useCallback((id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.objectURL);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const reorderImages = useCallback((newOrder) => {
    setImages(newOrder);
  }, []);

  const moveImage = useCallback((id, direction) => {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  const moveToPosition = useCallback((id, targetPosition) => {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const clampedPos = Math.max(0, Math.min(prev.length - 1, targetPosition - 1));
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(clampedPos, 0, item);
      return next;
    });
  }, []);

  const sortAZ = useCallback(() => {
    setImages((prev) => [...prev].sort((a, b) => a.file.name.localeCompare(b.file.name)));
  }, []);

  const sortZA = useCallback(() => {
    setImages((prev) => [...prev].sort((a, b) => b.file.name.localeCompare(a.file.name)));
  }, []);

  const reverseOrder = useCallback(() => {
    setImages((prev) => [...prev].reverse());
  }, []);

  const resetOrder = useCallback(() => {
    setImages((prev) => [...prev].sort((a, b) => a.originalIndex - b.originalIndex));
  }, []);

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((i) => URL.revokeObjectURL(i.objectURL));
      return [];
    });
  }, []);

  return {
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
  };
}
