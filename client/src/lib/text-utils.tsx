
import { useState, useEffect, useRef } from 'react';

export const truncateBio = (text: string, context: 'profile' | 'card' | 'mobile' = 'card') => {
  if (!text) return { truncated: '', needsExpansion: false };
  
  // Character-based limits for different contexts
  const maxChars = {
    profile: 120,  // Wider profile pages
    card: 80,      // Card components  
    mobile: 100    // Mobile screens
  };
  
  const readMoreText = '... read more';
  const effectiveMaxChars = maxChars[context] - readMoreText.length;
  
  if (text.length <= maxChars[context]) {
    return { truncated: text, needsExpansion: false };
  }
  
  return {
    truncated: text.slice(0, effectiveMaxChars),
    needsExpansion: true
  };
};

export const BioDisplay = ({ 
  bio, 
  context = 'card',
  className = "text-sm text-muted-foreground",
  expanded: controlledExpanded,
  onToggle 
}: {
  bio: string;
  context?: 'profile' | 'card' | 'mobile';
  className?: string;
  expanded?: boolean;
  onToggle?: () => void;
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const bioRef = useRef<HTMLDivElement>(null);
  const { truncated, needsExpansion } = truncateBio(bio, context);

  // Use controlled state if provided, otherwise use internal state
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpanded = onToggle || (() => setInternalExpanded(!expanded));

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expanded && bioRef.current && !bioRef.current.contains(event.target as Node)) {
        if (onToggle) {
          onToggle();
        } else {
          setInternalExpanded(false);
        }
      }
    };

    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, onToggle]);

  // Remove restrictive CSS classes for expanded text
  const getExpandedClassName = (originalClassName: string) => {
    return originalClassName
      .replace(/\bline-clamp-\d+\b/g, '')
      .replace(/\bmax-h-\[[^\]]*\]/g, '')
      .replace(/\boverflow-hidden\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  if (!bio) {
    return null;
  }

  return (
    <div ref={bioRef}>
      {expanded ? (
        <div>
          <p 
            onClick={toggleExpanded}
            className={`cursor-pointer ${getExpandedClassName(className)}`}
          >
            {bio}
          </p>
          <button
            onClick={toggleExpanded}
            className="text-xs text-primary hover:underline mt-1 font-medium"
          >
            Read less
          </button>
        </div>
      ) : (
        <div className="relative">
          {needsExpansion ? (
            <>
              <p 
                className={`${className} line-clamp-2 pr-20`}
              >
                <span 
                  onClick={toggleExpanded}
                  className="cursor-pointer"
                >
                  {bio}
                </span>
              </p>
              <div className="absolute bottom-0 right-0">
                <button
                  onClick={toggleExpanded}
                  className="text-primary hover:underline font-medium bg-transparent"
                >
                  ... read more
                </button>
              </div>
            </>
          ) : (
            <p className={className}>
              <span 
                onClick={toggleExpanded}
                className="cursor-pointer"
              >
                {bio}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
