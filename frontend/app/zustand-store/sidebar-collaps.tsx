import { create } from "zustand"

type State = {
    isCollapsed: boolean
}

type Action = {
    setIsCollapsed: () => void
}

export const useSidebarCollapse = create<State & Action>((set) => ({
    isCollapsed: false,
    setIsCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));