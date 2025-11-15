import { nestedFolderDataType } from "@/components/NestedFolder/Data/nestedFolderData";

export const NESTED_KEY = 'nestedFolderData';
export const EXPIRY_TIME_KEY = 'expiredData';

export function saveToStorage<T>(key: string, data: T): boolean {
    try {
        if (!key) return false;
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}

export function getFromStorage(key: string) {
    try {
        if (!key) return null;
        return localStorage.getItem(key);
    } catch (error) {
        throw new Error("Invalid Key")
    }
}

export function loadFromStorage(): nestedFolderDataType[] | null {
    const nestedFolderData = getFromStorage(NESTED_KEY);

    if (!nestedFolderData) return null;

    return JSON.parse(nestedFolderData);
}