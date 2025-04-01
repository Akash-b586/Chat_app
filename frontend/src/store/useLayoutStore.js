import { create } from "zustand";

export const useLayoutStore = create((set) => ({
  isChatInfoOpen: false,
  toggleChatInfo: () =>
    set((state) => ({ isChatInfoOpen: !state.isChatInfoOpen })),
}));
