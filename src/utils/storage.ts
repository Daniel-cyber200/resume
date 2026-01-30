import { ResumeData } from '@/types';

const STORAGE_KEY = 'resume-builder-data';

export const saveResumeData = (data: ResumeData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const loadResumeData = (): ResumeData | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

export const clearResumeData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};