import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'OCR Extractor — Free Browser OCR',
  description:
    'Upload images, reorder them, and extract text using free client-side OCR powered by Tesseract.js. No API keys, no backend, no cost.',
  keywords: ['OCR', 'image to text', 'Tesseract', 'free OCR', 'browser OCR'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '!rounded-xl !font-sans !text-sm',
            success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
