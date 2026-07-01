import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerNameState {
  names: Record<string, string>;
  hasHydrated: boolean;
  setName: (storeSlug: string, name: string) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useCustomerNameStore = create<CustomerNameState>()(
  persist(
    (set) => ({
      names: {},
      hasHydrated: false,
      setName: (storeSlug, name) =>
        set((state) => ({ names: { ...state.names, [storeSlug]: name } })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "curateco-customer-name",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
