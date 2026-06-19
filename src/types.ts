export interface JobNotification {
  id: string;
  title: string;
  shortTitle: string;
  department: string;
  category: 'latest-job' | 'admit-card' | 'result' | 'answer-key' | 'syllabus' | 'admission';
  postDate: string;
  applicationStart: string;
  applicationEnd: string;
  lastDateFeePayment?: string;
  examDate?: string;
  admitCardAvailable?: string;
  resultDeclared?: string;
  applicationFee: {
    general_obc_ews: number;
    sc_st_ph: number;
    female: number;
    feeDetails: string;
  };
  ageLimit: {
    minAge: number;
    maxAge: number;
    ageAsOn: string;
    description?: string;
  };
  vacancyDetails: {
    totalPosts: number;
    posts: Array<{
      postName: string;
      totalCount: number;
      eligibility: string;
    }>;
  };
  importantLinks: {
    applyOnline?: string;
    downloadAdmitCard?: string;
    downloadResult?: string;
    downloadAnswerKey?: string;
    downloadSyllabus?: string;
    officialWebsite?: string;
  };
  detailedDescription?: string;
}

export interface EligibilityInput {
  dob: string;
  qualification: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  gender: 'Male' | 'Female' | 'Other';
}

export interface UserSavedJob {
  jobId: string;
  savedAt: string;
  notes?: string;
}
