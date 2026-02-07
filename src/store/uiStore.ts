import { create } from 'zustand';

interface UIStore {
  currentScreen: 'menu' | 'scripts' | 'filmRelease' | 'event' | 'settings';
  setCurrentScreen: (screen: UIStore['currentScreen']) => void;
  showModal: boolean;
  modalContent: string | null;
  openModal: (content: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  currentScreen: 'scripts',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  showModal: false,
  modalContent: null,
  openModal: (content) => set({ showModal: true, modalContent: content }),
  closeModal: () => set({ showModal: false, modalContent: null }),
}));