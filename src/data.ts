import { Project, Skill, Experience, Certification, Testimonial, BlogPost } from './types';

export const personalInfo = {
  name: 'Krishna Singh',
  title: 'Python Developer | Frontend Developer | BCA Student',
  tagline: 'I build practical software solutions using Python, databases, and modern web technologies to solve real-world problems.',
  location: 'Farrukhabad, Uttar Pradesh, India',
  email: 'krishnathakur222w@gmail.com',
  phone: '+91 9919734471',
  github: 'https://github.com/krishnathakur-cyber',
  linkedin: 'https://www.linkedin.com/in/krishna-singh-bca',
  instagram: 'https://www.instagram.com/__krishna_thakur__18',
  portfolio: 'https://krishnasingh.dev',
  bio: 'I am a passionate Bachelor of Computer Applications student at MCU University, Bhopal, with practical experience in Python development, database management, and modern web technologies. My expertise includes building responsive web applications using React, Tailwind CSS, Node.js, and Express, alongside developing efficient backend solutions using Python and SQL databases. I enjoy transforming ideas into functional applications that solve real-world challenges through clean design, intuitive user experiences, and scalable architecture. I am currently expanding my expertise in advanced Python, data structures and algorithms, full-stack development, and cybersecurity fundamentals.',
  avatarSeed: 'krishna-singh-avatar',
  resumeUrl: '#',
};

// Map skills precisely
export const skillsData: Skill[] = [
  // Programming Languages (languages)
  { name: 'Python', level: 90, category: 'languages', iconName: 'Terminal' },
  { name: 'C', level: 80, category: 'languages', iconName: 'Cpu' },
  { name: 'C++', level: 75, category: 'languages', iconName: 'Cpu' },
  { name: 'JavaScript', level: 85, category: 'languages', iconName: 'FileJson' },
  { name: 'SQL', level: 85, category: 'languages', iconName: 'Database' },
  { name: 'HTML5', level: 90, category: 'languages', iconName: 'Layers' },
  { name: 'CSS3', level: 85, category: 'languages', iconName: 'CheckSquare' },

  // Databases (backend)
  { name: 'MySQL', level: 85, category: 'backend', iconName: 'Database' },
  { name: 'MongoDB', level: 75, category: 'backend', iconName: 'HardDrive' },
  { name: 'SQLite', level: 80, category: 'backend', iconName: 'HardDrive' },

  // Frameworks and Libraries (backend or web)
  { name: 'React', level: 85, category: 'backend', iconName: 'Zap' },
  { name: 'Tailwind CSS', level: 90, category: 'backend', iconName: 'CheckSquare' },
  { name: 'Node.js', level: 80, category: 'backend', iconName: 'Activity' },
  { name: 'Express.js', level: 80, category: 'backend', iconName: 'Server' },
  { name: 'Tkinter', level: 85, category: 'backend', iconName: 'Terminal' },
  { name: 'Matplotlib', level: 80, category: 'backend', iconName: 'Activity' },

  // Tools and Platforms (tools-devops)
  { name: 'VS Code', level: 90, category: 'tools-devops', iconName: 'Monitor' },
  { name: 'Git', level: 85, category: 'tools-devops', iconName: 'GitBranch' },
  { name: 'GitHub', level: 90, category: 'tools-devops', iconName: 'GitBranch' },
  { name: 'Kali Linux (Basic)', level: 70, category: 'cybersecurity', iconName: 'ShieldAlert' },
  { name: 'MS Excel', level: 80, category: 'tools-devops', iconName: 'Clock' },
  { name: 'MS Word', level: 85, category: 'tools-devops', iconName: 'Clock' },
  { name: 'PowerPoint', level: 85, category: 'tools-devops', iconName: 'Monitor' },
  { name: 'Canva', level: 80, category: 'tools-devops', iconName: 'CheckSquare' },

  // Currently Learning (cybersecurity / backend)
  { name: 'Advanced Python', level: 80, category: 'cybersecurity', iconName: 'Terminal' },
  { name: 'Data Structures & Algorithms', level: 70, category: 'cybersecurity', iconName: 'Cpu' },
  { name: 'Full-Stack JavaScript', level: 75, category: 'cybersecurity', iconName: 'FileJson' },
  { name: 'Cybersecurity Fundamentals', level: 75, category: 'cybersecurity', iconName: 'Lock' }
];

export const projectsData: Project[] = [
  {
    id: 'q2-furniture',
    title: 'Q2 Premium Furniture Marketplace',
    subtitle: 'Multi-Vendor E-Commerce Platform',
    description: 'A modern e-commerce platform designed to connect customers with certified furniture vendors through a seamless and premium digital experience. Focuses on role-based access, dynamic country pricing, and live inventory operations.',
    problem: 'Sourcing custom certified furniture typically involves untracked operations, disjointed communication channels, manual logistics management, and a lack of clear tracking systems for global shipments.',
    solution: 'Engineered a highly scalable multi-vendor ecosystem with dynamic role-based dashboards (Client, Artisan, Admin) that allows global shipment tracking, real-time stock management, and custom pricing arrays.',
    impact: 'Created solid user-specific dashboard panels, reduced custom quoting cycle delays, and completed structured delivery metrics with 100% responsive reliability across mobile and desktop breakpoints.',
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'REST APIs', 'State Hooks'],
    link: 'https://q2-furniture-marketplace-252758604197.asia-southeast1.run.app',
    github: 'https://github.com/krishnathakur-cyber/q2-furniture-marketplace',
    type: 'web',
    accentColor: '#7C3AED' // Dynamic Violet
  },
  {
    id: 'marvel-verse',
    title: 'Marvel Verse',
    subtitle: 'Immersive Entertainment MCU Explorer',
    description: 'An interactive, content-rich web application dedicated to the Marvel Cinematic Universe. Synthesizes movie release dates, superhero rosters, budgets, and collections into a highly visually engaging visual grid.',
    problem: 'Toggling between disparate wikis, fansheets, and search results to compare character background files and financial achievements of MCU series was disjointed and lacked visual rhythm.',
    solution: 'Designed an elegant content aggregator featuring dedicated sections for heroes, custom filtering tabs, interactive navigation, and full metrics tables for box office releases.',
    impact: 'Delivered an immersive browsing experience leveraging rapid searching, 100% responsiveness, fluid animated card shifts, and optimized state controls on wide displays.',
    tech: ['React', 'Tailwind CSS', 'HTML5', 'CSS3', 'Lucide Icons', 'Motion Library'],
    link: 'https://marvel-verse-krishna.lovable.app',
    github: 'https://github.com/krishnathakur-cyber/marvel-verse',
    type: 'web',
    accentColor: '#06B6D4' // Dynamic Cyan
  }
];

export const experienceData: Experience[] = [
  {
    id: 'bca-mcu',
    role: 'Bachelor of Computer Applications (BCA)',
    company: 'MCU University, Bhopal',
    location: 'Bhopal, India / Farrukhabad, UP',
    period: '2024 – 2027',
    description: [
      'Focusing on Python Development, Database Management systems, Software Engineering, and Web Technologies.',
      'Integrating academic database concepts directly with custom React frontends and robust Express endpoints.'
    ],
    type: 'education'
  },
  {
    id: 'exp-frontend',
    role: 'Junior Frontend Developer & Python Enthusiast',
    company: 'Open Source Projects & Academic Lab Works',
    location: 'Farrukhabad, Uttar Pradesh, India',
    period: '2024 – Present',
    description: [
      'Building premium fully responsive web systems using modern libraries like Tailwind CSS and React state hooks.',
      'Writing concurrent automation scripts and GUI programs utilizing Python libraries such as Tkinter and Matplotlib.',
      'Managing clean structured relational databases inside SQLite and MySQL to persist user state logs.'
    ],
    type: 'jobs'
  },
  {
    id: 'exp-cyber',
    role: 'Cybersecurity & Advanced Systems Learner',
    company: 'Self-Directed Labs & Tech Research',
    location: 'Farrukhabad, UP, India',
    period: '2025 - Present',
    description: [
      'Researching fundamentals of system security auditing, Kali Linux commands, and secure backend REST access control keys.',
      'Analyzing algorithms and data structures to streamline application performance and database processing queries.'
    ],
    type: 'projects'
  }
];

export const certificationsData: Certification[] = [
  {
    id: 'cert1',
    name: 'Python Programming Specialist',
    issuer: 'University Academy / Self-Paced Elite Lab',
    date: '2025',
    credentialUrl: '#',
    badgeType: 'python'
  },
  {
    id: 'cert2',
    name: 'Modern Responsive Web Design Fundamentals',
    issuer: 'Frontend Scholars Program',
    date: '2024',
    credentialUrl: '#',
    badgeType: 'development'
  },
  {
    id: 'cert3',
    name: 'Introductory Systems Security Auditing',
    issuer: 'Cybersecurity Explorers Alliance',
    date: '2025',
    credentialUrl: '#',
    badgeType: 'security'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test1',
    name: 'Senior BCA Coordinator',
    role: 'Academic Department Head',
    company: 'MCU University Partner Center',
    quote: 'Krishna approaches computer applications with outstanding practical curiosity. He bridges the gap between academic theory, databases, and responsive actual web code seamlessly.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'test2',
    name: 'E-Commerce Marketplace Partner',
    role: 'Project Reviewer',
    company: 'Tech Peer Reviews',
    quote: 'Krishna rebuilt our prototype marketplace with role-based access dashboards. His commitment to detail and responsive interface delivery is exceptional.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'post1',
    title: 'Demystifying Multi-Vendor Dashboards in React',
    excerpt: 'How to map complex role-based routing (Admin, Client, Artisan) in modern SPAs without compromising fluid animations and state persistence.',
    content: 'Building dashboards like the Q2 Professional Furniture Marketplace requires strict architecture. By decoupling components and loading selective context hooks, we can provide modular workspaces that persist user preferences cleanly and load in milliseconds.',
    date: 'May 18, 2026',
    readTime: '5 min read',
    tags: ['React', 'Web Development', 'Dashboards'],
    category: 'Development'
  },
  {
    id: 'post2',
    title: 'Leveraging Python and SQLite for Fluid Data Pipelines',
    excerpt: 'A basic introduction to writing structured Python scrapers, mapping tables, and preparing clean custom views with Matplotlib visualizations.',
    content: 'Databases shouldn\'t be slow. Learn how to map SQLite queries cleanly using Python scripts, clean orphaned tables, and export beautiful tracking graphs in Matplotlib for any dashboard application.',
    date: 'March 10, 2026',
    readTime: '7 min read',
    tags: ['Python', 'SQL', 'Databases', 'Matplotlib'],
    category: 'Python'
  }
];
