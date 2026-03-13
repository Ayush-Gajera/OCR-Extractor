'use client';
import { useState, useRef, useEffect } from 'react';
import { FileText, ToggleLeft, ToggleRight, Edit3 } from 'lucide-react';
import { countWords, countCharacters, buildFullOutput } from '@/utils/textFormatter';
import clsx from 'clsx';

export default function TextOutput({ sections, onSectionsChange }) {
  const [combined, setCombined] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const bottomRef = useRef(null);

  // Build display text from sections
  const displayText = buildFullOutput(sections, combined);
  const wordCount = countWords(displayText);
  const charCount = countCharacters(displayText);

  // Auto-scroll to bottom as new sections arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sections.length]);

  // Sync editable text when sections update and not in edit mode
  useEffect(() => {
    if (!isEditing) {
      setEditableText(displayText);
    }
  }, [displayText, isEditing]);

  const handleEditSave = () => {
    // Parse editable text back into sections (best-effort — split by dividers)
    const dividerPattern = /════+\n📄 \[\d+\] (.+?)\n════+\n([\s\S]*?)(?=════|$)/g;
    const newSections = [];
    let match;
    while ((match = dividerPattern.exec(editableText)) !== null) {
      newSections.push({ filename: match[1], text: match[2].trim() });
    }
    if (newSections.length > 0) {
      onSectionsChange(newSections);
    } else {
      // Combined mode — fallback: keep single block
      onSectionsChange([{ filename: 'edited-output.txt', text: editableText }]);
    }
    setIsEditing(false);
  };

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 dark:text-gray-600 gap-3">
        <FileText size={48} className="opacity-40" />
        <p className="text-sm">OCR output will appear here in real-time as each image is processed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCombined((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {combined ? <ToggleRight size={20} className="text-violet-500" /> : <ToggleLeft size={20} />}
            {combined ? 'Combined view' : 'Sectioned view'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleEditSave}
                className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Save Edits
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditableText(displayText); }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => { setIsEditing(true); setEditableText(displayText); }}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Edit3 size={13} />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Text area */}
      <div className="flex-1 relative min-h-0">
        {isEditing ? (
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="w-full h-full min-h-[400px] resize-none font-mono text-xs bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-violet-300 dark:border-violet-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
            spellCheck={false}
          />
        ) : (
          <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
            {combined ? (
              <pre className="font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{displayText}</pre>
            ) : (
              sections.map((section, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 truncate">
                      {section.filename}
                    </span>
                  </div>
                  <div className="ml-8 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <pre className="font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{section.text || '(No text extracted)'}</pre>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500 shrink-0">
        <span>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
        <span>{wordCount.toLocaleString()} words</span>
        <span>{charCount.toLocaleString()} characters</span>
      </div>
    </div>
  );
}
