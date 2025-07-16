
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
  expanded = false,
  onToggle 
}: {
  bio: string;
  context?: 'profile' | 'card' | 'mobile';
  className?: string;
  expanded?: boolean;
  onToggle?: () => void;
}) => {
  const { truncated, needsExpansion } = truncateBio(bio, context);

  return (
    <div>
      <p className={className}>
        {expanded ? bio : (
          <>
            {truncated}
            {needsExpansion && !expanded && onToggle && (
              <button
                onClick={onToggle}
                className="text-primary hover:underline font-medium ml-1"
              >
                read more
              </button>
            )}
          </>
        )}
      </p>
      {expanded && needsExpansion && onToggle && (
        <button
          onClick={onToggle}
          className="text-xs text-primary hover:underline mt-1 font-medium"
        >
          Read less
        </button>
      )}
    </div>
  );
};
