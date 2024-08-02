import { create, StateCreator } from "zustand";
import { UserDetails } from "./types";
import { persist, PersistOptions, StorageValue } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
}


type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

// Custom storage to handle sessionStorage
const sessionStorageWithTypeParsing = {
  getItem: async (name: string): Promise<StorageValue<AuthState> | null> => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: StorageValue<AuthState>): void => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string): void => {
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => {
        if (typeof token === 'string' || token === null) {
          set({ accessToken: token });
        } else {
          console.error("Invalid token type, expected string or null:", token);
        }
      },
      successMessage: null,
      setSuccessMessage: (message) => set({ successMessage: message }),
    }),
    {
      name: 'auth-storage',
      storage: sessionStorageWithTypeParsing,
    }
  )
);



interface SubmissionState {
  selectedSubmissionId: number | null;
  setSelectedSubmissionId: (id: number) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  selectedSubmissionId: null,
  setSelectedSubmissionId: (id: number) => set({ selectedSubmissionId: id }),
}));

interface UserState {
  user: UserDetails | null;
  setUser: (user: UserDetails | null) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
