import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { blogPostsData } from '../data';
import { BlogPost } from '../types';
import { BookOpen, Calendar, Clock, X, Search, Terminal, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = blogPostsData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <section
      id="blog"
      className="py-24 relative overflow-hidden bg-[#0D1220] dark:bg-[#0D1220] border-t border-gray-900"
    >
      {/* Background decoration elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.publications()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            The Cybersecurity <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Logbook</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            Write-ups on Capture-The-Flag (CTF) parameters, system administration guidelines, and script optimization audits.
          </p>
        </div>

        {/* Real-time search indexing */}
        <div className="max-w-md mx-auto mb-12 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search writeups by tags or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/40 border border-gray-800 rounded-xl text-xs sm:text-sm font-sans font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:bg-slate-900 duration-250 transition-all shadow-sm"
              id="search-writeups-input"
            />
          </div>
        </div>

        {/* Blog post grid elements */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-mono text-xs text-gray-500">No write-ups matching requested pattern.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer rounded-2xl border border-gray-850 bg-slate-950/45 overflow-hidden flex flex-col justify-between hover:border-gray-750/70 hover:bg-slate-950/80 duration-300 transition-all hover:-translate-y-1 box-glow-cyan"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Category Header */}
                  <div className="flex items-center justify-between font-mono text-[9px] font-bold">
                    <span className="text-cyan-400 uppercase tracking-widest">{post.category}</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white font-display group-hover:text-violet-400 transition-colors tracking-tight leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed line-clamp-3 font-semibold">
                    {post.excerpt}
                  </p>
                </div>

                {/* Sub info footer */}
                <div className="p-6 border-t border-gray-950 flex items-center justify-between font-mono text-[10px] bg-slate-950/30">
                  <span className="text-gray-500 font-bold">{post.date}</span>
                  <span className="text-violet-400 group-hover:text-cyan-400 hover:underline inline-flex items-center gap-1 font-bold">
                    <span>Read write-up</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200 transition-transform" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>

      {/* Deep, Immersive Expanded Overlay Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl rounded-2xl border border-gray-800 bg-[#0D1220]/95 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              id="blog-modal-reader"
            >
              {/* Readers Header */}
              <div className="flex items-center justify-between px-6 py-4.5 bg-gray-900/60 border-b border-gray-850 select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-gray-400 font-bold">logbook_shell -a {selectedPost.id}</span>
                </div>
                
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-gray-800 hover:border-gray-750 text-gray-400 hover:text-white transition-all cursor-pointer"
                  aria-label="Close writeup reader"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Readers Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/10 uppercase tracking-widest">
                    {selectedPost.category}
                  </span>
                  
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedPost.date}</span>
                  </span>

                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedPost.readTime}</span>
                  </span>
                </div>

                {/* Article Display Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight leading-snug">
                  {selectedPost.title}
                </h1>

                {/* Custom separator line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-violet-500 to-transparent" />

                {/* Main Markdown style readable content */}
                <div className="text-gray-300 font-sans space-y-4 text-xs sm:text-sm leading-relaxed font-semibold">
                  <p className="text-cyan-300/90 italic font-medium border-l-2 border-cyan-400/50 pl-4 py-1 select-none">
                    "{selectedPost.excerpt}"
                  </p>
                  
                  <div className="pt-2 whitespace-pre-line text-slate-300 font-sans leading-relaxed">
                    {selectedPost.content}
                  </div>

                  <p className="pt-4 text-slate-400">
                    Implementing security loops directly translates into defense metrics. Inside modular systems, caching configurations can reduce memory loads by over 60%. As we evaluate raw cryptographic routines, ensuring correct parameters provides bulletproof data transfer. Keep engineering secure assets!
                  </p>
                </div>

                {/* Interactive System checklist inside the blog post */}
                <div className="p-5 rounded-xl border border-gray-900 bg-slate-950/40 space-y-3.5">
                  <h4 className="font-mono text-[10px] tracking-wider uppercase font-extrabold text-gray-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <span>Case Review Remediation Protocols Checklinks</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-400 bg-slate-900/35 px-3 py-2 rounded border border-gray-900">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Salt-hashing parameters check: PASS</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-400 bg-slate-900/35 px-3 py-2 rounded border border-gray-900">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Rate limiting triggers setup: PASS</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-400 bg-slate-900/35 px-3 py-2 rounded border border-gray-900">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>SSH Port security verify: PASS</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-400 bg-slate-900/35 px-3 py-2 rounded border border-gray-900">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Active telemetry audit logging: PASS</span>
                    </div>
                  </div>
                </div>

                {/* Article Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-900 select-none">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-900 border border-gray-850 text-gray-500"
                    >
                      <Tag className="w-3 h-3 text-violet-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
