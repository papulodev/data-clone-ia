'use client';

import { create } from 'zustand';
import { Clone, listarClones } from '@/lib/api';

interface CloneState {
  clones: Clone[];
  loading: boolean;
  error: string | null;
  fetchClones: () => Promise<void>;
  setClones: (clones: Clone[]) => void;
}

export const useCloneStore = create<CloneState>((set) => ({
  clones: [],
  loading: false,
  error: null,
  fetchClones: async () => {
    set({ loading: true, error: null });
    try {
      const res = await listarClones();
      if (res.ok) {
        set({ clones: res.clones, loading: false });
      } else {
        set({ error: 'Error al cargar clones', loading: false });
      }
    } catch {
      set({ error: 'Error de conexión', loading: false });
    }
  },
  setClones: (clones) => set({ clones }),
}));
