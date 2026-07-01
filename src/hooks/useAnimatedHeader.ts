import { useRef, useState, useCallback, useEffect } from 'react';
import { TextInput, Keyboard } from 'react-native';
import {
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

const ANIMATION_DURATION = 280;

export interface AnimatedHeaderHook {
  progress: SharedValue<number>;
  isSearchActive: boolean;
  searchText: string;
  inputRef: React.RefObject<TextInput | null>;
  openSearch: () => void;
  closeSearch: () => void;
  handleSearchText: (text: string) => void;
  handleClear: () => void;
}

const useAnimatedHeader = (
  onSearchChange?: (text: string) => void,
): AnimatedHeaderHook => {
  const progress = useSharedValue(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Focus the input as soon as it mounts (when isSearchActive flips to true)
  useEffect(() => {
    if (!isSearchActive) return;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isSearchActive]);

  const resetSearch = useCallback(() => {
    setIsSearchActive(false);
    setSearchText('');
    onSearchChange?.('');
  }, [onSearchChange]);

  const openSearch = useCallback(() => {
    setIsSearchActive(true);
    progress.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const closeSearch = useCallback(() => {
    Keyboard.dismiss();
    progress.value = withTiming(
      0,
      { duration: ANIMATION_DURATION, easing: Easing.in(Easing.quad) },
      finished => {
        if (finished) {
          runOnJS(resetSearch)();
        }
      },
    );
  }, [progress, resetSearch]);

  const handleSearchText = useCallback(
    (text: string) => {
      setSearchText(text);
      onSearchChange?.(text);
    },
    [onSearchChange],
  );

  const handleClear = useCallback(() => {
    if (searchText === '') {
      closeSearch();
    } else {
      setSearchText('');
      onSearchChange?.('');
    }
  }, [searchText, closeSearch, onSearchChange]);

  return {
    progress,
    isSearchActive,
    searchText,
    inputRef,
    openSearch,
    closeSearch,
    handleSearchText,
    handleClear,
  };
};

export default useAnimatedHeader;
