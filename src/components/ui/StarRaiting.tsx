import {Star} from 'lucide-react';

interface StarRating {
  rating:number;
  size?:number;
  interactive?:boolean;
  onChange?: (value: number) => void;
}

export function StarRating({rating, size = 16, interactive = false, onChange} : StarRating) {
  return (
     <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined}>
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        const filled = value <= rating;
        return (
          <button
            key={value}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(value)}
            aria-label={interactive ? `Rate ${value} out of 5` : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              fill={filled ? 'var(--color-accent)' : 'none'}
              className={filled ? 'text-[var(--color-accent)]' : 'text-[var(--color-border)]'}
            />
          </button>
        );
      })}
    </div>
  )
}