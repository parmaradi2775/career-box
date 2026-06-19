import React from 'react';
import { JobNotification } from '../types';
import { Briefcase, Calendar, GraduationCap, ArrowRight, UserCheck } from 'lucide-react';

interface JobCardProps {
  job: JobNotification;
  onSelect: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function JobCard({ job, onSelect, isSaved, onToggleSave }: JobCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'latest-job': return 'bg-emerald-600 text-white border-emerald-900';
      case 'admit-card': return 'bg-red-700 text-white border-red-900';
      case 'result': return 'bg-blue-700 text-white border-blue-900';
      case 'answer-key': return 'bg-yellow-400 text-red-950 border-yellow-750';
      case 'syllabus': return 'bg-indigo-700 text-white border-indigo-900';
      case 'admission': return 'bg-purple-700 text-white border-purple-900';
      default: return 'bg-slate-800 text-white border-slate-900';
    }
  };

  const getFriendlyCategory = (category: string) => {
    switch (category) {
      case 'latest-job': return 'Latest Job';
      case 'admit-card': return 'Admit Card';
      case 'result': return 'Exam Result';
      case 'answer-key': return 'Answer Key';
      case 'syllabus': return 'Syllabus';
      case 'admission': return 'Admission';
      default: return category;
    }
  };

  // Check how many days are left to apply
  const getDaysLeftMessage = () => {
    if (job.applicationEnd === 'N/A' || !job.applicationEnd) return null;
    const deadline = new Date(job.applicationEnd);
    const today = new Date('2026-06-19'); // Use current system mock date
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Application Closed', style: 'text-slate-500 bg-slate-100 font-bold border border-slate-300' };
    if (diffDays === 0) return { text: 'CLOSES TODAY!', style: 'text-red-700 bg-yellow-400 font-black border-2 border-red-750 animate-pulse' };
    if (diffDays <= 5) return { text: `${diffDays} DAYS LEFT!`, style: 'text-red-800 bg-orange-100 font-extrabold border border-orange-300 animate-bounce-short' };
    return { text: `${diffDays} days left`, style: 'text-slate-700 bg-slate-100 font-bold border border-slate-200' };
  };

  const daysLeft = getDaysLeftMessage();

  return (
    <div 
      id={`job-card-${job.id}`}
      className="group bg-white rounded-lg border-2 border-slate-900 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(185,28,28,1)] hover:border-red-700 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
      onClick={onSelect}
    >
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600" />

      <div>
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border-2 select-none ${getCategoryColor(job.category)}`}>
            {getFriendlyCategory(job.category)}
          </span>
          {daysLeft && (
            <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide ${daysLeft.style}`}>
              {daysLeft.text}
            </span>
          )}
        </div>

        <h3 className="font-black text-slate-900 group-hover:text-red-700 text-base md:text-md tracking-tight leading-snug mb-2 line-clamp-2 transition-colors">
          {job.title}
        </h3>

        <div className="space-y-1.5 text-xs text-slate-700 mt-3 border-t-2 border-dashed border-slate-200 pt-3 font-medium">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate uppercase font-bold tracking-tight text-slate-800">{job.department}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>Last Date: <span className="font-extrabold text-red-600">{job.applicationEnd}</span></span>
          </div>

          {job.vacancyDetails?.posts && job.vacancyDetails.posts.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200 mt-2">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate font-bold text-[11px] text-slate-700">
                Eligibility: {job.vacancyDetails.posts[0].eligibility}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {job.vacancyDetails?.totalPosts ? (
            <div className="text-[11px]">
              <span className="text-slate-500 font-bold">Total Vacancies: </span>
              <span className="font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-950 font-mono">
                {job.vacancyDetails.totalPosts.toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OFFICIAL NOTICE PDF</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`save-btn-${job.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={`p-1.5 rounded border-2 transition-all cursor-pointer ${
              isSaved 
                ? 'bg-red-700 text-white border-red-900 hover:bg-red-800' 
                : 'bg-white text-slate-600 border-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
          </button>
          
          <div className="text-red-700 group-hover:translate-x-1 transition-transform p-1 rounded border-2 border-transparent group-hover:border-slate-900 group-hover:bg-yellow-400 bg-slate-100">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
