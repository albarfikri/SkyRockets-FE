import { create } from 'zustand';

interface AuthState {
    isLogin: boolean,
    config: object,
    store: object,
    setLogin: (data: object) => void,
};

const auth = create<AuthState>()((set) => ({
  isLogin: false,
  config: {},
  store: {},
  setLogin: (data) => set({ config: data }),
}));

export default auth;