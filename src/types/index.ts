export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    website: string;
    summary: string;
  };
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    achievements: string;
  }>;
  skills: {
    category: string;
    items: string[];
  }[];
  customizations: {
    template: 'modern' | 'classic' | 'minimal';
    theme: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'indigo';
    font: 'inter' | 'roboto' | 'montserrat' | 'opensans';
    spacing: 'compact' | 'comfortable' | 'spacious';
  };
}