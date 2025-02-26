import { create } from 'zustand';

interface ProductState {
    selectedCompany: any,
    setSelectedCompany: (data: any) => void,
};

const products = create<ProductState>()((set) => ({
  selectedCompany: {},
  setSelectedCompany: (data) => set({ selectedCompany: data }),
}));

export default products;