import React from 'react';
import { BookingStatus } from '../../types';
import { Clock, CheckCircle2, UserCheck, Navigation, Play, Award, XCircle } from 'lucide-react';

interface Props {
  status: BookingStatus;
}

export const VisualProgressTracker: React.FC<Props> = ({ status }) => {
  const steps: { key: BookingStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'Requested', label: 'Requested', icon: Clock },
    { key: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
    { key: 'Worker Assigned', label: 'Worker Assigned', icon: UserCheck },
    { key: 'On The Way', label: 'On The Way', icon: Navigation },
    { key: 'Service Started', label: 'In Progress', icon: Play },
    { key: 'Completed', label: 'Completed', icon: Award }
  ];

  if (status === 'Cancelled') {
    return (
      <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center space-x-3 text-neutral-800">
        <XCircle className="w-5 h-5 flex-shrink-0 text-neutral-900" />
        <div>
          <h4 className="text-xs font-bold text-neutral-900">Booking Cancelled</h4>
          <p className="text-[11px] text-neutral-500">This service booking request was cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-neutral-200 -translate-y-1/2 -z-0" />
        
        {/* Active track line */}
        <div
          className="absolute top-1/2 left-4 h-0.5 bg-neutral-900 -translate-y-1/2 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-neutral-900 text-white ring-4 ring-neutral-200 scale-110 shadow-sm'
                    : isDone
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'bg-white border border-neutral-300 text-neutral-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`mt-2 text-[10px] font-bold tracking-tight text-center ${
                  isCurrent ? 'text-neutral-900' : isDone ? 'text-neutral-700' : 'text-neutral-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
