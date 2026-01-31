'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Download, Eye, Edit2, User, Briefcase, GraduationCap, Code, Palette,
  Type, Layout, Mail, Phone, MapPin, Linkedin, Globe, Github, Award,
  Plus, Trash2, X, FileText, ChevronLeft, ChevronRight, Save, Calendar,
  Check, Sparkles, ExternalLink, Star, Languages, Cpu, Users, HelpCircle,
  Zap, Clock, TrendingUp, CheckCircle, Loader2, ChevronDown, ChevronUp,
  RefreshCw, Maximize2, Minimize2, Printer, Share2
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
type ResumeData = {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    website: string;
    github: string;
    summary: string;
  };
  workExperience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    achievements: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  customizations: {
    template: 'modern' | 'classic' | 'minimal';
    theme: 'blue' | 'green' | 'purple' | 'dark' | 'rose' | 'indigo';
    font: 'inter' | 'roboto' | 'montserrat' | 'opensans';
    spacing: 'compact' | 'comfortable' | 'spacious';
  };
};

// ==================== CONSTANTS ====================
const themes = {
  blue: { primary: '#3b82f6', secondary: '#60a5fa', light: '#eff6ff', dark: '#1d4ed8' },
  green: { primary: '#10b981', secondary: '#34d399', light: '#ecfdf5', dark: '#059669' },
  purple: { primary: '#8b5cf6', secondary: '#a78bfa', light: '#f5f3ff', dark: '#7c3aed' },
  dark: { primary: '#1e293b', secondary: '#475569', light: '#f1f5f9', dark: '#0f172a' },
  rose: { primary: '#e11d48', secondary: '#fb7185', light: '#fff1f2', dark: '#be123c' },
  indigo: { primary: '#6366f1', secondary: '#818cf8', light: '#eef2ff', dark: '#4f46e5' }
};

const fonts = [
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif" },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif" },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'opensans', name: 'Open Sans', family: "'Open Sans', sans-serif" }
];

const defaultResumeData: ResumeData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    website: '',
    github: '',
    summary: ''
  },
  workExperience: [],
  education: [],
  skills: [
    { category: 'technical', items: [] },
    { category: 'soft', items: [] },
    { category: 'tools', items: [] },
    { category: 'languages', items: [] }
  ],
  customizations: {
    template: 'modern',
    theme: 'blue',
    font: 'inter',
    spacing: 'comfortable'
  }
};

// ==================== MAIN COMPONENT ====================
export default function Home() {
  // ==================== STATE ====================
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isEditing, setIsEditing] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('technical');
  const [toasts, setToasts] = useState<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    work: true,
    education: true,
    skills: true
  });

  const resumeRef = useRef<HTMLDivElement>(null);
  const currentTheme = themes[resumeData.customizations.theme];
  const currentFont = fonts.find(f => f.id === resumeData.customizations.font)?.family || fonts[0].family;

  // ==================== TOAST FUNCTIONS ====================
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // ==================== COMPLETION CALCULATION ====================
  const calculateCompletion = () => {
    let points = 0;
    let total = 0;

    // Personal info (30 points)
    if (resumeData.personal.name) points += 10;
    if (resumeData.personal.email) points += 10;
    if (resumeData.personal.summary) points += 10;
    total += 30;

    // Experience (30 points)
    if (resumeData.workExperience.length > 0) points += 20;
    if (resumeData.workExperience.length > 1) points += 10;
    total += 30;

    // Skills (20 points)
    const totalSkills = resumeData.skills.reduce((sum, cat) => sum + (cat?.items?.length || 0), 0);
    if (totalSkills >= 5) points += 20;
    else if (totalSkills > 0) points += 10;
    total += 20;

    // Education (20 points)
    if (resumeData.education.length > 0) points += 20;
    total += 20;

    return Math.round((points / total) * 100);
  };

  const completion = calculateCompletion();

  // ==================== TEMPLATE LOADING ====================
  const loadTemplateStructure = () => {
  const templateData: ResumeData = {
    personal: {
      name: '',  // Changed from 'Alex Johnson' to empty
      email: '', // Changed from sample email to empty
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      website: '',
      github: '',
      summary: '' // Changed from sample summary to empty
    },
    workExperience: [],  // Changed from sample data to empty array
    education: [],       // Changed from sample data to empty array
    skills: [
      { category: 'technical', items: [] },  // Empty arrays instead of sample skills
      { category: 'soft', items: [] },
      { category: 'tools', items: [] },
      { category: 'languages', items: [] }
    ],
    customizations: resumeData.customizations
  };
  
  setResumeData(templateData);
  addToast('Template structure loaded. Fill in your information.', 'info');
};

  // ==================== LOAD DATA EFFECT ====================
useEffect(() => {
    // Add a small delay to show loading screen
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('resume-pro-data');
      
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          
          // Check if this is actually valid data (not empty or default)
          const hasValidData = parsedData?.personal?.name || 
                              (Array.isArray(parsedData?.workExperience) && parsedData.workExperience.length > 0) ||
                              (Array.isArray(parsedData?.education) && parsedData.education.length > 0) ||
                              (Array.isArray(parsedData?.skills) && parsedData.skills.some((cat: any) => cat.items?.length > 0));
          
          if (hasValidData) {
            setResumeData(parsedData);
            addToast('Your saved resume loaded!', 'success');
          }
        } catch (e) {
          console.error('Error loading saved data');
        }
      }
      setIsLoading(false);
    }, 800); // Small delay for better UX
    
    return () => clearTimeout(timer);
  }, []);

  // ==================== AUTO-SAVE EFFECT ====================
  useEffect(() => {
    if (isLoading) return;
    
    const saveTimeout = setTimeout(() => {
      const hasData = resumeData.personal.name || 
                     resumeData.workExperience.length > 0 ||
                     resumeData.education.length > 0 ||
                     resumeData.skills.some(cat => cat.items.length > 0);
      
      if (hasData) {
        setIsSaving(true);
        localStorage.setItem('resume-pro-data', JSON.stringify(resumeData));
        
        setTimeout(() => {
          setIsSaving(false);
        }, 300);
      }
    }, 2000);
    
    return () => clearTimeout(saveTimeout);
  }, [resumeData, isLoading]);

  // ==================== UPDATE FUNCTIONS ====================
  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateCustomization = (field: keyof ResumeData['customizations'], value: any) => {
    setResumeData(prev => ({
      ...prev,
      customizations: { ...prev.customizations, [field]: value }
    }));
  };

  const addWorkExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: ''
    };
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp]
    }));
    addToast('New work experience added', 'success');
  };

  const updateWorkExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
    addToast('Work experience removed', 'info');
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
    addToast('New education added', 'success');
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    addToast('Education removed', 'info');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    setResumeData(prev => {
      const updatedSkills = prev.skills.map(cat => 
        cat.category === skillCategory 
          ? { ...cat, items: [...cat.items, newSkill.trim()] }
          : cat
      );
      
      return { ...prev, skills: updatedSkills };
    });
    
    setNewSkill('');
    addToast('Skill added successfully', 'success');
  };

  const removeSkill = (category: string, index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(cat => 
        cat.category === category 
          ? { ...cat, items: cat.items.filter((_, i) => i !== index) }
          : cat
      )
    }));
  };

  const resetResume = () => {
    setResumeData(defaultResumeData);
    localStorage.removeItem('resume-pro-data');
    addToast('Resume reset to default', 'info');
  };

  // ==================== EXPORT FUNCTIONS ====================
  const exportPDF = async () => {
    setIsExporting(true);
    addToast('Preparing your resume for export...', 'info');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const element = document.getElementById('resume-print');
      if (element) {
        const html = element.innerHTML;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${resumeData.personal.name || 'Resume'} - ResumeCraft Pro</title>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
                  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap');
                  
                  body { 
                    margin: 0; 
                    padding: 20mm; 
                    font-family: ${currentFont}; 
                    background: white;
                    color: #1f2937;
                  }
                  * { 
                    -webkit-print-color-adjust: exact !important; 
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  @page { 
                    margin: 0; 
                    size: A4;
                  }
                  @media print { 
                    body { 
                      padding: 0; 
                      margin: 0;
                    }
                  }
                  .no-print { display: none; }
                  .page-break { page-break-before: always; }
                </style>
              </head>
              <body>
                <div style="font-family: ${currentFont}">
                  ${html}
                </div>
                <div class="no-print" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
                  Generated with ResumeCraft Pro • Professional Resume Builder
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            setIsExporting(false);
            addToast('PDF exported successfully!', 'success');
          }, 1000);
        }
      }
    } catch (error) {
      setIsExporting(false);
      addToast('Export failed. Please try again.', 'error');
      console.error('Export error:', error);
    }
  };

  // ==================== SECTIONS ====================
  const sections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'work', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'design', label: 'Design', icon: Palette }
  ];

  // ==================== LOADING SCREEN ====================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center animate-fadeInUp">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ 
            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` 
          }}>
            <FileText size={32} className="text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">ResumeCraft Pro</h1>
          <p className="text-gray-600 mb-8">Loading your professional resume builder...</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: '70%',
                background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== TEMPLATE PREVIEW COMPONENTS ====================
  const ModernTemplate = () => (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="border-b pb-8" style={{ borderColor: `${currentTheme.primary}20` }}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="flex-1">
            <h1 
              className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
              }}
            >
              {resumeData.personal.name || 'Your Name'}
            </h1>
            <p className="text-gray-700 text-xl leading-relaxed">
              {resumeData.personal.summary || 'Professional summary goes here...'}
            </p>
          </div>
          
          <div className="space-y-4 min-w-[300px]">
            {resumeData.personal.email && (
              <div className="flex items-center text-gray-600">
                <Mail size={18} className="mr-3 flex-shrink-0" />
                <a href={`mailto:${resumeData.personal.email}`} className="hover:text-blue-600">
                  {resumeData.personal.email}
                </a>
              </div>
            )}
            {resumeData.personal.phone && (
              <div className="flex items-center text-gray-600">
                <Phone size={18} className="mr-3 flex-shrink-0" />
                {resumeData.personal.phone}
              </div>
            )}
            {resumeData.personal.location && (
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-3 flex-shrink-0" />
                {resumeData.personal.location}
              </div>
            )}
            {resumeData.personal.linkedin && (
              <div className="flex items-center text-gray-600">
                <Linkedin size={18} className="mr-3 flex-shrink-0" />
                <a href={resumeData.personal.linkedin} className="hover:text-blue-600">
                  LinkedIn Profile
                </a>
              </div>
            )}
            {resumeData.personal.portfolio && (
              <div className="flex items-center text-gray-600">
                <Globe size={18} className="mr-3 flex-shrink-0" />
                <a href={resumeData.personal.portfolio} className="hover:text-blue-600">
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Work Experience */}
      {resumeData.workExperience.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center">
            <Briefcase className="mr-3" size={28} />
            <span style={{ color: currentTheme.primary }}>Work Experience</span>
          </h2>
          <div className="space-y-6">
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="border-l-4 pl-4" style={{ borderColor: currentTheme.primary }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{exp.position || 'Position'}</h3>
                  <div className="text-gray-600 text-sm">
                    {exp.startDate || 'Start'} – {exp.current ? 'Present' : exp.endDate || 'End'}
                  </div>
                </div>
                <div className="flex items-center text-gray-700 mb-3">
                  <span className="font-medium">{exp.company || 'Company'}</span>
                  {exp.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>
                {exp.description && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center">
            <GraduationCap className="mr-3" size={28} />
            <span style={{ color: currentTheme.primary }}>Education</span>
          </h2>
          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border-l-4 pl-4" style={{ borderColor: currentTheme.primary }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{edu.institution || 'Institution'}</h3>
                  <div className="text-gray-600 text-sm">
                    {edu.startDate || 'Start'} – {edu.endDate || 'End'}
                  </div>
                </div>
                <div className="text-gray-700 mb-3">
                  <div className="font-medium">{edu.degree} in {edu.field}</div>
                  {edu.gpa && <div className="text-sm mt-1">GPA: {edu.gpa}</div>}
                </div>
                {edu.achievements && (
                  <p className="text-gray-600 leading-relaxed">{edu.achievements}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.some(cat => cat.items.length > 0) && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center">
            <Code className="mr-3" size={28} />
            <span style={{ color: currentTheme.primary }}>Skills</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resumeData.skills.map(category => (
              category.items.length > 0 && (
                <div key={category.category}>
                  <h3 className="font-semibold text-gray-700 mb-4 text-lg">{category.category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {category.items.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                        style={{ 
                          backgroundColor: `${currentTheme.primary}10`,
                          color: currentTheme.primary,
                          border: `1px solid ${currentTheme.primary}30`
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="pt-8 border-t text-center text-gray-500 text-sm" style={{ borderColor: `${currentTheme.primary}20` }}>
        <p>Generated with ResumeCraft Pro • Professional Resume Builder</p>
      </div>
    </div>
  );

  const ClassicTemplate = () => (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="text-center border-b-2 pb-8" style={{ borderColor: currentTheme.primary }}>
        <h1 className="text-4xl font-bold mb-4" style={{ color: currentTheme.primary }}>
          {resumeData.personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {resumeData.personal.email && (
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <span>{resumeData.personal.email}</span>
            </div>
          )}
          {resumeData.personal.phone && (
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span>{resumeData.personal.phone}</span>
            </div>
          )}
          {resumeData.personal.location && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>{resumeData.personal.location}</span>
            </div>
          )}
        </div>
        {resumeData.personal.summary && (
          <p className="text-gray-700 max-w-3xl mx-auto">{resumeData.personal.summary}</p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Work Experience */}
          {resumeData.workExperience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b" style={{ borderColor: currentTheme.primary }}>
                WORK EXPERIENCE
              </h2>
              <div className="space-y-6">
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{exp.position}</h3>
                        <div className="font-medium text-gray-700">{exp.company}</div>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        {exp.location && <div className="text-xs">{exp.location}</div>}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b" style={{ borderColor: currentTheme.primary }}>
                EDUCATION
              </h2>
              <div className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{edu.institution}</h3>
                        <div className="font-medium text-gray-700">{edu.degree} in {edu.field}</div>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {edu.startDate} – {edu.endDate}
                        {edu.gpa && <div className="text-xs">GPA: {edu.gpa}</div>}
                      </div>
                    </div>
                    {edu.achievements && (
                      <p className="text-gray-600 text-sm leading-relaxed">{edu.achievements}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Contact & Links */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4" style={{ color: currentTheme.primary }}>
              CONTACT & LINKS
            </h3>
            <div className="space-y-3">
              {resumeData.personal.email && (
                <div className="flex items-center">
                  <Mail size={16} className="mr-3" />
                  <span className="text-sm">{resumeData.personal.email}</span>
                </div>
              )}
              {resumeData.personal.phone && (
                <div className="flex items-center">
                  <Phone size={16} className="mr-3" />
                  <span className="text-sm">{resumeData.personal.phone}</span>
                </div>
              )}
              {resumeData.personal.location && (
                <div className="flex items-center">
                  <MapPin size={16} className="mr-3" />
                  <span className="text-sm">{resumeData.personal.location}</span>
                </div>
              )}
              {resumeData.personal.linkedin && (
                <div className="flex items-center">
                  <Linkedin size={16} className="mr-3" />
                  <span className="text-sm">LinkedIn Profile</span>
                </div>
              )}
              {resumeData.personal.portfolio && (
                <div className="flex items-center">
                  <Globe size={16} className="mr-3" />
                  <span className="text-sm">Portfolio Website</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {resumeData.skills.some(cat => cat.items.length > 0) && (
            <div>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b" style={{ borderColor: currentTheme.primary }}>
                SKILLS
              </h3>
              <div className="space-y-4">
                {resumeData.skills.map(category => (
                  category.items.length > 0 && (
                    <div key={category.category}>
                      <h4 className="font-medium text-gray-700 mb-2">{category.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${currentTheme.primary}10`,
                              color: currentTheme.primary
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MinimalTemplate = () => (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-light mb-2 text-gray-900">
          {resumeData.personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 mb-4 text-sm text-gray-600">
          {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
          {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
          {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
        </div>
        {resumeData.personal.summary && (
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            {resumeData.personal.summary}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Work Experience */}
        {resumeData.workExperience.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-px bg-gray-300"></div>
              <h2 className="mx-4 text-sm font-medium tracking-widest uppercase text-gray-500">
                Experience
              </h2>
              <div className="w-6 h-px bg-gray-300"></div>
            </div>
            <div className="space-y-4">
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{exp.position}</div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-px bg-gray-300"></div>
              <h2 className="mx-4 text-sm font-medium tracking-widest uppercase text-gray-500">
                Education
              </h2>
              <div className="w-6 h-px bg-gray-300"></div>
            </div>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{edu.institution}</div>
                      <div className="text-sm text-gray-600">{edu.degree} in {edu.field}</div>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {edu.startDate} – {edu.endDate}
                    </div>
                  </div>
                  {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.some(cat => cat.items.length > 0) && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-px bg-gray-300"></div>
              <h2 className="mx-4 text-sm font-medium tracking-widest uppercase text-gray-500">
                Skills
              </h2>
              <div className="w-6 h-px bg-gray-300"></div>
            </div>
            <div className="space-y-3">
              {resumeData.skills.map(category => (
                category.items.length > 0 && (
                  <div key={category.category} className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">{category.category}</div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded text-xs border border-gray-300 text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t text-center text-gray-400 text-xs">
        <p>ResumeCraft Pro</p>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* NAVBAR */}
      <nav className="sticky-navbar border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow" style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` 
              }}>
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResumeCraft Pro</h1>
                <p className="text-sm text-gray-500">Build professional resumes</p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">Resume Progress</span>
                    <span className="font-bold" style={{ color: currentTheme.primary }}>
                      {completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${completion}%`,
                        background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                      }}
                    ></div>
                  </div>
                </div>
                {completion < 50 && !resumeData.personal.name && (
                  <button 
                    onClick={loadTemplateStructure}
                    className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-colors"
                  >
                    Load Template
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHelp(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Help"
              >
                <HelpCircle size={20} />
              </button>

              <button
                onClick={resetResume}
                className="hidden md:flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Reset"
              >
                <RefreshCw size={16} />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                  color: 'white'
                }}
              >
                {isEditing ? <Eye size={18} /> : <Edit2 size={18} />}
                <span>{isEditing ? 'Preview' : 'Edit'}</span>
              </button>

              <button
                onClick={exportPDF}
                disabled={isExporting}
                className="hidden md:flex items-center space-x-2 px-5 py-2.5 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* STATUS INDICATORS */}
      <div className="border-b bg-white/50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-gray-600">
                  {isSaving ? 'Saving...' : 'All changes saved'}
                </span>
              </div>
              <div className="hidden md:flex items-center text-gray-600">
                <Clock size={14} className="mr-2" />
                Last saved: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Experience</div>
                  <div className="font-semibold">{resumeData.workExperience.length}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Code size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Skills</div>
                  <div className="font-semibold">{resumeData.skills.reduce((sum, cat) => sum + cat.items.length, 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex">
        {/* SIDEBAR - EDITOR */}
        {isEditing && (
          <div className={`sidebar-transition ${sidebarOpen ? 'w-96' : 'w-0'} }`}>
            <div className="fixed-sidebar">
              <div className="p-6">
                {/* WELCOME CARD FOR NEW USERS */}
                {!resumeData.personal.name && (
                  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 animate-fadeInUp">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Sparkles size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Welcome to ResumeCraft Pro!</h3>
                        <p className="text-blue-600 text-sm mb-3">
                          Start with a clean form or use a template structure
                        </p>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setResumeData(defaultResumeData);
                              addToast('Clean form ready for your info!', 'info');
                            }}
                            className="w-full py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Start Empty Form
                          </button>
                          <button
                            onClick={loadTemplateStructure}
                            className="w-full py-2.5 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                          >
                            Load Template Structure
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION NAVIGATION */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Build Your Resume
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all hover:shadow-md ${
                          activeSection === section.id
                            ? 'shadow-md border-2'
                            : 'border border-gray-200'
                        }`}
                        style={{
                          borderColor: activeSection === section.id ? currentTheme.primary : '',
                          backgroundColor: activeSection === section.id ? `${currentTheme.primary}08` : 'white'
                        }}
                      >
                        <section.icon 
                          size={20} 
                          style={{ 
                            color: activeSection === section.id ? currentTheme.primary : '#6b7280'
                          }}
                          className="mb-2"
                        />
                        <span className={`text-xs font-medium ${
                          activeSection === section.id ? 'font-semibold' : ''
                        }`}>
                          {section.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Content */}
                <div className="space-y-8">
                  {/* PERSONAL INFORMATION */}
                  {activeSection === 'personal' && (
                    <div className="space-y-6 animate-fadeInUp">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.name}
                          onChange={(e) => updatePersonal('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail size={14} className="inline mr-1" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={resumeData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone size={14} className="inline mr-1" />
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={resumeData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin size={14} className="inline mr-1" />
                          Location
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.location}
                          onChange={(e) => updatePersonal('location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Linkedin size={14} className="inline mr-1" />
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          value={resumeData.personal.linkedin}
                          onChange={(e) => updatePersonal('linkedin', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Professional Summary
                        </label>
                        <textarea
                          value={resumeData.personal.summary}
                          onChange={(e) => updatePersonal('summary', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                          placeholder="Describe your professional background, skills, and achievements..."
                        />
                      </div>
                    </div>
                  )}

                  {/* WORK EXPERIENCE */}
                  {activeSection === 'work' && (
                    <div className="space-y-6 animate-fadeInUp">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                        <button
                          onClick={addWorkExperience}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium hover:shadow-sm transition-all"
                          style={{ 
                            backgroundColor: `${currentTheme.primary}10`,
                            color: currentTheme.primary
                          }}
                        >
                          <Plus size={16} />
                          <span>Add Experience</span>
                        </button>
                      </div>

                      {resumeData.workExperience.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">No work experience yet</h4>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Add your work history to showcase your professional journey
                          </p>
                          <button
                            onClick={addWorkExperience}
                            className="px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-md transition-all"
                            style={{ 
                              backgroundColor: currentTheme.primary,
                              color: 'white'
                            }}
                          >
                            <Plus size={18} />
                            <span>Add Your First Experience</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {resumeData.workExperience.map((exp, index) => (
                            <div key={exp.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                                  {exp.company && (
                                    <div className="text-sm text-gray-600">{exp.company}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeWorkExperience(exp.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Company</label>
                                    <input
                                      type="text"
                                      value={exp.company}
                                      onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      placeholder="Google"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Position</label>
                                    <input
                                      type="text"
                                      value={exp.position}
                                      onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      placeholder="Software Engineer"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                    <input
                                      type="month"
                                      value={exp.startDate}
                                      onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                    <input
                                      type="month"
                                      value={exp.endDate}
                                      onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      disabled={exp.current}
                                    />
                                    <label className="flex items-center mt-2">
                                      <input
                                        type="checkbox"
                                        checked={exp.current}
                                        onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                                        className="mr-2"
                                      />
                                      <span className="text-xs text-gray-600">Currently working here</span>
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                                  <textarea
                                    value={exp.description}
                                    onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                    placeholder="Describe your responsibilities and achievements..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* EDUCATION */}
                  {activeSection === 'education' && (
                    <div className="space-y-6 animate-fadeInUp">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                        <button
                          onClick={addEducation}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium hover:shadow-sm transition-all"
                          style={{ 
                            backgroundColor: `${currentTheme.primary}10`,
                            color: currentTheme.primary
                          }}
                        >
                          <Plus size={16} />
                          <span>Add Education</span>
                        </button>
                      </div>

                      {resumeData.education.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                          <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">No education added</h4>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Add your educational background
                          </p>
                          <button
                            onClick={addEducation}
                            className="px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-md transition-all"
                            style={{ 
                              backgroundColor: currentTheme.primary,
                              color: 'white'
                            }}
                          >
                            <Plus size={18} />
                            <span>Add Your First Education</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                                  {edu.institution && (
                                    <div className="text-sm text-gray-600">{edu.institution}</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeEducation(edu.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Institution</label>
                                    <input
                                      type="text"
                                      value={edu.institution}
                                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      placeholder="University Name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Degree</label>
                                    <input
                                      type="text"
                                      value={edu.degree}
                                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      placeholder="Bachelor of Science"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Field of Study</label>
                                    <input
                                      type="text"
                                      value={edu.field}
                                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      placeholder="Computer Science"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">GPA</label>
                                    <input
                                      type="text"
                                      value={edu.gpa}
                                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                      placeholder="3.8/4.0"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                    <input
                                      type="month"
                                      value={edu.startDate}
                                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                    <input
                                      type="month"
                                      value={edu.endDate}
                                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Achievements</label>
                                  <textarea
                                    value={edu.achievements}
                                    onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                                    placeholder="Honors, awards, or special achievements..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SKILLS */}
                  {activeSection === 'skills' && (
                    <div className="space-y-6 animate-fadeInUp">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                        <div className="text-sm text-gray-500">
                          {resumeData.skills.reduce((sum, cat) => sum + cat.items.length, 0)} skills total
                        </div>
                      </div>

                      {/* ADD SKILL FORM */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Skill</label>
                            <input
                              type="text"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                              placeholder="e.g., React, Project Management"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                            <select
                              value={skillCategory}
                              onChange={(e) => setSkillCategory(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 outline-none"
                            >
                              {resumeData.skills.map(cat => (
                                <option key={cat.category} value={cat.category}>
                                  {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={addSkill}
                          disabled={!newSkill.trim()}
                          className="w-full py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            backgroundColor: currentTheme.primary,
                            color: 'white'
                          }}
                        >
                          <Plus size={16} />
                          <span>Add Skill</span>
                        </button>
                      </div>

                      {/* SKILLS DISPLAY */}
                      <div className="space-y-4">
                        {resumeData.skills.map(category => (
                          category.items.length > 0 && (
                            <div key={category.category} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-gray-900 capitalize">{category.category}</h4>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                  {category.items.length} skills
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {category.items.map((skill, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center px-3 py-1.5 rounded-lg hover:scale-105 transition-transform"
                                    style={{ 
                                      backgroundColor: `${currentTheme.primary}10`,
                                      border: `1px solid ${currentTheme.primary}30`
                                    }}
                                  >
                                    <span className="text-sm font-medium" style={{ color: currentTheme.primary }}>
                                      {skill}
                                    </span>
                                    <button
                                      onClick={() => removeSkill(category.category, index)}
                                      className="ml-2 hover:text-red-500 transition-colors"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DESIGN CUSTOMIZATION */}
                  {activeSection === 'design' && (
                    <div className="space-y-8 animate-fadeInUp">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-4 flex items-center">
                          <Palette size={16} className="mr-2" />
                          Color Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(themes).map(([key, theme]) => (
                            <button
                              key={key}
                              onClick={() => updateCustomization('theme', key)}
                              className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                                resumeData.customizations.theme === key
                                  ? 'border-gray-800 shadow-lg scale-105'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div 
                                className="w-full h-12 rounded-lg mb-2"
                                style={{ 
                                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                                }}
                              ></div>
                              <div className="text-sm font-medium capitalize">{key}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-4 flex items-center">
                          <Layout size={16} className="mr-2" />
                          Template Style
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['modern', 'classic', 'minimal'].map(template => (
                            <button
                              key={template}
                              onClick={() => updateCustomization('template', template)}
                              className={`p-4 border-2 rounded-lg text-center transition-all hover:scale-105 ${
                                resumeData.customizations.template === template
                                  ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-full h-16 rounded-lg mb-2 flex items-center justify-center ${
                                template === 'modern' 
                                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                                  : template === 'classic'
                                  ? 'bg-gradient-to-br from-gray-600 to-gray-800'
                                  : 'bg-gradient-to-br from-gray-300 to-gray-500'
                              }`}>
                                <span className="text-white text-xs font-medium">{template.toUpperCase()}</span>
                              </div>
                              <div className="text-sm font-medium capitalize">{template}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-4 flex items-center">
                          <Type size={16} className="mr-2" />
                          Font Family
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {fonts.map(font => (
                            <button
                              key={font.id}
                              onClick={() => updateCustomization('font', font.id)}
                              className={`p-4 border-2 rounded-lg text-center transition-all hover:scale-105 ${
                                resumeData.customizations.font === font.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              style={{ fontFamily: font.family }}
                            >
                              <div className="text-xl font-bold mb-1">Aa</div>
                              <div className="text-sm font-medium">{font.name}</div>
                              <div className="text-xs text-gray-500 mt-1">ABC abc 123</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT - PREVIEW */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-96' : 'ml-0'}`}>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {/* PREVIEW HEADER */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Live Preview
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {resumeData.customizations.template.charAt(0).toUpperCase() + resumeData.customizations.template.slice(1)} Template • 
                      {fonts.find(f => f.id === resumeData.customizations.font)?.name} Font • 
                      Real-time Updates
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all"
                    >
                      {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all"
                    >
                      {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button
                      onClick={exportPDF}
                      disabled={isExporting}
                      className="flex items-center space-x-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 transition-all"
                    >
                      {isExporting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Download size={18} />
                      )}
                      <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RESUME PREVIEW */}
              <div 
                id="resume-print"
                ref={resumeRef}
                className={`bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl print:shadow-none ${
                  isFullscreen ? 'fixed inset-4 z-50' : ''
                }`}
                style={{ 
                  fontFamily: currentFont,
                  padding: resumeData.customizations.spacing === 'compact' ? '2rem' :
                          resumeData.customizations.spacing === 'spacious' ? '3.5rem' : '2.75rem',
                  fontSize: isFullscreen ? '1.1rem' : 'inherit'
                }}
              >
                {/* RENDER SELECTED TEMPLATE */}
                {resumeData.customizations.template === 'modern' && <ModernTemplate />}
                {resumeData.customizations.template === 'classic' && <ClassicTemplate />}
                {resumeData.customizations.template === 'minimal' && <MinimalTemplate />}
              </div>

              {/* PREVIEW CONTROLS */}
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Template:</span>
                  <div className="flex space-x-1">
                    {['modern', 'classic', 'minimal'].map(template => (
                      <button
                        key={template}
                        onClick={() => updateCustomization('template', template)}
                        className={`px-3 py-1 rounded capitalize ${
                          resumeData.customizations.template === template
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  | Preview Scale: {isFullscreen ? 'Fullscreen' : 'Normal'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg transform transition-all duration-300 animate-slideInRight ${
              toast.type === 'success' ? 'bg-green-50 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-green-100 text-green-600' :
                toast.type === 'error' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {toast.type === 'success' ? <CheckCircle size={16} /> : 
                 toast.type === 'error' ? <X size={16} /> : 
                 <HelpCircle size={16} />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{toast.message}</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Help Guide</h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Quick Start</h4>
                  <p className="text-sm text-gray-600">Use the "Load Template" button to get started with sample data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Layout size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Templates</h4>
                  <p className="text-sm text-gray-600">Switch between Modern, Classic, and Minimal templates in Design section</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Download size={16} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Export</h4>
                  <p className="text-sm text-gray-600">Export as PDF for printing. Preview shows exactly how it will look</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={loadTemplateStructure}
                className="w-full py-3 rounded-xl font-medium border-2 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Load Sample Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS STYLES */}
      <style jsx>{`
        .sidebar-transition {
          transition: transform 0.3s ease, width 0.3s ease;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
