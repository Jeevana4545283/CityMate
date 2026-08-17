import React from 'react';
import { Star } from 'lucide-react';

interface Props {
  rating: number;
  count?: number;
  size?: number;
}

export const StarRating: React.FC<Props> = ({ rating, count, size = 13 }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-neutral-900">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{ width: size, height: size }}
            className={star <= Math.round(rating) ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-300'}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-neutral-900 ml-1">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-[11px] text-neutral-500">({count})</span>}
    </div>
  );
};
