export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  tech: string[];
  link?: string;
  github?: string;
  type: 'automation' | 'api' | 'security' | 'web';
  accentColor: string;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'languages' | 'backend' | 'cybersecurity' | 'tools-devops';
  iconName: string; // Used to dynamic rendering from Lucide Icons
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string; // e.g., "Summer 2025" or "2023 - Present"
  description: string[];
  type: 'education' | 'jobs' | 'projects';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  badgeType: 'python' | 'security' | 'network' | 'cloud' | 'development';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown formatted content or plain visual breakdown
  date: string;
  readTime: string;
  tags: string[];
  category: string;
}
