import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { personalInfo } from '../data';
import { Mail, Phone, MapPin, Copy, Check, Github, Linkedin, Instagram, Globe, Shield, CheckCircle2, AlertTriangle, Send, Download } from 'lucide-react';
import { downloadResumePDF } from '../utils/pdfGenerator';

interface SavedMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'invalid' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Load submissions count from localstorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishna_portfolio_submissions_count');
      if (saved) {
        setSubmissionCount(parseInt(saved, 10) || 0);
      }
    } catch (e) {
      console.error('Failed to load submissions count:', e);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitStatus === 'invalid' || submitStatus === 'error') setSubmitStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('invalid');
      setApiMessage('Please fill out all transmission parameters.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitStatus('error');
        setApiMessage(data.error || 'Server rejected transmission format.');
      } else {
        setSubmitStatus('success');
        setApiMessage(data.message || 'Transmission securely logged successfully!');
        
        // Update local increments helper
        const nextCount = submissionCount + 1;
        setSubmissionCount(nextCount);
        localStorage.setItem('krishna_portfolio_submissions_count', nextCount.toString());
        
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      console.error('Contact transmission API error:', err);
      setSubmitStatus('error');
      setApiMessage('Network execution fault. Running local fallback tracker.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden bg-[#0B0F19] dark:bg-[#0B0F19] border-t border-gray-900"
    >
      {/* Background radial overlays */}
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.interface()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Secure <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Transmission</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            Establish communication protocols. Messages are persisted securely in local memory reserves.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          
           {/* Info Side Area (Cols 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-display">
                Connection Parameters
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
                Interested in talking details, project timelines, Python routines, database setups, or frontend projects? Choose an endpoint below or copy details.
              </p>

              {/* Contact Nodes */}
              <div className="space-y-4 pt-2">
                
                {/* Email Node with Copy Functionality */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-850 bg-slate-900/40 hover:border-violet-500/20 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-950 border border-gray-800 text-violet-400">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[9px] tracking-widest uppercase text-gray-500 font-bold leading-none">Email Address</h4>
                      <p className="text-xs sm:text-sm font-semibold text-gray-200 mt-1 leading-tight select-all">
                        {personalInfo.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(personalInfo.email, 'email')}
                    className="p-2 rounded-lg bg-slate-950 border border-gray-800 text-gray-400 hover:text-white hover:border-violet-500 duration-200 transition-all cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Phone Node with Copy Functionality */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-850 bg-slate-900/40 hover:border-violet-500/20 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-950 border border-gray-800 text-cyan-400">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[9px] tracking-widest uppercase text-gray-500 font-bold leading-none">Phone Core</h4>
                      <p className="text-xs sm:text-sm font-semibold text-gray-200 mt-1 leading-tight select-all">
                        {personalInfo.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(personalInfo.phone, 'phone')}
                    className="p-2 rounded-lg bg-slate-950 border border-gray-800 text-gray-400 hover:text-white hover:border-violet-500 duration-200 transition-all cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Location Card */}
                <div className="flex items-center gap-3.5 p-4 rounded-xl border border-gray-850 bg-slate-900/40 group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-950 border border-gray-800 text-rose-400">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[9px] tracking-widest uppercase text-gray-500 font-bold leading-none">Location Node</h4>
                    <p className="text-xs sm:text-sm font-semibold text-gray-200 mt-1 leading-tight">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>

                {/* Resume Download Action Button inside Info block */}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Download beautiful professional PDF Resume
                      downloadResumePDF();
                    }}
                    className="w-full py-3.5 rounded-xl border border-dashed border-gray-800 bg-slate-950/40 hover:bg-slate-900 hover:border-violet-500/50 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer text-xs font-bold font-mono tracking-wide"
                  >
                    <Download className="w-4 h-4 text-violet-400" />
                    <span>DOWNLOAD PORTFOLIO RESUME</span>
                  </button>
                </div>

                {/* Secure Counter Node */}
                {submissionCount > 0 && (
                  <div className="flex items-center gap-3.5 p-4 rounded-xl border border-emerald-500/10 bg-emerald-950/5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-950 border border-emerald-500/10 text-emerald-400">
                      <Shield className="w-4.5 h-4.5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-mono text-[9px] tracking-widest uppercase text-emerald-400 font-bold leading-none">Locally Logged Submissions</h4>
                      <p className="text-xs sm:text-sm font-semibold text-gray-200 mt-1 leading-tight">
                        {submissionCount} Transmission{submissionCount > 1 ? 's' : ''} stored
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Social Network Nodes */}
            <div className="space-y-4 pt-6 border-t border-gray-850">
              <h4 className="font-mono text-[10px] tracking-wider uppercase font-extrabold text-gray-500 select-none">
                Krishna's Social Registers
              </h4>
              
              <div className="flex items-center gap-3.5">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full border border-gray-800 bg-slate-900/60 hover:bg-slate-900 hover:border-violet-500 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer hover:-translate-y-1 shadow-md"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full border border-gray-800 bg-slate-900/60 hover:bg-slate-900 hover:border-violet-500 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer hover:-translate-y-1 shadow-md"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full border border-gray-800 bg-slate-900/60 hover:bg-slate-900 hover:border-violet-500 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer hover:-translate-y-1 shadow-md"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                <a
                  href={personalInfo.portfolio}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full border border-gray-800 bg-slate-900/60 hover:bg-slate-900 hover:border-violet-500 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer hover:-translate-y-1 shadow-md"
                  aria-label="Portfolio Site"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Form Side Area (Cols 7) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-gray-850 bg-slate-950/60 shadow-2xl relative">
              
              <form onSubmit={handleSubmit} className="space-y-5" id="secure-transmission-form">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="block font-mono text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Sender Name / Identifier
                  </label>
                  <input
                    type="text"
                    id="name-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name..."
                    autoComplete="name"
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-slate-900/30 text-xs sm:text-sm font-sans font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:bg-slate-900/90 duration-200 transition-all shadow-sm"
                  />
                </div>

                 {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block font-mono text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Return Email Node (SMTP Verification)
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="identifier@service.com..."
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-slate-900/30 text-xs sm:text-sm font-sans font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:bg-slate-900/90 duration-200 transition-all shadow-sm"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject-input" className="block font-mono text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Message Subject / Intent
                  </label>
                  <input
                    type="text"
                    id="subject-input"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Collaboration, Project Inquiry, Support..."
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-slate-900/30 text-xs sm:text-sm font-sans font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:bg-slate-900/90 duration-200 transition-all shadow-sm"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message-input" className="block font-mono text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Secure Text payload / Message
                  </label>
                  <textarea
                    id="message-input"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe backend scripts parameter requirements or security scope specifications..."
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-slate-900/30 text-xs sm:text-sm font-sans font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:bg-slate-900/90 duration-200 transition-all shadow-sm resize-none"
                  />
                </div>

                {/* Form feedback status alerts */}
                <AnimatePresence mode="wait">
                  {(submitStatus === 'invalid' || submitStatus === 'error') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3.5 rounded-lg border border-rose-500/10 bg-rose-950/20 text-xs flex items-center gap-2.5 text-rose-400 select-none"
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span className="font-semibold">{apiMessage || 'All parameters are required.'}</span>
                    </motion.div>
                  )}

                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-lg border border-emerald-500/10 bg-emerald-950/20 text-xs flex items-start gap-3 text-emerald-400 select-none"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="font-bold uppercase tracking-wider text-[11px]">Transmission Securely Transmitted</h4>
                        <p className="font-semibold text-gray-400 text-[10px] sm:text-[11px] leading-relaxed">
                          {apiMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Send action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 rounded-xl font-sans text-xs sm:text-sm font-bold tracking-wide transition-all bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Hashing and Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Message Parameters</span>
                      <Send className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
