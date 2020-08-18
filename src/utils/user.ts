import create from 'zustand';

interface UserValues {
  user: string;
  token: string;
  setUser: (user: string, token: string) => void;
}

const useStore = create<UserValues>(
  (set): UserValues => ({
    user: '',
    token: '',
    setUser: (user: string, token: string) => set({ user: user, token: token }),
  })
);

export default useStore;
