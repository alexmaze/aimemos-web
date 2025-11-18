import { useState } from 'react';

const STORAGE_KEY = 'thought-bubble-preference';

export type ThoughtPreference = 'show' | 'hide';

export function useThoughtPreference(): [ThoughtPreference, (preference: ThoughtPreference) => void] {
  const [preference, setPreferenceState] = useState<ThoughtPreference>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored === 'show' || stored === 'hide') ? stored : 'hide';
    } catch {
      return 'hide';
    }
  });

  const setPreference = (newPreference: ThoughtPreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, newPreference);
      setPreferenceState(newPreference);
    } catch (error) {
      console.error('Failed to save thought preference:', error);
      setPreferenceState(newPreference);
    }
  };

  return [preference, setPreference];
}
