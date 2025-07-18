"use client";

import { useEffect } from 'react';
import { Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkipToContentProps {
  label?: string;
}

export function SkipToContent({ label = 'Skip to main content' }: SkipToContentProps) {
  useEffect(() => {
    const handleSkip = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          e.preventDefault();
          mainContent.focus();
        }
      }
    };

    const skipLink = document.getElementById('skip-to-content-link');
    if (skipLink) {
      skipLink.addEventListener('click', handleSkip);
      skipLink.addEventListener('keydown', handleSkip);
    }

    return () => {
      if (skipLink) {
        skipLink.removeEventListener('click', handleSkip);
        skipLink.removeEventListener('keydown', handleSkip);
      }
    };
  }, []);

  return (
    <motion.a
      href="#main-content"
      id="skip-to-content-link"
      className={cn(
        'fixed top-0 left-0 m-2 px-4 py-2 bg-primary-600 text-white rounded focus:outline-none focus-visible-enhanced z-50',
        'transform -translate-y-full focus:translate-y-0 transition-transform duration-300'
      )}
    >
      <Pin className="inline-block w-4 h-4 mr-1 align-middle" /> {label}
    </motion.a>
  );
}

