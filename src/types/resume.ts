// src/types/resume.ts
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
}

export interface Settings {
  template: string;
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'gray' | 'green';
  spacing: 'compact' | 'normal' | 'relaxed';
}