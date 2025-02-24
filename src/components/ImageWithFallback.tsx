import React, { useState } from 'react';
import { ImageOffIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  darkModeSrc?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  darkModeSrc 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if system prefers dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const imageSrc = prefersDark && darkModeSrc ? darkModeSrc : src;

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <ImageOffIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${loading ? 'invisible' : 'visible'}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}