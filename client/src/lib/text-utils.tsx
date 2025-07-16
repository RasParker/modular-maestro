
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

  if (!needsExpansion) {
    return (
      <div ref={bioRef}>
        <p className={className}>
          {bio}
        </p>
      </div>
    );
  }

  return (
    <div ref={bioRef}>
      <p className={className}>
        {expanded ? (
          <span 
            onClick={toggleExpanded}
            className="cursor-pointer"
          >
            {bio}
          </span>
        ) : (
          <>
            <span 
              onClick={toggleExpanded}
              className="cursor-pointer"
            >
              {truncated}
            </span>
            <button
              onClick={toggleExpanded}
              className="text-primary hover:underline font-medium ml-1"
            >
              ... read more
            </button>
          </>
        )}
      </p>
      {expanded && (
        <button
          onClick={toggleExpanded}
          className="text-xs text-primary hover:underline mt-1 font-medium"
        >
          Read less
        </button>
      )}
    </div>
  );
};
