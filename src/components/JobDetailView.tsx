import { JobNotification } from '../types';
import { X, Calendar, Wallet, Award, Briefcase, FileText, Globe, Sparkles, AlertCircle } from 'lucide-react';
import AIPrepAdvisor from './AIPrepAdvisor';

interface JobDetailViewProps {
  job: JobNotification;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function JobDetailView({ job, onClose, isSaved, onToggleSave }: JobDetailViewProps) {
  return (
    <div id={`job-detail-overlay-${job.id}`} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in font-sans">
      <div className="bg-white w-full max-w-4xl h-full flex flex-col shadow-2xl relative animate-slide-left overflow-hidden border-l-4 border-slate-950">
        
        {/* Header toolbar with robust Career Box crimson style */}
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between border-b-4 border-slate-950 flex-shrink-0">
          <div className="flex-1 truncate pr-4">
            <span className="text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-2.5 py-0.5 rounded border border-slate-900 uppercase tracking-wider select-none">
              {job.category} BULLETIN
            </span>
            <h2 className="font-black text-lg md:text-xl text-white truncate mt-2 uppercase tracking-tight">
              {job.title}
            </h2>
            <p className="text-xs text-red-150 font-bold truncate mt-0.5">
              Conducted by: {job.department}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="details-favorite"
              onClick={onToggleSave}
              className={`px-3 py-1.5 rounded text-xs font-black border-2 transition-all cursor-pointer ${
                isSaved 
                  ? 'bg-yellow-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                  : 'bg-red-850 bg-red-800 text-white border-red-950 hover:bg-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              }`}
            >
              {isSaved ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
            <button 
              id="details-close"
              onClick={onClose}
              className="p-1.5 bg-white text-slate-900 border-2 border-slate-950 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Scrollable Contents Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          
          {/* Quick Notice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Key Scheduling Dates */}
            <div className="border-2 border-slate-900 rounded bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-5">
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider mb-3.5 border-b-2 border-slate-300 pb-2.5">
                <Calendar className="w-4 h-4 text-red-700 stroke-[3]" />
                Schedule & Important Dates
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-dashed border-slate-300">
                    <td className="text-slate-600 py-2.5 font-bold">Application Open</td>
                    <td className="font-extrabold text-slate-900 text-right">{job.applicationStart}</td>
                  </tr>
                  <tr className="border-b border-dashed border-slate-300">
                    <td className="text-slate-600 py-2.5 font-bold">Last Date to Submit</td>
                    <td className="font-black text-rose-700 text-right">{job.applicationEnd}</td>
                  </tr>
                  <tr className="border-b border-dashed border-slate-300">
                    <td className="text-slate-600 py-2.5 font-bold">Last Fee Payment Date</td>
                    <td className="font-extrabold text-slate-900 text-right">{job.lastDateFeePayment}</td>
                  </tr>
                  {job.examDate && (
                    <tr className="border-b border-dashed border-slate-300">
                      <td className="text-slate-600 py-2.5 font-bold">CBT Exam Date</td>
                      <td className="font-black text-orange-600 text-right">{job.examDate}</td>
                    </tr>
                  )}
                  {job.admitCardAvailable && (
                    <tr className="border-b border-dashed border-slate-300">
                      <td className="text-slate-600 py-2.5 font-bold">Admit Card Release</td>
                      <td className="font-black text-emerald-700 text-right">{job.admitCardAvailable}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Box 2: Application Fee */}
            <div className="border-2 border-slate-900 rounded bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-5">
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider mb-3.5 border-b-2 border-slate-300 pb-2.5">
                <Wallet className="w-4 h-4 text-emerald-700 stroke-[3]" />
                Application Fee Structuring
              </div>
              <table className="w-full text-xs mb-4">
                <tbody>
                  <tr className="border-b border-dashed border-slate-300">
                    <td className="text-slate-600 py-2.5 font-bold">GN / OBC / EWS</td>
                    <td className="font-black text-slate-950 text-right">₹{job.applicationFee.general_obc_ews}</td>
                  </tr>
                  <tr className="border-b border-dashed border-slate-300">
                    <td className="text-slate-600 py-2.5 font-bold">SC / ST / PH Quota</td>
                    <td className="font-black text-slate-950 text-right">₹{job.applicationFee.sc_st_ph}</td>
                  </tr>
                  <tr className="border-b border-dashed border-slate-300">
                    <td className="text-slate-600 py-2.5 font-bold">Female Candidates</td>
                    <td className="font-black text-slate-950 text-right">₹{job.applicationFee.female}</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[10px] text-slate-800 bg-yellow-100 border-2 border-yellow-400 p-2.5 rounded leading-relaxed font-bold">
                <strong>Pay Mode:</strong> {job.applicationFee.feeDetails}
              </div>
            </div>
          </div>

          {/* Age Limit Details Box */}
          <div className="border-2 border-slate-900 rounded p-5 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider mb-4">
              <Award className="w-4 h-4 text-red-700 stroke-[3]" />
              Career Box Exam Age Limit Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded border-2 border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider">MINIMUM AGE LIMIT</span>
                  <span className="text-xl font-black text-slate-900">{job.ageLimit.minAge} Years</span>
                </div>
                <div className="w-0.5 h-10 bg-slate-300"></div>
                <div>
                  <span className="text-[9px] text-slate-500 font-black block uppercase tracking-wider">MAXIMUM AGE LIMIT</span>
                  <span className="text-xl font-black text-slate-900">{job.ageLimit.maxAge} Years</span>
                </div>
              </div>
              <div className="text-xs text-slate-700 flex flex-col justify-center font-bold">
                <p>Calculated Age as on: <strong className="text-slate-950 underline decoration-red-500 decoration-2">{job.ageLimit.ageAsOn}</strong></p>
                {job.ageLimit.description && (
                  <p className="mt-1.5 text-slate-550 italic font-medium leading-relaxed">*{job.ageLimit.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vacancy Table */}
          {job.vacancyDetails?.posts && job.vacancyDetails.posts.length > 0 && (
            <div className="border-2 border-slate-900 rounded overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="bg-slate-900 border-b-2 border-slate-950 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-white select-none gap-2">
                <span className="font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 italic">
                  <Briefcase className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
                  POST DESIGNATIONS & ELIGIBILITY SCHEMES
                </span>
                <span className="text-[11px] bg-red-700 text-white font-black px-2.5 py-1 rounded border border-slate-900">
                  Total Openings: {job.vacancyDetails.totalPosts} Posts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-800 border-b-2 border-slate-900 uppercase font-black tracking-wider">
                    <tr>
                      <th className="p-3.5 border-r border-slate-300">Post Designation</th>
                      <th className="p-3.5 text-center border-r border-slate-300">Total count</th>
                      <th className="p-3.5">Core Eligibility Criteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-slate-800 font-bold">
                    {job.vacancyDetails.posts.map((post, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-all">
                        <td className="p-3.5 font-black text-slate-950 border-r border-slate-300 bg-slate-50/50">{post.postName}</td>
                        <td className="p-3.5 text-center border-r border-slate-300"><span className="bg-slate-200 py-1 px-2.5 rounded font-black text-slate-900 border border-slate-400">{post.totalCount}</span></td>
                        <td className="p-3.5 text-slate-700 leading-relaxed max-w-xs">{post.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* How to fill instruction */}
          <div className="border-2 border-slate-900 rounded p-5 bg-emerald-50 divide-y divide-slate-300 space-y-3.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <AlertCircle className="w-4 h-4 text-emerald-800 stroke-[3]" />
              Official Portal Guidelines: How to apply online?
            </h4>
            <div className="pt-3.5 text-[11px] text-slate-850 font-bold space-y-2.5 leading-relaxed font-sans">
              <p className="flex items-start gap-1.5"><span>✔</span> <span>First Step: Verify eligibility protocols, criteria qualifications, and state reservation rules.</span></p>
              <p className="flex items-start gap-1.5"><span>✔</span> <span>Required Inputs: Prepare digital photograph, scan signatures, identity certificate (Aadhaar/PAN), and qualification records.</span></p>
              <p className="flex items-start gap-1.5"><span>✔</span> <span>Photo Sizer limits: Most portals mandate scanned photograph sizes under **50KB** and signatures under **20KB**. Click on the **Photo Resizer** utility in the top menu to shrink records in real-time.</span></p>
              <p className="flex items-start gap-1.5"><span>✔</span> <span>Submission: Read and double-check form spelling with matriculation marksheets prior to compiling submission. Pay the fee and print the receipt.</span></p>
            </div>
          </div>

          {/* Fast Action Application Buttons */}
          <div className="border-2 border-slate-900 bg-white rounded p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-slate-200 pb-2">
              RESOURCE CORNER DIRECT HOOKS
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {job.importantLinks.applyOnline && (
                <a 
                  href={job.importantLinks.applyOnline}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 px-4 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                  Apply Online Direct Link
                </a>
              )}
              {job.importantLinks.downloadAdmitCard && (
                <a 
                  href={job.importantLinks.downloadAdmitCard}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-yellow-405 bg-yellow-400 text-slate-900 font-black text-xs py-3 px-4 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                  Download Admit Link
                </a>
              )}
              {job.importantLinks.downloadResult && (
                <a 
                  href={job.importantLinks.downloadResult}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-700 text-white font-black text-xs py-3 px-4 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                  Download Saved Result
                </a>
              )}
              {job.importantLinks.downloadSyllabus && (
                <a 
                  href={job.importantLinks.downloadSyllabus}
                  className="bg-purple-700 text-white font-black text-xs py-3 px-4 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                  Download Exam Syllabus
                </a>
              )}
              {job.importantLinks.officialWebsite && (
                <a 
                  href={job.importantLinks.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3 px-4 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
                  Conducting Board Portal
                </a>
              )}
            </div>
          </div>

          {/* AI Syllabus Planner Integration */}
          <div className="border-2 border-slate-900 rounded overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="bg-slate-900 border-b-2 border-slate-950 px-5 py-3.5 flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse stroke-[2.5]" />
              <span className="font-extrabold text-xs uppercase tracking-wider italic">
                INTEGRATED AI PREPARATION CO-PILOT ADVISOR
              </span>
            </div>
            <div className="p-4 bg-slate-50">
              <AIPrepAdvisor job={job} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
