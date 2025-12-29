import { useState, useEffect, useRef } from 'react';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  loading?: 'lazy' | 'eager';
}

const ImageWithLoader = ({ src, alt, className = '', onError, loading = 'lazy' }: ImageWithLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Check if image is already loaded (cached)
    if (img.complete && img.naturalHeight !== 0) {
      setIsLoaded(true);
      return;
    }

    const handleLoad = () => {
      setIsLoaded(true);
      img.classList.add('loaded');
    };

    const handleError = (e: Event) => {
      setHasError(true);
      if (onError) {
        onError(e as any);
      }
    };

    img.addEventListener('load', handleLoad, { once: true });
    img.addEventListener('error', handleError, { once: true });

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, onError]);

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`image-reveal ${isLoaded ? 'loaded' : ''} ${className}`}
        loading={loading}
        onError={(e) => {
          setHasError(true);
          if (onError) onError(e);
        }}
        style={{
          transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};

export default ImageWithLoader;

