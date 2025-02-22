import { create } from 'zustand';

interface AuthState {
    isLogin: boolean,
    config: object,
    store: object,
    userData: any,
    setLogin: (data: object) => void,
    setUserData: (data: any) => void,
};

const auth = create<AuthState>()((set) => ({
  isLogin: false,
  config: {},
  store: {},
  userData: null,
  setLogin: (data) => set({ config: data }),
  setUserData: (data) => set({ userData: data }),
}));

export default auth;