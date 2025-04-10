import { useState, useEffect } from 'react';
import { calculateTimeLeft } from '@/lib/utils';

interface CountdownProps {
  endTime: Date | string;
  onEnd?: () => void;
  className?: string;
  compact?: boolean;
}

export default function Countdown({ endTime, onEnd, className = '', compact = false }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft(endTime);
      setTimeLeft(updated);
      
      if (updated.hasEnded && onEnd) {
        onEnd();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="text-xs">
          {timeLeft.hasEnded ? (
            'Ended'
          ) : (
            <>
              {timeLeft.days > 0 && `${timeLeft.days}d `}
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {timeLeft.hasEnded ? (
        <span className="text-sm">Auction ended</span>
      ) : (
        <>
          {timeLeft.days > 0 && (
            <div className="text-center">
              <div className="text-xl font-semibold">{timeLeft.days}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-xl font-semibold">{formatTime(timeLeft.hours)}</div>
            <div className="text-xs text-gray-500">hours</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">{formatTime(timeLeft.minutes)}</div>
            <div className="text-xs text-gray-500">min</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">{formatTime(timeLeft.seconds)}</div>
            <div className="text-xs text-gray-500">sec</div>
          </div>
        </>
      )}
    </div>
  );
}
