
export const truncateBio = (text: string, context: 'profile' | 'card' | 'mobile' = 'card') => {
  if (!text) return { truncated: '', needsExpansion: false };
  
  const words = text.split(' ');
  
  // Different word limits based on context but always 2 lines max
  const wordsPerLine = {
    profile: 12,  // Wider profile pages
    card: 10,     // Card components
    mobile: 8     // Mobile screens
  };
  
  const maxWords = 2 * wordsPerLine[context]; // Exactly 2 lines
  
  if (words.length <= maxWords) {
    return { truncated: text, needsExpansion: false };
  }
  
  return {
    truncated: words.slice(0, maxWords).join(' '),
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
        {expanded ? bio : truncated}
        {needsExpansion && !expanded && '...'}
      </p>
      {needsExpansion && onToggle && (
        <button
          onClick={onToggle}
          className="text-xs text-primary hover:underline mt-1 font-medium"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};
