import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  volume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  language: string;
  setVolume: (volume: number) => void;
  toggleMusic: () => void;
  toggleSFX: () => void;
  setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      volume: 0.7,
      musicEnabled: true,
      sfxEnabled: true,
      language: 'en',
      
      setVolume: (volume) => set({ volume }),
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      toggleSFX: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'cinema-sim-settings',
    }
  )
);