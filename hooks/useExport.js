'use client';
import { useCallback } from 'react';
import { downloadTxt, downloadDocx, downloadZip, copyToClipboard } from '@/utils/exportHelpers';
import toast from 'react-hot-toast';

/**
 * Export hook — wraps all export helpers with loading toasts.
 */
export function useExport(sections, combined) {
  const handleTxt = useCallback(async () => {
    try {
      downloadTxt(sections, combined);
      toast.success('Downloaded as .txt!');
    } catch (e) {
      toast.error('Failed to export TXT');
    }
  }, [sections, combined]);

  const handleDocx = useCallback(async () => {
    const toastId = toast.loading('Generating Word document...');
    try {
      await downloadDocx(sections, combined);
      toast.success('Downloaded as .docx!', { id: toastId });
    } catch (e) {
      toast.error('Failed to export DOCX', { id: toastId });
    }
  }, [sections, combined]);

  const handleZip = useCallback(async () => {
    const toastId = toast.loading('Creating ZIP archive...');
    try {
      await downloadZip(sections);
      toast.success('Downloaded ZIP archive!', { id: toastId });
    } catch (e) {
      toast.error('Failed to create ZIP', { id: toastId });
    }
  }, [sections]);

  const handleClipboard = useCallback(async () => {
    try {
      await copyToClipboard(sections, combined);
      toast.success('Copied to clipboard!');
    } catch (e) {
      toast.error('Failed to copy to clipboard');
    }
  }, [sections, combined]);

  return { handleTxt, handleDocx, handleZip, handleClipboard };
}
