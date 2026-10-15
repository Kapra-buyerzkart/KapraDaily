import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Text, TextStyle, StyleProp } from 'react-native';

type Listener = () => void;

class DealTicker {
  private listeners: Set<Listener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private appStateSubscription: any = null;

  constructor() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      this.notifyListeners();
      this.start();
    } else {
      this.stop();
    }
  };

  private start() {
    if (this.intervalId || this.listeners.size === 0) {
      return;
    }
    this.intervalId = setInterval(() => {
      this.notifyListeners();
    }, 1000);
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch {
        // Prevent one faulty subscriber from breaking the ticker loop
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.listeners.size === 1) {
      this.start();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  }

  public getSubscriberCount(): number {
    return this.listeners.size;
  }
}

export const sharedDealTicker = new DealTicker();

export interface DealTimeRemaining {
  distance: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
  formatted: string;
}

export const computeDealTimeRemaining = (
  targetTimestamp: number,
  currentTimestamp: number = Date.now(),
): DealTimeRemaining => {
  const distance = targetTimestamp - currentTimestamp;

  if (distance <= 0) {
    return {
      distance: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEnded: true,
      formatted: 'Offer ended',
    };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const formatted =
    days > 0
      ? `Offer ends in ${days}days ${hours}hrs ${minutes}mins ${seconds}secs`
      : `Offer ends in ${hours}hrs ${minutes}mins ${seconds}secs`;

  return {
    distance,
    days,
    hours,
    minutes,
    seconds,
    isEnded: false,
    formatted,
  };
};

export const useDealCountdown = (
  targetTimestamp: number,
  isFocused: boolean = true,
): DealTimeRemaining => {
  const [timeRemaining, setTimeRemaining] = useState<DealTimeRemaining>(() =>
    computeDealTimeRemaining(targetTimestamp),
  );

  useEffect(() => {
    if (!isFocused || timeRemaining.isEnded) {
      return;
    }

    const update = () => {
      const next = computeDealTimeRemaining(targetTimestamp);
      setTimeRemaining(next);
    };

    update();
    const unsubscribe = sharedDealTicker.subscribe(update);
    return unsubscribe;
  }, [targetTimestamp, isFocused, timeRemaining.isEnded]);

  return timeRemaining;
};

interface DealCountdownTextProps {
  targetTimestamp: number;
  isFocused?: boolean;
  style?: StyleProp<TextStyle>;
  renderCustom?: (info: DealTimeRemaining) => React.ReactNode;
}

export const DealCountdownText: React.FC<DealCountdownTextProps> = React.memo(
  ({ targetTimestamp, isFocused = true, style, renderCustom }) => {
    const timeRemaining = useDealCountdown(targetTimestamp, isFocused);

    if (renderCustom) {
      return <>{renderCustom(timeRemaining)}</>;
    }

    return (
      <Text style={style} numberOfLines={1}>
        {timeRemaining.formatted}
      </Text>
    );
  },
);
