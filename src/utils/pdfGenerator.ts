import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional, high-fidelity PDF resume for Krishna Singh,
 * conforming exactly to the structured A4 double-page layout shown in the reference screenshots.
 */
export const downloadResumePDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryBlue = [37, 99, 235]; // #2563eb
  const textDark = [3, 7, 18];       // #030712
  const textCharcoal = [55, 65, 81]; // #374151
  const textMuted = [107, 114, 128]; // #6b7280

  const addSectionHeader = (d: jsPDF, title: string, y: number): number => {
    d.setFont('Helvetica', 'bold');
    d.setFontSize(11);
    d.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    d.text(title, 18, y);
    
    // Draw horizontal section underline
    d.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    d.setLineWidth(0.4);
    d.line(18, y + 2, 192, y + 2);
    
    return y + 8;
  };

  // --- PAGE 1 ---
  let y = 18;

  // Header - Name
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('KRISHNA SINGH', 105, y, { align: 'center' });
  y += 8;

  // Header - Subtitle
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('Python Developer | BCA Student', 105, y, { align: 'center' });
  y += 6;

  // Header - Contact details
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
  const contactString = 'krishnathakur222w@gmail.com   •   +91 9919734471   •   Farrukhabad, Uttar Pradesh';
  doc.text(contactString, 105, y, { align: 'center' });
  y += 5.5;

  // Header - Social Links
  const linkY = y;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);

  const socialLinks = [
    { text: 'LinkedIn Profile', url: 'https://linkedin.com/in/krishnathakur222w' },
    { text: 'GitHub Portfolio', url: 'https://github.com/krishnathakur222w' },
    { text: 'Instagram Handle', url: 'https://instagram.com/krishnathakur222w' }
  ];

  const xs = [65, 105, 145]; // spacing positions for the columns
  socialLinks.forEach((link, i) => {
    const xPos = xs[i];
    doc.text(link.text, xPos, linkY, { align: 'center' });
    
    // Underline
    const w = doc.getTextWidth(link.text);
    doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setLineWidth(0.2);
    doc.line(xPos - w/2, linkY + 0.5, xPos + w/2, linkY + 0.5);
    
    // Core Link mapping
    doc.link(xPos - w/2, linkY - 3, w, 4, { url: link.url });
  });

  y += 7;

  // Light separation line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(18, y, 192, y);
  y += 8;

  // ABOUT ME
  y = addSectionHeader(doc, 'ABOUT ME', y);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
  const aboutBody = 'I am a passionate BCA student with hands-on experience in Python development, database management, and web technologies. I have built real-world projects using Python, SQLite, and Tkinter, and I am eager to grow as a Python Developer and contribute to innovative software solutions.';
  const aboutParsed = doc.splitTextToSize(aboutBody, 174);
  doc.text(aboutParsed, 18, y);
  y += (aboutParsed.length * 4.8) + 8;

  // EDUCATION
  y = addSectionHeader(doc, 'EDUCATION', y);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('Bachelor of Computer Application (BCA)', 18, y);
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('2024 – 2027', 192, y, { align: 'right' });
  
  y += 4.5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('MCU University, Bhopal', 18, y);
  doc.text('(4th Semester)', 192, y, { align: 'right' });
  
  y += 9;

  // TECHNICAL SKILLS
  y = addSectionHeader(doc, 'TECHNICAL SKILLS', y);
  const skillsList = [
    { label: 'Languages: ', val: 'Python, C, C++, HTML, CSS, SQL, JavaScript' },
    { label: 'Databases: ', val: 'MySQL, MongoDB, SQLite' },
    { label: 'Tools & Software: ', val: 'VS Code, Kali Linux (Basics), MS Word, MS PowerPoint, Canva' },
    { label: 'Libraries & Frameworks: ', val: 'Tkinter, Matplotlib (Python GUI & Data Visualization)' },
    { label: 'Other: ', val: 'Advanced Excel' }
  ];

  skillsList.forEach(skill => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(skill.label, 18, y);

    const offset = doc.getTextWidth(skill.label);
    
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
    doc.text(skill.val, 18 + offset, y);
    y += 5.2;
  });

  y += 4;

  // PROJECTS & ARCHITECTURES (Page 1 projects)
  y = addSectionHeader(doc, 'PROJECTS & ARCHITECTURES', y);

  // Project 1
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('1. Student Grade Manager', 18, y);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
  doc.text('Python, Tkinter, SQLite, Matplotlib', 192, y, { align: 'right' });

  y += 5;
  const project1Bullets = [
    'Built a full desktop GUI application to manage student records and marks',
    'Implemented Add, Update, Delete, and Search functionality with live data table',
    'Integrated SQLite database for persistent local data storage',
    'Added visual bar chart (Matplotlib) to compare and analyze student performance',
    'Developed entirely in Python using VS Code with a dark-themed professional UI'
  ];

  project1Bullets.forEach(b => {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
    doc.text('•', 22, y);

    const bLines = doc.splitTextToSize(b, 164);
    doc.text(bLines, 26, y);
    y += (bLines.length * 4.6) + 1;
  });

  y += 4.5;

  // Project 2
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('2. Personal Password Manager', 18, y);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
  doc.text('Python, File Handling', 192, y, { align: 'right' });

  y += 5;
  const project2Bullets = [
    'Built a CLI-based password manager to securely save and retrieve passwords',
    'Features include Save, View, Delete, Update, and Random Password Generator',
    'Passwords stored persistently in a local text file using Python file handling',
    'Auto-generates strong random passwords using letters, digits, and special characters',
    'Clean menu-driven interface with full CRUD operations'
  ];

  project2Bullets.forEach(b => {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
    doc.text('•', 22, y);

    const bLines = doc.splitTextToSize(b, 164);
    doc.text(bLines, 26, y);
    y += (bLines.length * 4.6) + 1;
  });

  // Footer page 1
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Page 1 of 2', 105, 287, { align: 'center' });


  // --- PAGE 2 ---
  doc.addPage();
  let y2 = 18;

  // Continuation Header (Informative)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('PROJECTS & ARCHITECTURES (Continued)', 18, y2);
  doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setLineWidth(0.4);
  doc.line(18, y2 + 2, 192, y2 + 2);
  y2 += 8;

  // Project 3
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('3. Q2 Premium Furniture Marketplace', 18, y2);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
  doc.text('React, Tailwind CSS, Node.js, Express', 192, y2, { align: 'right' });

  y2 += 5;
  const project3Bullets = [
    'A high-end e-commerce platform bridging certified furniture vendors & buyers.',
    'Features role-based entry clearance (Client, Artisan, Admin panels), country dynamic pricing, live stock count managers, and active global shipment tracking.'
  ];

  project3Bullets.forEach(b => {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
    doc.text('•', 22, y2);

    const bLines = doc.splitTextToSize(b, 164);
    doc.text(bLines, 26, y2);
    y2 += (bLines.length * 4.6) + 1;
  });

  y2 += 8;

  // SOFT SKILLS
  y2 = addSectionHeader(doc, 'SOFT SKILLS', y2);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
  const softSkills = 'Problem Solving   •   Logical Thinking   •   Professional Communication   •   Self-Learning   •   Meticulous Attention to Detail';
  doc.text(softSkills, 18, y2);
  y2 += 12;

  // ADDITIONAL INFORMATION
  y2 = addSectionHeader(doc, 'ADDITIONAL INFORMATION', y2);
  const addInfoList = [
    { label: 'Languages Known: ', val: 'Hindi, English' },
    { label: 'Currently Learning: ', val: 'Advanced Python, Data Structures & Algorithms, Full-Stack JS' },
    { label: 'Interests: ', val: 'Software Development, Cybersecurity Basics, Open Source Projects' }
  ];

  addInfoList.forEach(info => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(info.label, 18, y2);

    const offset = doc.getTextWidth(info.label);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textCharcoal[0], textCharcoal[1], textCharcoal[2]);
    
    const valLines = doc.splitTextToSize(info.val, 174 - offset);
    doc.text(valLines, 18 + offset, y2);
    y2 += (valLines.length * 4.8) + 1.5;
  });

  // Footer page 2
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Page 2 of 2', 105, 287, { align: 'center' });

  // Save PDF
  doc.save('Krishna_Singh_Resume.pdf');
};
