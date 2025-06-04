import { create } from "zustand";

interface AppState {
  currentTop: string;
  currentLegs: string;
  startAnimation: boolean;
  animation: string | null;
  updateState: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTop: "moss-59",
  currentLegs: "walnut",
  startAnimation: false,
  animation: null,
  updateState: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
}));
