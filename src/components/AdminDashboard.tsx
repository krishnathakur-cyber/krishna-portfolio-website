import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  BarChart3,
  Users,
  Clock,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  LogOut,
  RefreshCw,
  Search,
  Lock,
  Settings,
  Star,
  MapPin,
  Check,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Layers,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface PageVisitItem {
  page: string;
  timeSpent: number;
  enteredAt: string;
}

interface VisitorSession {
  _id: string;
  visitorId: string;
  sessionToken: string;
  entryTime: string;
  exitTime?: string;
  duration: number;
  pagesVisited: PageVisitItem[];
  trafficSource: string;
  city: string;
  country: string;
  device: string;
  browser: string;
  os: string;
}

interface AnalyticsData {
  totalVisits: number;
  uniqueVisits: number;
  avgSessionDuration: number;
  devices: { [key: string]: number };
  oses: { [key: string]: number };
  browsers: { [key: string]: number };
  trafficSources: { [key: string]: number };
  locations: { name: string; value: number }[];
  mostVisitedPages: { page: string; hits: number }[];
  trafficTimeline: { date: string; total: number; unique: number }[];
  messagesCount: number;
  recentSessions: VisitorSession[];
  feedback: {
    totalFeedback: number;
    avgRating: number;
    recommendRatio: number;
    scores: { score: number; count: number }[];
  };
}

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface FeedbackRecord {
  _id: string;
  rating: number;
  liked: string;
  improvement: string;
  recommend: string;
  createdAt: string;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [token, setToken] = useState<string>(sessionStorage.getItem('portfolio_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard content tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'messages' | 'feedback' | 'visitors'>('analytics');
  const [visitorFilter, setVisitorFilter] = useState('');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  
  // States to hold loaded lists
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto load assets once authenticated
  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token, activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      if (activeTab === 'analytics' || !analytics) {
        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load telemetry vectors.');
        const data = await res.json();
        setAnalytics(data);
      }

      if (activeTab === 'messages') {
        const res = await fetch('/api/admin/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load message registry.');
        const data = await res.json();
        setMessages(data);
      }

      if (activeTab === 'feedback') {
        const res = await fetch('/api/admin/feedback', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load survey registry.');
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sync with API backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Complete both username & access credentials.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server rejected credentials.');
      }

      sessionStorage.setItem('portfolio_admin_token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication error.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_admin_token');
    setToken('');
    setAnalytics(null);
    setMessages([]);
    setFeedbacks([]);
  };

  // Convert duration (seconds) to human readable mins
  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}m ${remainder}s`;
  };

  // Pre-process chart structures
  const deviceData = analytics
    ? Object.keys(analytics.devices).map((d) => ({
        name: d.toUpperCase(),
        value: analytics.devices[d]
      }))
    : [];

  const sourceData = analytics
    ? Object.keys(analytics.trafficSources).map((s) => ({
        name: s.toUpperCase(),
        value: analytics.trafficSources[s]
      }))
    : [];

  const sourceColors = ['#8B5CF6', '#06B6D4', '#EF4444', '#10B981'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#04060E] text-gray-100 flex flex-col font-sans">
      
      {/* 1. AUTH GATED DOOR PANEL */}
      {!token ? (
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Core styling ambient grids */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px] -top-32 -left-32" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[100px] -bottom-32 -right-32" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-gray-950 bg-slate-950/80 shadow-2xl relative z-10"
          >
            <div className="text-center space-y-2 mb-8 select-none">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-gray-800 flex items-center justify-center mx-auto text-violet-400">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-white pt-1">
                Admin Secure Login
              </h2>
              <p className="text-xs text-gray-400">
                Unlock telemetry feedback logs & visitor dashboards.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase text-gray-500 tracking-wider">
                  Operator Identifier
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full px-4 py-3 border border-gray-800 bg-slate-900/40 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase text-gray-500 tracking-wider">
                  Access Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode root key..."
                  className="w-full px-4 py-3 border border-gray-800 bg-slate-900/40 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-950/20 border border-rose-500/10 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500/20 text-white font-sans text-xs font-bold tracking-wide hover:opacity-95 duration-200 disabled:opacity-50 cursor-pointer"
              >
                {isLoggingIn ? 'Decrypting Access Tokens...' : 'Establish Secure Connection'}
              </button>
            </form>
            
            <div className="text-center pt-6">
              <button
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-white underline cursor-pointer"
              >
                Return to portfolio client
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        // 2. MAIN ACTIVE ADMIN DASHBOARD INTERFACE
        <div className="flex-1 flex flex-col min-h-screen">
          
          {/* Top Panel Nav Headers */}
          <header className="border-b border-gray-900 bg-[#060812] sticky top-0 z-20 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-650/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <BarChart3 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold font-display text-white">
                    Krishna Singh
                  </h1>
                  <p className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                    Core Metrics Dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  className="p-2 border border-gray-800 bg-slate-900/40 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  title="Synchronize parameters"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 px-3 rounded-lg border border-rose-500/10 bg-rose-950/10 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer duration-200"
                  title="Sever credentials session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Auth</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2 px-3 text-xs font-bold text-gray-400 hover:text-white border border-gray-800 bg-slate-950 rounded-lg cursor-pointer"
                >
                  Back to Client
                </button>
              </div>
            </div>
          </header>

          {/* Tab Selection */}
          <nav className="border-b border-gray-950 bg-[#05060D] select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3.5 px-4   border-b-2 font-mono text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Traffic Analytics
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-3.5 px-4   border-b-2 font-mono text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'messages'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Inquiries Registry ({analytics?.messagesCount || messages.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`py-3.5 px-4   border-b-2 font-mono text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'feedback'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Exit Feedback Loops ({analytics?.feedback?.totalFeedback || feedbacks.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('visitors')}
                className={`py-3.5 px-4   border-b-2 font-mono text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'visitors'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Visitor Logs & Activity ({analytics?.recentSessions?.length || 0})
              </button>
            </div>
          </nav>

          {/* Loading States and Dash content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-950/20 border border-rose-500/10 text-rose-400 text-xs sm:text-sm rounded-xl flex items-center gap-3 font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isLoading && !analytics && !messages.length && !feedbacks.length ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                <span className="font-mono text-xs text-violet-400">Restructuring statistical arrays...</span>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* --- A. TRAFFIC ANALYTICS VIEW --- */}
                {activeTab === 'analytics' && analytics && (
                  <div className="space-y-8">
                    {/* STATS BOARDS ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      
                      {/* STAT 1: Total visitors */}
                      <div className="p-5 rounded-2xl border border-gray-900 bg-slate-950/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <BarChart3 className="w-20 h-20 text-violet-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-violet-950/40 border border-violet-500/10 flex items-center justify-center text-violet-400">
                            <BarChart3 className="w-4.5 h-4.5" />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">Total Sessions</span>
                        </div>
                        <h3 className="text-3xl font-display font-extrabold text-white mt-4">
                          {analytics.totalVisits}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">Accumulated node pings</p>
                      </div>

                      {/* STAT 2: Unique visitors */}
                      <div className="p-5 rounded-2xl border border-gray-900 bg-slate-950/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Users className="w-20 h-20 text-cyan-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-cyan-950/40 border border-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <Users className="w-4.5 h-4.5" />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">Unique Visitors</span>
                        </div>
                        <h3 className="text-3xl font-display font-extrabold text-white mt-4">
                          {analytics.uniqueVisits}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">Distinct client devices</p>
                      </div>

                      {/* STAT 3: Average stay */}
                      <div className="p-5 rounded-2xl border border-gray-900 bg-slate-950/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Clock className="w-20 h-20 text-emerald-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Clock className="w-4.5 h-4.5" />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">Avg. Stay Duration</span>
                        </div>
                        <h3 className="text-3xl font-display font-extrabold text-white mt-4">
                          {formatDuration(analytics.avgSessionDuration)}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">User attention longevity</p>
                      </div>

                      {/* STAT 4: Satisfaction Rating */}
                      <div className="p-5 rounded-2xl border border-gray-900 bg-slate-950/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Star className="w-20 h-20 text-amber-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-500/10 flex items-center justify-center text-amber-400">
                            <Star className="w-4.5 h-4.5" />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 font-bold">Star Rating Loop</span>
                        </div>
                        <h3 className="text-3xl font-display font-extrabold text-white mt-4 text-gradient bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                          {analytics.feedback.avgRating} / 5
                        </h3>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                          <span>{analytics.feedback.recommendRatio}% Recommend</span>
                        </p>
                      </div>

                    </div>

                    {/* TRAFFIC TREND LINE CHART */}
                    <div className="p-5 sm:p-6 rounded-2xl border border-gray-900 bg-slate-950/20">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 select-none">
                        <div>
                          <h4 className="text-sm font-bold text-white font-display">Traffic Velocity Vectors</h4>
                          <p className="text-[10px] font-mono text-gray-500">Weekly traffic distributions (Sessions vs. Users)</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded bg-violet-600" />
                            <span className="text-gray-400">Sessions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded bg-cyan-500" />
                            <span className="text-gray-400">Unique Nodes</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.trafficTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                              </linearGradient>
                              <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#111322" vertical={false} />
                            <XAxis dataKey="date" stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} />
                            <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ background: '#090D1A', border: '1px solid #1E293B', borderRadius: '12px' }}
                              labelStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#94A3B8' }}
                              itemStyle={{ fontSize: '12px', padding: '1px 0' }}
                            />
                            <Area type="monotone" dataKey="total" name="Total Sessions" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSessions)" />
                            <Area type="monotone" dataKey="unique" name="Unique Visitors" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUnique)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* TWO COLUMN GRID: PIE CHARTS & Location grouping */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Device & Traffic Sources split */}
                      <div className="lg:col-span-4 space-y-6">
                        {/* Traffic origin splits */}
                        <div className="p-5 rounded-2xl border border-gray-900 bg-slate-950/20">
                          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 mb-4 select-none">
                            Acquisition Origins
                          </h4>
                          
                          <div className="h-44 flex items-center justify-center relative">
                            {sourceData.length === 0 ? (
                              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-gray-600">No data loaded</div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={sourceData}
                                    innerRadius={50}
                                    outerRadius={65}
                                    paddingAngle={3}
                                    dataKey="value"
                                  >
                                    {sourceData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ background: '#090D1A', border: '1px solid #1E293B', borderRadius: '8px', fontSize: '11px' }} />
                                </PieChart>
                              </ResponsiveContainer>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-900 font-mono text-[10px]">
                            {sourceData.map((src, index) => (
                              <div key={src.name} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sourceColors[index % sourceColors.length] }} />
                                <span className="text-gray-400 truncate">{src.name}:</span>
                                <span className="text-white font-bold ml-auto">{src.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* OS Split */}
                        <div className="p-5 rounded-2xl border border-gray-900 bg-slate-950/20 select-none">
                          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 mb-3 block">
                            Platform Architectures
                          </h4>
                          <div className="space-y-3 pt-1">
                            {Object.keys(analytics.oses).map((os) => {
                              const value = analytics.oses[os];
                              const percentage = analytics.totalVisits > 0 ? Math.round((value / analytics.totalVisits) * 100) : 0;
                              return (
                                <div key={os} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                                    <span className="text-gray-400">{os}</span>
                                    <span className="text-white">{percentage}% ({value})</span>
                                  </div>
                                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-600 rounded-full" style={{ width: `${percentage}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Page popularity */}
                      <div className="lg:col-span-5 p-5 rounded-2xl border border-gray-900 bg-slate-950/20">
                        <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-4 select-none">
                          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400">
                            Page Popularity Index
                          </h4>
                          <span className="text-[10px] bg-slate-900 border border-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded">
                            Hit Count
                          </span>
                        </div>

                        <div className="space-y-4">
                          {analytics.mostVisitedPages.map((item, idx) => {
                            const maxHits = analytics.mostVisitedPages[0]?.hits || 1;
                            const percent = Math.round((item.hits / maxHits) * 100);
                            return (
                              <div key={item.page} className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded bg-slate-900 border border-gray-850 flex items-center justify-center font-mono text-[9px] font-bold text-violet-400">
                                  0{idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                                    <span className="text-gray-300 truncate font-semibold">{item.page}</span>
                                    <span className="text-white font-bold ml-2">{item.hits} pings</span>
                                  </div>
                                  <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${percent}%` }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Geographical locations */}
                      <div className="lg:col-span-3 p-5 rounded-2xl border border-gray-900 bg-slate-950/20">
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 mb-4 select-none">
                          Traffic Hubs
                        </h4>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                          {analytics.locations.length === 0 ? (
                            <div className="text-xs font-mono text-gray-600 py-10 text-center">No location pings.</div>
                          ) : (
                            analytics.locations.map((loc, idx) => (
                              <div key={loc.name} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-900 bg-slate-950/40 hover:border-violet-500/25 duration-200 transition-colors">
                                <div className="flex items-center gap-2 min-w-0">
                                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span className="text-xs text-gray-300 font-semibold truncate leading-none">{loc.name}</span>
                                </div>
                                <span className="font-mono text-xs text-violet-400 font-bold ml-2 shrink-0">{loc.value} Sessions</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* --- B. INQUIRIES MESSAGES LOOPS TAB --- */}
                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between select-none">
                      <div>
                        <h3 className="text-lg font-bold text-white font-display">Communication Registry</h3>
                        <p className="text-xs font-mono text-cyan-400">Operational visitor message data archives.</p>
                      </div>
                      <span className="font-mono text-xs text-gray-500 font-bold bg-slate-950 px-3 py-1.5 border border-gray-900 rounded-lg">
                        {messages.length} Correspondence Logs
                      </span>
                    </div>

                    {messages.length === 0 ? (
                      <div className="border border-dashed border-gray-900 rounded-2xl p-16 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 mx-auto">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-md font-bold text-gray-300">Message Registers are Clear</h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            No contact forms have been logged on Port 3000 yet.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg._id}
                            className="p-6 rounded-2xl border border-gray-900 bg-slate-950/20 flex flex-col hover:border-violet-500/30 duration-300 transition-all gap-4"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-3 border-b border-gray-900 select-none">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-extrabold text-white font-display">{msg.name}</span>
                                  <span className="font-mono text-[9px] text-gray-500">({msg._id})</span>
                                </div>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium block"
                                >
                                  {msg.email}
                                </a>
                              </div>
                              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(msg.createdAt).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-display font-extrabold text-[#E5E7EB] text-sm">
                                Subject: <span className="text-violet-300 font-semibold">{msg.subject || 'None provided'}</span>
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed whitespace-pre-wrap select-text">
                                {msg.message}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- C. SURVEY FEEDBACK LOOP TAB --- */}
              {activeTab === 'feedback' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between select-none">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">Exit Intent Survey Feedbacks</h3>
                      <p className="text-xs font-mono text-cyan-400">Exit-intent analytical survey telemetries.</p>
                    </div>
                    <span className="font-mono text-xs text-gray-400 font-bold bg-slate-950 px-3 py-1.5 border border-gray-900 rounded-lg">
                      {feedbacks.length} Loops Registered
                    </span>
                  </div>

                  {feedbacks.length === 0 ? (
                    <div className="border border-dashed border-gray-900 rounded-2xl p-16 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full border border-gray-850 flex items-center justify-center text-gray-600 mx-auto">
                        <ThumbsUp className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-md font-bold text-gray-300">Feedback Archives Empty</h4>
                        <p className="text-xs text-gray-650 max-w-sm mx-auto">
                          Zero exit intents captured on the client window yet.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map((f) => (
                        <div
                          key={f._id}
                          className="p-6 rounded-2xl border border-gray-900 bg-slate-950/20 hover:border-cyan-500/20 duration-300 transition-all flex flex-col gap-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3 border-b border-gray-900 select-none">
                            <div className="flex items-center gap-4">
                              {/* Star counts */}
                              <div className="flex items-center gap-1.5 py-1 px-2.5 rounded bg-amber-950/15 border border-amber-500/10 text-amber-400 font-mono font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{f.rating} / 5</span>
                              </div>

                              {/* Recommendation check */}
                              <div className={`py-1 px-2 rounded-full font-mono text-[9px] font-extrabold uppercase ${
                                String(f.recommend).toLowerCase() === 'yes'
                                  ? 'bg-emerald-950/10 border border-emerald-500/10 text-emerald-400'
                                  : 'bg-rose-950/10 border border-rose-500/10 text-rose-400'
                              }`}>
                                Recommend: {f.recommend}
                              </div>
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(f.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="p-3 shadow-md rounded-xl bg-slate-905 border border-gray-900">
                              <span className="block font-mono text-[9px] text-gray-500 uppercase font-extrabold tracking-wider mb-1">
                                Retrospective Likes
                              </span>
                              <p className="text-xs text-gray-300 font-medium">
                                {f.liked || '—'}
                              </p>
                            </div>

                            <div className="p-3 shadow-md rounded-xl bg-slate-905 border border-gray-900">
                              <span className="block font-mono text-[9px] text-gray-500 uppercase font-extrabold tracking-wider mb-1">
                                Improvement suggestions
                              </span>
                              <p className="text-xs text-gray-300 font-medium">
                                {f.improvement || '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- D. VISITOR LOGS & REAL-TIME ACTIVITY TAB --- */}
              {activeTab === 'visitors' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">Client Telemetries & Engagement Paths</h3>
                      <p className="text-xs font-mono text-cyan-400">Review individual guest stay lengths and scroll focus paths.</p>
                    </div>

                    {/* Filter Input */}
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={visitorFilter}
                        onChange={(e) => setVisitorFilter(e.target.value)}
                        placeholder="Search IP, Location, OS, Page..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-800 bg-slate-950/50 rounded-xl text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  {/* Filter/Render logic */}
                  {(() => {
                    const sessions = analytics?.recentSessions || [];
                    const filtered = sessions.filter(s => {
                      const term = visitorFilter.toLowerCase().trim();
                      if (!term) return true;
                      
                      const matchFields = [
                        s.visitorId,
                        s.sessionToken,
                        s.city,
                        s.country,
                        s.os,
                        s.browser,
                        s.device,
                        s.trafficSource,
                        ...(s.pagesVisited || []).map(p => p.page)
                      ];

                      return matchFields.some(field => String(field || '').toLowerCase().includes(term));
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="border border-dashed border-gray-900 rounded-2xl p-16 text-center space-y-4">
                          <div className="w-12 h-12 rounded-full border border-gray-850 flex items-center justify-center text-gray-600 mx-auto">
                            <Users className="w-5 h-5 animate-pulse" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-300">No Visitor Matches Found</h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">
                              Adjust your queries or clean filters to resume.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {filtered.map((s) => {
                          const isExpanded = expandedSession === s.sessionToken;
                          const totalSectionsVisited = s.pagesVisited?.length || 0;
                          const entryFormatted = new Date(s.entryTime).toLocaleString();

                          return (
                            <div
                              key={s.sessionToken}
                              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                                isExpanded
                                  ? 'border-violet-500/50 bg-slate-950/35 shadow-md'
                                  : 'border-gray-900 bg-slate-950/15 hover:border-gray-800'
                              }`}
                            >
                              {/* Header Toggle bar */}
                              <div
                                onClick={() => setExpandedSession(isExpanded ? null : s.sessionToken)}
                                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                              >
                                {/* Left segment: User tags & Geos */}
                                <div className="flex items-start gap-3.5 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-gray-800 flex items-center justify-center text-cyan-400 shrink-0">
                                    <Users className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wide">
                                        Session: {s.sessionToken.slice(-6)}
                                      </span>
                                      <span className="text-[10px] py-0.5 px-2 rounded-full bg-slate-900 border border-gray-800 text-slate-300 font-bold">
                                        ID: {s.visitorId.slice(-6)}
                                      </span>
                                      <span className="text-[9px] py-0.5 px-1.5 rounded-full bg-violet-950/15 text-violet-400 font-bold border border-violet-500/10">
                                        Source: {s.trafficSource}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-200 mt-1 font-semibold leading-none">
                                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                      <span>{s.city || 'Unknown'}, {s.country || 'India'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Middle segment: Specs details */}
                                <div className="flex items-center gap-3.5 text-xs font-mono text-gray-400 flex-wrap">
                                  <span className="py-1 px-2.5 rounded bg-slate-900 border border-gray-800 text-gray-300">
                                    {s.device.toUpperCase()}
                                  </span>
                                  <span>{s.os}</span>
                                  <span>{s.browser}</span>
                                </div>

                                {/* Right segment: Time spent & Button indicator */}
                                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                                  <div className="text-right">
                                    <div className="flex items-center sm:justify-end gap-1 text-xs font-bold text-white leading-none">
                                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      <span>{formatDuration(s.duration)} Stay</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 block mt-1">{entryFormatted}</span>
                                  </div>
                                  <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${
                                    isExpanded ? 'rotate-90 text-violet-400' : ''
                                  }`} />
                                </div>
                              </div>

                              {/* Expanded activities panel */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden border-t border-gray-900/60 bg-slate-950/20"
                                  >
                                    <div className="p-5 sm:p-6 space-y-4">
                                      <div className="flex items-center justify-between border-b border-gray-900/60 pb-3">
                                        <h4 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                                          <span>Engagement Path Timeline</span>
                                          <span className="text-[10px] font-normal text-gray-500">({totalSectionsVisited} checkpoints)</span>
                                        </h4>
                                        <span className="font-mono text-[9px] bg-slate-900 border border-gray-850 py-0.5 px-2.5 rounded text-gray-400">
                                          Device IP: {s._id?.startsWith('sandbox') ? 'Mock API Sandbox' : 'Collected Port 3000'}
                                        </span>
                                      </div>

                                      <div className="relative border-l border-gray-850 pl-5 space-y-5 ml-2.5 py-1">
                                        {(s.pagesVisited || []).map((pv, idx) => {
                                          const pageTime = formatDuration(pv.timeSpent || 0);
                                          const stepTime = pv.enteredAt ? new Date(pv.enteredAt).toLocaleTimeString() : 'N/A';
                                          const bgSpotlight = pv.timeSpent > 30 ? 'bg-emerald-400/10 text-emerald-400 border-emerald-500/10' : pv.timeSpent > 10 ? 'bg-violet-400/10 text-violet-400 border-violet-500/10' : 'bg-slate-900 text-gray-400 border-gray-800';

                                          return (
                                            <div key={idx} className="relative group">
                                              {/* Timeline Node dot */}
                                              <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-slate-950 flex items-center justify-center ring-4 ring-slate-950/30" />
                                              
                                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-900/50 bg-slate-950/40 hover:border-gray-800 transition-colors">
                                                <div className="space-y-1">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-cyan-400 font-bold">#0{idx + 1}</span>
                                                    <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                                                      Section: {pv.page}
                                                    </span>
                                                  </div>
                                                  <span className="text-[10px] text-gray-500 block font-medium">Entered viewpoint at {stepTime}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 self-start sm:self-center">
                                                  <span className={`text-[10px] font-mono leading-none tracking-wide font-bold py-1 px-2.5 rounded-full border ${bgSpotlight}`}>
                                                    {pageTime} active focus
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    )}

  </div>
);
}
