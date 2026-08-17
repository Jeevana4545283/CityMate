import React from 'react';
import { Zap, Check } from 'lucide-react';

interface Props {
  score: number;
  reasons?: string[];
  showDetails?: boolean;
}

export const MatchBadge: React.FC<Props> = ({ score, reasons = [], showDetails = false }) => {
  return (
    <div className="flex flex-col items-start">
      <div className="px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
        <Zap className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
        <span>{score}% Match</span>
      </div>

      {showDetails && reasons.length > 0 && (
        <div className="mt-2 space-y-1">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-neutral-700">
              <Check className="w-3 h-3 text-neutral-900 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
