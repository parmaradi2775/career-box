import { useState, useEffect } from 'react';
import { JobNotification } from './types';
import JobCard from './components/JobCard';
import JobDetailView from './components/JobDetailView';
import EligibilityMatcher from './components/EligibilityMatcher';
import PhotoResizer from './components/PhotoResizer';
import AIPrepAdvisor from './components/AIPrepAdvisor';
import { 
  Search, 
  Sparkles, 
  UserCheck, 
  Image as ImageIcon, 
  HelpCircle, 
  BookOpen, 
  Bookmark, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Info,
  Calendar,
  Mail,
  Instagram
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'matcher' | 'resizer' | 'ai-mentor' | 'cabinet'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobNotification | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  // Scraped online notifications state
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Scrape jobs list from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/scrape-jobs');
      if (!res.ok) throw new Error('Dynamic scrape server returned status code ' + res.status);
      const data = await res.json();
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Unable to scan sarkariresult.com portals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Load saved jobs from local storage
  useEffect(() => {
    try {
      const persisted = localStorage.getItem('career_box_saved_jobs_v1');
      if (persisted) {
        setSavedJobIds(JSON.parse(persisted));
      }
    } catch (e) {
      console.error('Local Storage read failure', e);
    }
  }, []);

  // Save jobs list
  const toggleSaveJob = (jobId: string) => {
    try {
      let updated: string[];
      if (savedJobIds.includes(jobId)) {
        updated = savedJobIds.filter(id => id !== jobId);
      } else {
        updated = [...savedJobIds, jobId];
      }
      setSavedJobIds(updated);
      localStorage.setItem('career_box_saved_jobs_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Local Storage write failure', e);
    }
  };

  // Hot ticker banners built dynamically based on real-time notifications
  const getDynamicTickers = () => {
    const defaultTickers = [
      "🔥 EXCLUSIVE: UPSC Civil Services merit list and banking exam registration links activated.",
      "📢 NTA NEET UG Entrance Examination Admit Cards are now active for download.",
      "🏆 HISTORIC: Civil Services Examination final rankings are declared.",
      "⚡ URGENT: Local Student Photo & Document Resizer tool updated to support PSC specifications.",
      "🎯 TARGET: Crack your examination with customized routines built by Career Box AI!"
    ];

    if (notifications && notifications.length > 0) {
      const live = notifications.slice(0, 3).map(n => {
        if (n.category === 'latest-job') {
          return `🔥 LATEST: ${n.title} is open. Apply by: ${n.applicationEnd}!`;
        } else if (n.category === 'admit-card') {
          return `📢 ADMIT CARD: ${n.title} is available for download now.`;
        } else if (n.category === 'result') {
          return `🏆 RESULT DECLARED: ${n.title} is published.`;
        }
        return `✨ NEW UPDATED: ${n.title}`;
      });
      return [...live, ...defaultTickers.slice(3)];
    }
    return defaultTickers;
  };

  const tickers = getDynamicTickers();

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [tickers.length]);

  // Filter lists based on Search & Select query
  const filteredJobs = notifications.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.shortTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategoryFilter === 'all') {
      return matchesSearch;
    }
    return matchesSearch && job.category === selectedCategoryFilter;
  });

  // Separate jobs into Sarkari's famous 3 columns for the primary view
  const getJobsBySpecificCategory = (cat: 'latest-job' | 'admit-card' | 'result') => {
    return filteredJobs.filter(job => job.category === cat);
  };

  const getSubcategoryJobs = () => {
    return filteredJobs.filter(job => ['answer-key', 'syllabus', 'admission'].includes(job.category));
  };

  const getSavedJobs = () => {
    return notifications.filter(job => savedJobIds.includes(job.id));
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-yellow-400 selection:text-red-950">
      
      {/* Top Tri-color Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 via-white to-emerald-600 flex-shrink-0" />

      {/* TOP BRANDING HEADER: CAREER BOX CLASSIC RED */}
      <header className="bg-red-700 text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-red-900 shadow-md">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none m-0">CAREER BOX</h1>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-red-100 mt-1 select-none">
            WWW.CAREERBOX.COM - INDIA'S NO. 1 EDUCATION PORTAL
          </p>
        </div>
        
        {/* Utility Indicators */}
        <div className="md:text-right mt-3 md:mt-0">
          <div className="flex flex-wrap md:justify-end gap-3 text-[10px] font-mono text-red-150 font-bold uppercase tracking-wide">
            <span className="flex items-center gap-1 bg-red-850 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
              STATUS: ONLINE (2026)
            </span>
            <span className="bg-red-850 px-2 py-0.5 rounded">UTC: 2026-06-19</span>
          </div>
        </div>
      </header>

      {/* CLASSIC NAVIGATION BAR (GOLDEN YELLOW RETRO RAIL) */}
      <nav className="bg-yellow-400 border-b-2 border-yellow-500 py-2.5 px-4 flex-shrink-0 shadow-inner sticky top-0 z-40 overflow-hidden">
        <div className="max-w-7xl mx-auto flex overflow-x-auto whitespace-nowrap gap-2 scrollbar-none items-center">
          <span className="text-[10px] bg-red-700 text-white font-black px-2 py-1 rounded tracking-wider uppercase shrink-0 mr-1 select-none">
            PORTAL NAV
          </span>
          
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer border-2 ${
              activeTab === 'dashboard'
                ? 'bg-red-700 text-white border-red-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-red-700 border-yellow-550 hover:bg-red-50'
            }`}
          >
            Jobs Dashboard
          </button>

          <button
            id="tab-matcher"
            onClick={() => setActiveTab('matcher')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer border-2 ${
              activeTab === 'matcher'
                ? 'bg-red-700 text-white border-red-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-red-700 border-yellow-550 hover:bg-red-50'
            }`}
          >
            Eligibility Matcher
          </button>

          <button
            id="tab-ai-mentor"
            onClick={() => setActiveTab('ai-mentor')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer border-2 ${
              activeTab === 'ai-mentor'
                ? 'bg-red-700 text-white border-red-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-red-700 border-yellow-550 hover:bg-red-50'
            }`}
          >
            Career Box AI Guide 🤖
          </button>

          <button
            id="tab-resizer"
            onClick={() => setActiveTab('resizer')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer border-2 ${
              activeTab === 'resizer'
                ? 'bg-red-700 text-white border-red-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-red-700 border-yellow-550 hover:bg-red-50'
            }`}
          >
            Photo Resizer
          </button>

          <button
            id="tab-cabinet"
            onClick={() => setActiveTab('cabinet')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer border-2 ${
              activeTab === 'cabinet'
                ? 'bg-red-700 text-white border-red-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-red-700 border-yellow-550 hover:bg-red-50'
            }`}
          >
            My Cabinet ({savedJobIds.length})
          </button>
        </div>
      </nav>

      {/* SCROLLING NEWS REEL (STATIC BUT INTERACTIVE TICKER IN SARKARI GOLD & DEEP RED ACCENTS) */}
      <div className="bg-red-900 text-slate-100 py-2 px-4 flex-shrink-0 overflow-hidden border-b-2 border-red-950">
        <div className="max-w-7xl mx-auto flex items-center">
          <span className="bg-yellow-405 bg-yellow-400 text-red-950 text-[10px] font-black px-2.5 py-0.5 rounded-sm mr-4 shrink-0 animate-pulse uppercase tracking-widest select-none">
            FLASH NEWS
          </span>
          <div className="flex-1 overflow-hidden relative h-5">
            <div key={tickerIndex} className="text-xs font-extrabold italic text-yellow-300 truncate animate-slide-up leading-tight">
              {tickers[tickerIndex]}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 font-sans">
        
        {/* TAB WORKSPACE 1: PRIMARY SARKARI DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Search Filter Controls bar */}
            <div className="bg-white border-2 border-slate-900 p-4.5 rounded-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Left search */}
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 stroke-[2.5]" />
                <input 
                  id="search-input"
                  type="text"
                  placeholder="Fuzzy search (SSC CGL, IAS, NTA admit card)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-sans bg-slate-50 placeholder-slate-500 border-2 border-slate-900 rounded-md pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-200 font-extrabold transition-all"
                />
              </div>

              {/* Right filters */}
              <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
                {[
                  { value: 'all', label: 'All Updates' },
                  { value: 'latest-job', label: 'Latest Jobs' },
                  { value: 'admit-card', label: 'Admit Cards' },
                  { value: 'result', label: 'Results' },
                  { value: 'answer-key', label: 'Answer Keys' },
                  { value: 'syllabus', label: 'Syllabus' },
                  { value: 'admission', label: 'Admissions' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedCategoryFilter(opt.value)}
                    className={`text-[11px] px-3 py-1.5 rounded border-2 transition-all cursor-pointer font-black uppercase ${
                      selectedCategoryFilter === opt.value
                        ? 'bg-red-700 text-white border-red-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] font-black'
                        : 'bg-white border-slate-400 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

            </div>

            {/* INTERACTIVE BENTO QUICK SHORTCUTS GRID (SARKARI RETRO INSPIRED) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                onClick={() => { setSearchQuery('UPSC'); }}
                className="bg-blue-700 text-white p-3.5 rounded-lg text-center border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:scale-[1.01] active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black tracking-widest uppercase opacity-85 select-none">UNION BOARD</div>
                <div className="text-[14px] font-black leading-tight mt-1 group-hover:underline">UPSC CSE Specials</div>
              </div>
              <div 
                onClick={() => { setSearchQuery('SSC'); }}
                className="bg-emerald-700 text-white p-3.5 rounded-lg text-center border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:scale-[1.01] active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black tracking-widest uppercase opacity-85 select-none">COMMISSION</div>
                <div className="text-[14px] font-black leading-tight mt-1 group-hover:underline">SSC CGL & GD 2026</div>
              </div>
              <div 
                onClick={() => { setSearchQuery('NTA'); }}
                className="bg-purple-700 text-white p-3.5 rounded-lg text-center border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:scale-[1.01] active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black tracking-widest uppercase opacity-85 select-none">TESTING AGENCY</div>
                <div className="text-[14px] font-black leading-tight mt-1 group-hover:underline">NTA NEET / NET Cards</div>
              </div>
              <div 
                onClick={() => { setSearchQuery('Railway'); }}
                className="bg-orange-600 text-white p-3.5 rounded-lg text-center border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:scale-[1.01] active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-black tracking-widest uppercase opacity-85 select-none">INDIAN RAILWAYS</div>
                <div className="text-[14px] font-black leading-tight mt-1 group-hover:underline">RRB NTPC Vacancy</div>
              </div>
            </div>

            {/* If Category is All - show the classic Sarkari 3-column table box */}
            {loading ? (
              <div className="py-20 text-center bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700 mx-auto" />
                <p className="text-sm font-black text-slate-800 uppercase tracking-widest animate-pulse">Scraping Real-Time sarkariresult.com Directory...</p>
                <p className="text-xs text-slate-500">Connecting to Sarkari servers to retrieve official 2026 recruitments, admit cards and results.</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
                <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-red-700 border border-red-200">
                  <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-wide">Live Stream Connection Issue</p>
                  <p className="text-xs text-slate-500 mt-1">{error}</p>
                </div>
                <button 
                  onClick={fetchJobs} 
                  className="bg-red-700 hover:bg-red-800 text-white font-black text-xs px-5 py-2.5 border-2 border-slate-900 rounded shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 cursor-pointer transition-all"
                >
                  Retry Scrape 🔄
                </button>
              </div>
            ) : selectedCategoryFilter === 'all' && !searchQuery ? (
              <div className="space-y-6">
                
                {/* Visual Header */}
                <div className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-4 h-4 text-red-700 stroke-[3]" />
                  <span className="text-xs font-black uppercase tracking-widest">India's Official Recuitment Bulletin Tables</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Column 1: LATEST JOBS (EMERALD RECT) */}
                  <div className="bg-white border-2 border-slate-900 rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                    <div className="bg-emerald-700 text-white border-b-2 border-slate-900 py-3.5 px-4 flex items-center justify-between select-none">
                      <span className="font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5 italic font-black">
                        <Layers className="w-4 h-4" /> Latest Jobs
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-200 px-2 py-0.5 rounded font-mono font-black border border-emerald-900">
                        {getJobsBySpecificCategory('latest-job').length} Active
                      </span>
                    </div>
                    <div className="divide-y divide-slate-200 divide-dashed max-h-[500px] overflow-y-auto">
                      {getJobsBySpecificCategory('latest-job').map(job => (
                        <div 
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-xs text-slate-700"
                        >
                          <span className="text-[9px] uppercase font-bold text-slate-450 block mb-0.5">{job.department}</span>
                          <span className="font-black text-blue-700 group-hover:text-red-700 group-hover:underline transition-colors leading-snug line-clamp-2">
                            • {job.title}
                          </span>
                          <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-500 font-bold">
                            <span>Last Date: <span className="text-red-650 font-extrabold">{job.applicationEnd}</span></span>
                            <span className="bg-slate-100 text-slate-800 border-2 border-slate-300 px-1.5 py-0.5 rounded font-black font-mono">₹{job.applicationFee.general_obc_ews}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: ADMIT CARDS (RED RECT) */}
                  <div className="bg-white border-2 border-slate-900 rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                    <div className="bg-red-750 bg-red-700 text-white border-b-2 border-slate-900 py-3.5 px-4 flex items-center justify-between select-none">
                      <span className="font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5 italic font-black">
                        <Layers className="w-4 h-4" /> Admit Cards
                      </span>
                      <span className="text-[10px] bg-red-950 text-red-200 px-2 py-0.5 rounded font-mono font-black border border-red-900">
                        {getJobsBySpecificCategory('admit-card').length} Available
                      </span>
                    </div>
                    <div className="divide-y divide-slate-200 divide-dashed max-h-[500px] overflow-y-auto">
                      {getJobsBySpecificCategory('admit-card').map(job => (
                        <div 
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-xs text-slate-700"
                        >
                          <span className="text-[9px] uppercase font-bold text-slate-450 block mb-0.5">{job.department}</span>
                          <span className="font-black text-red-700 group-hover:text-red-900 group-hover:underline transition-colors leading-snug line-clamp-2">
                            • {job.title}
                          </span>
                          <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-500 font-bold">
                            <span>Exam Date: <span className="text-slate-850 font-extrabold">{job.examDate || 'Refer Card'}</span></span>
                            <span className="bg-yellow-400 text-red-950 px-1.5 py-0.5 rounded font-black uppercase text-[9px] border border-red-750">Admit Out</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: RESULTS (BLUE RECT) */}
                  <div className="bg-white border-2 border-slate-900 rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                    <div className="bg-blue-700 text-white border-b-2 border-slate-900 py-3.5 px-4 flex items-center justify-between select-none">
                      <span className="font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5 italic font-black">
                        <Layers className="w-4 h-4" /> Exam Results
                      </span>
                      <span className="text-[10px] bg-blue-950 text-blue-200 px-2 py-0.5 rounded font-mono font-black border border-blue-900">
                        {getJobsBySpecificCategory('result').length} Declared
                      </span>
                    </div>
                    <div className="divide-y divide-slate-200 divide-dashed max-h-[500px] overflow-y-auto">
                      {getJobsBySpecificCategory('result').map(job => (
                        <div 
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-xs text-slate-700"
                        >
                          <span className="text-[9px] uppercase font-bold text-slate-450 block mb-0.5">{job.department}</span>
                          <span className="font-black text-blue-755 text-blue-800 group-hover:text-red-700 group-hover:underline transition-colors leading-snug line-clamp-2">
                            • {job.title}
                          </span>
                          <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-500 font-bold">
                            <span>Declared: <span className="text-slate-850 font-extrabold">{job.resultDeclared || 'Complete'}</span></span>
                            <span className="bg-green-150 text-green-900 px-1.5 py-0.5 rounded font-black uppercase text-[9px] border border-green-300">Declared</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Subcategory Grid for Answer Keys, Syllabus and Admissions */}
                <div className="border-2 border-slate-900 rounded-lg p-5 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5 uppercase select-none">
                    <Layers className="w-4 h-4 text-red-700" />
                    Admissions, Answer Keys, & Academic Syllabi Syllabus Guidelines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['answer-key', 'syllabus', 'admission'].map(subCat => {
                      const matches = filteredJobs.filter(j => j.category === subCat);
                      const labels: any = {
                        'answer-key': { tag: 'Answer Key', col: 'text-red-700 bg-red-50 border-red-300' },
                        'syllabus': { tag: 'Syllabus Guidelines', col: 'text-indigo-700 bg-indigo-50 border-indigo-300' },
                        'admission': { tag: 'Admission Announcements', col: 'text-purple-750 text-purple-700 bg-purple-50 border-purple-300' }
                      };
                      return (
                        <div key={subCat} className="bg-slate-50 rounded p-4 border-2 border-slate-800 flex flex-col justify-between">
                          <div>
                            <span className={`text-[10px] uppercase font-black px-2.5 py-1 border-2 rounded block w-max ${labels[subCat].col}`}>
                              {labels[subCat].tag}
                            </span>
                            <div className="space-y-2 mt-3 text-xs">
                              {matches.map(job => (
                                <div
                                  key={job.id}
                                  onClick={() => setSelectedJob(job)}
                                  className="hover:text-red-705 text-blue-700 font-extrabold hover:text-red-700 cursor-pointer hover:underline transition-all truncate leading-relaxed"
                                >
                                  • {job.shortTitle}
                                </div>
                              ))}
                              {matches.length === 0 && (
                                <div className="text-slate-400 italic">No announcements available</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              // Filtered list display or searches results
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-800 font-bold bg-white border-2 border-slate-900 p-3 rounded">
                  <span>Filtered Portal Stream Announcement Archive ({filteredJobs.length} records):</span>
                  {(searchQuery || selectedCategoryFilter !== 'all') && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategoryFilter('all');
                      }}
                      className="text-red-700 font-black hover:underline uppercase tracking-wide select-none cursor-pointer"
                    >
                      Clear All Filters ❌
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredJobs.map(job => (
                    <JobCard 
                      key={job.id}
                      job={job}
                      onSelect={() => setSelectedJob(job)}
                      isSaved={savedJobIds.includes(job.id)}
                      onToggleSave={() => {
                        toggleSaveJob(job.id);
                      }}
                    />
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <Info className="w-8 h-8 text-red-700 mx-auto mb-2 stroke-[2.5]" />
                      <p className="text-sm font-black text-slate-900">No active notifications found.</p>
                      <p className="text-xs text-slate-500 mt-1">Try modifying your query or filter parameters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General Information Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 rounded-xl text-white">
              <div className="md:col-span-3">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  Career Box AI Assistant Engine Is Active
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Confused about complicated exam schemes or whether you meet the age relaxation criteria? Choose the **Career Box AI Guide** tab on the navigation layout. Ask Gemini anything directly or configure mock series. Completely secure and localized for Indian board candidates.
                </p>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setActiveTab('ai-mentor')}
                  className="bg-emerald-605 hover:bg-emerald-600 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Ask AI Advisor
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB WORKSPACE 2: ELIGIBILITY MATCHER */}
        {activeTab === 'matcher' && (
          <EligibilityMatcher 
            notifications={notifications}
            onSelectJob={(job) => {
              setSelectedJob(job);
            }}
          />
        )}

        {/* TAB WORKSPACE 3: AI GUIDE CHAT ONLY */}
        {activeTab === 'ai-mentor' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                Career Box Exam Mentor Study Advisor Room
              </h3>
              <p className="text-xs text-slate-450 text-slate-500 leading-relaxed mb-4">
                Chat side-by-side with our AI assistant who understands all Indian job directories. Plan subject routines, discover best preparation textbooks, resolve category relaxation thresholds (ex-servicemen, OBC, SC/ST, pwd), or check exam dates.
              </p>
              <AIPrepAdvisor />
            </div>
          </div>
        )}

        {/* TAB WORKSPACE 4: STUDENT PHOTO RESIZER */}
        {activeTab === 'resizer' && (
          <PhotoResizer />
        )}

        {/* TAB WORKSPACE 5: MY BOOKMARKED CABINET */}
        {activeTab === 'cabinet' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div>
                <h3 className="font-bold text-slate-850 text-sm">My Saved Career Box Cabinet</h3>
                <p className="text-[11px] text-slate-450 text-slate-500 mt-0.5">Track registration dates, write syllabus pointers, and prepare securely.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                Saved: {savedJobIds.length} Exams
              </span>
            </div>

            {getSavedJobs().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {getSavedJobs().map(job => (
                  <JobCard 
                    key={job.id}
                    job={job}
                    onSelect={() => setSelectedJob(job)}
                    isSaved={true}
                    onToggleSave={() => toggleSaveJob(job.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-semibold text-slate-700">Cabinet is currently empty</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Browse open positions in the dashboard and click the star icon on relevant listings to persist them here.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Browse Latest Jobs
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* DETAIL DRAWER OVERLAY POPUP */}
      {selectedJob && (
        <JobDetailView 
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isSaved={savedJobIds.includes(selectedJob.id)}
          onToggleSave={() => toggleSaveJob(selectedJob.id)}
        />
      )}

      {/* ABOUT DEVELOPER POPUP MODAL */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-905 border border-slate-800 bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsDevModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-2xl font-bold p-1 cursor-pointer"
              title="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 via-pink-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-lg mb-4">
                AP
              </div>
              <h3 className="text-xl font-bold text-slate-100">Aditya Parmar</h3>
              <p className="text-xs text-slate-400 mt-1">Developed & Managed by Aditya Parmar (Budlay)</p>
              <div className="w-12 h-0.5 bg-emerald-500 my-4 rounded-full"></div>
              <p className="text-xs text-slate-300 px-4 leading-relaxed">
                Empowering government job candidates across India with fast, dynamic, real-time exam notifications, live news summaries, admit cards, dynamic document resizers, and AI-enabled mentor services.
              </p>
              
              <div className="w-full space-y-3 mt-6">
                <a 
                  href="mailto:adityaparmar1822@gmail.com"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-200 transition-all font-medium group"
                >
                  <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left flex-1">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Email Address</span>
                    adityaparmar1822@gmail.com
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">Email</span>
                </a>

                <a 
                  href="https://instagram.com/aditya_parmar18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-200 transition-all font-medium group"
                >
                  <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left flex-1">
                    <span className="block text-slate-500 text-[10px] uppercase font-bold">Instagram Handle</span>
                    @aditya_parmar18
                  </div>
                  <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full">Follow</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => setIsDevModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4.5 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-905 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-8 mt-auto flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-extrabold text-slate-200 uppercase tracking-tight text-[11px]">CAREER BOX RECRUITMENT PORTAL</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed max-w-md">
              Providing instant access to verified recruitments, live sarkari result summaries, admit cards, and AI-enabled study trackers.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
            <p className="text-[10px] text-slate-500 md:text-right">
              © 2026 Career Box Platform. Developed & Managed by Aditya Parmar (Budlay). All rights reserved. Powered by Gemini AI.
            </p>
            <button 
              onClick={() => setIsDevModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-all self-start md:self-end cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              About Developer
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
