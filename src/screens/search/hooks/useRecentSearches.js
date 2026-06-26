import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCH_KEY = 'recent_searches_list';
const MAX_RECENT_SEARCHES = 10;
const MIN_KEYWORD_LENGTH = 3;

// Tracks the user's recent search keywords in AsyncStorage, most-recent-first.
const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };
    loadRecentSearches();
  }, []);

  const saveSearch = useCallback(async keyword => {
    if (!keyword || keyword.trim().length < MIN_KEYWORD_LENGTH) return;
    const cleanKeyword = keyword.trim();

    try {
      setRecentSearches(prev => {
        const updated = [cleanKeyword, ...prev.filter(s => s !== cleanKeyword)].slice(
          0,
          MAX_RECENT_SEARCHES,
        );
        AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error saving search:', error);
    }
  }, []);

  return { recentSearches, saveSearch };
};

export default useRecentSearches;
