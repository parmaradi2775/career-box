import { useState } from 'react';
import { EligibilityInput, JobNotification } from '../types';
import { UserCheck, HelpCircle, Sparkles, RefreshCw, Calendar, Award, ShieldAlert } from 'lucide-react';

interface EligibilityMatcherProps {
  onSelectJob: (job: JobNotification) => void;
  notifications: JobNotification[];
}

export default function EligibilityMatcher({ onSelectJob, notifications }: EligibilityMatcherProps) {
  const [dob, setDob] = useState('2000-01-01');
  const [qualification, setQualification] = useState('Graduate');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [results, setResults] = useState<JobNotification[] | null>(null);

  const calculateAge = (birthDateString: string, targetDateString: string) => {
    const today = new Date(targetDateString);
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleMatch = () => {
    // Generate age on default mock current date: 2026-06-19
    const age = calculateAge(dob, '2026-06-19');
    setCalculatedAge(age);

    // Apply filters
    const matched = notifications.filter(job => {
      // 1. Category check
      if (job.category !== 'latest-job' && job.category !== 'admission' && job.category !== 'admit-card') {
        const hasValidFields = job.vacancyDetails?.posts && job.vacancyDetails.posts.length > 0;
        if (!hasValidFields) return false;
      }

      // 2. Age limit calculation
      let minLimit = job.ageLimit.minAge;
      let maxLimit = job.ageLimit.maxAge;

      // Apply standard Career Box age relaxation rules:
      // OBC gets +3 years, SC/ST gets +5 years
      if (category === 'OBC') {
        maxLimit += 3;
      } else if (category === 'SC' || category === 'ST') {
        maxLimit += 5;
      }

      if (age < minLimit || age > maxLimit) {
        return false;
      }

      // 3. Qualification Matcher (Heuristics check string in first post eligibility)
      if (job.vacancyDetails?.posts && job.vacancyDetails.posts.length > 0) {
        const reqStr = job.vacancyDetails.posts[0].eligibility.toLowerCase();
        
        if (qualification === '10th Pass') {
          // Can check if requires 10th or high school (and NOT requiring 12th or graduate)
          const requiresHigher = reqStr.includes('degree') || reqStr.includes('graduate') || reqStr.includes('12th') || reqStr.includes('passed 12');
          if (requiresHigher) return false;
        } else if (qualification === '12th Pass') {
          // Can do: not requiring graduate or degree
          const requiresGraduate = reqStr.includes('degree') || reqStr.includes('graduate') || reqStr.includes('bachelor') || reqStr.includes('master');
          if (requiresGraduate) return false;
        } else if (qualification === 'Graduate') {
          const requiresMaster = reqStr.includes('master');
          if (requiresMaster) return false;
        }
      }

      return true;
    });

    setResults(matched);
  };

  return (
    <div id="eligibility-matcher" className="bg-white rounded border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] font-sans">
      <div className="flex items-center gap-3 mb-5 border-b-2 border-slate-250 pb-3">
        <div className="p-2 bg-red-700 rounded border-2 border-slate-950 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] select-none">
          <UserCheck className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Career Box Eligibility Matcher</h2>
          <p className="text-xs text-slate-550 font-bold">Calculate age & quota relaxations instantly against central directories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded border-2 border-slate-900 mb-6 font-bold">
        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1 select-none">
            <Calendar className="w-3.5 h-3.5 text-red-700 stroke-[2.5]" />
            Date of Birth
          </label>
          <input 
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full text-xs bg-white border-2 border-slate-900 rounded p-2 focus:ring-2 focus:ring-red-200 focus:border-red-700 font-extrabold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1 select-none">
            <Award className="w-3.5 h-3.5 text-red-700 stroke-[2.5]" />
            Education Level
          </label>
          <select
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full text-xs bg-white border-2 border-slate-900 rounded p-2 focus:ring-2 focus:ring-red-200 focus:border-red-700 font-extrabold focus:outline-none cursor-pointer text-slate-900"
          >
            <option value="10th Pass">Class 10th (High School)</option>
            <option value="12th Pass">Class 12th (Intermediate)</option>
            <option value="Graduate">Bachelor Degree (Graduate)</option>
            <option value="Master Degree">Master Degree / Post Graduate</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1 select-none">
            Category Quota
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full text-xs bg-white border-2 border-slate-900 rounded p-2 focus:ring-2 focus:ring-red-200 focus:border-red-700 font-extrabold focus:outline-none cursor-pointer text-slate-900"
          >
            <option value="General">General (Unreserved)</option>
            <option value="OBC">OBC (Other Backward Class)</option>
            <option value="SC">SC (Scheduled Caste)</option>
            <option value="ST">ST (Scheduled Tribe)</option>
            <option value="EWS">EWS (Economically Weaker Section)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1 select-none">
            Gender Identity
          </label>
          <div className="flex gap-2 h-9 items-center mt-0.5">
            {['Male', 'Female', 'Other'].map(g => (
              <button
                key={g}
                onClick={() => setGender(g as any)}
                type="button"
                className={`flex-1 text-[11px] py-2 border-2 rounded transition-all cursor-pointer font-black uppercase ${
                  gender === g 
                    ? 'bg-red-700 text-white border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] font-black' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button 
          onClick={handleMatch}
          className="bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 stroke-[2.5]" />
          Check Eligibility Result
        </button>
      </div>

      {calculatedAge !== null && (
        <div id="matcher-results" className="border-t-2 border-slate-200 pt-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded bg-yellow-400 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-6">
            <div>
              <p className="text-xs text-slate-950 font-black uppercase tracking-wider">Calculated Age on 19-June-2026:</p>
              <h4 className="text-3xl font-black text-slate-950 font-mono mt-0.5">{calculatedAge} Years Old</h4>
            </div>
            {category !== 'General' && (
              <div className="flex items-center gap-2 bg-white text-slate-900 text-xs px-3.5 py-2 rounded border-2 border-slate-900 font-black">
                <Sparkles className="w-3.5 h-3.5 text-red-700 animate-spin stroke-[2.5]" />
                <span>Relaxation Rules: <strong>+{category === 'OBC' ? '3' : '5'} Years</strong> allowed for {category}</span>
              </div>
            )}
          </div>

          <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-3 select-none">
            Matching Exams and Announcements ({results?.length || 0})
          </h3>

          {results && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(job => (
                <div 
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-white hover:bg-slate-50 border-2 border-slate-900 rounded p-4 cursor-pointer transition-all flex justify-between items-center group shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-bold text-xs"
                >
                  <div className="truncate pr-3">
                    <span className="text-[10px] uppercase font-black text-emerald-800 bg-emerald-100 border-2 border-slate-900 px-2.5 py-0.5 rounded">
                      Eligible ✔
                    </span>
                    <h5 className="font-black text-slate-900 text-sm truncate mt-2 group-hover:text-red-750 group-hover:underline transition-colors">
                      {job.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 truncate font-medium">
                      Board: {job.department}
                    </p>
                  </div>
                  <div className="text-red-700 bg-white hover:bg-slate-50 py-1.5 px-3 rounded border-2 border-slate-900 hover:border-red-700 transition-all flex-shrink-0 font-black text-[11px] uppercase tracking-wide">
                    Open Bulletin
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded border-2 border-dashed border-slate-400">
              <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto mb-2 stroke-[2.5]" />
              <p className="text-sm font-black text-slate-900">No active positions matching your criteria</p>
              <p className="text-xs text-slate-550 mt-1 font-semibold">Try updating your qualifications or reserve category settings.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
