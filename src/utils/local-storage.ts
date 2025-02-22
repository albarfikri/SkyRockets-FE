import { configuration } from "src/constants";

export const getLocalStorage = () => localStorage.getItem(configuration.localStorage) || "";

export const setLocalStorage = (keyStorage: string, value: string) => localStorage.setItem(keyStorage, value);

export const deleteLocalStorage = (keyStorage: string) => localStorage.removeItem(keyStorage)