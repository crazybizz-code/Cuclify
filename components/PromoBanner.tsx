'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { PromoBannerConfig } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  config: PromoBannerConfig;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const difference = +new Date(endDate) - +new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function PromoBanner({ config, className }: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (config.countdown) {
      setTimeLeft(calculateTimeLeft(config.countdown.endDate));

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(config.countdown!.endDate));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [config.countdown]);

  return (
    <section className={cn('relative py-20 md:py-28 overflow-hidden', className)}>
      {/* Background */}
      {config.backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={config.backgroundImage}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: config.backgroundColor ?? 'hsl(var(--primary))' }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-4"
          style={{ color: config.textColor ?? 'white' }}
        >
          {config.headline}
        </h2>

        {/* Subheadline */}
        {config.subheadline && (
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 opacity-90"
            style={{ color: config.textColor ?? 'white' }}
          >
            {config.subheadline}
          </p>
        )}

        {/* Countdown */}
        {config.countdown && mounted && timeLeft && (
          <div className="mb-8">
            {config.countdown.label && (
              <p
                className="text-sm uppercase tracking-wider mb-4 opacity-80"
                style={{ color: config.textColor ?? 'white' }}
              >
                {config.countdown.label}
              </p>
            )}
            <div className="flex justify-center gap-4">
              {[
                { value: timeLeft.days, label: config.countdown.units.days },
                { value: timeLeft.hours, label: config.countdown.units.hours },
                { value: timeLeft.minutes, label: config.countdown.units.minutes },
                { value: timeLeft.seconds, label: config.countdown.units.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]"
                >
                  <div
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: config.textColor ?? 'white' }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wider opacity-80"
                    style={{ color: config.textColor ?? 'white' }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Button */}
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="h-12 px-8 text-base shadow-lg"
        >
          <Link href={config.button.href}>
            {config.button.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
