export interface TeachingContext {
  subject: string;
  level: string;
  institution: string;
  classProfile: string;
  experienceYears: string;
  expertise: string;
  background: string;
}

export interface MentorRole {
  description: string;
  isConfirmed: boolean;
}

export interface LessonFocus {
  aims: string;
  selfObservationAims: string;
}

export interface PreLessonInquiry {
  lessonPlan: string;
  aiQuestions: string[];
  teacherAnswers: string;
  challenges: string;
  connectionToFocus: string;
  guidingInquiry: string;
}

export interface LessonData {
  transcript: string;
}

export interface NarrativeReconstruction {
  narrative: string;
}

export interface ReflectionAnalysis {
  teacherReflection: string;
  comparison: string; // Markdown formatted analysis
}

export interface DeepInsight {
  socraticQuestions: string[];
  teacherResponses: string;
  aiSuggestions: string;
  futureQuestions: string;
}

export interface AppState {
  currentStage: number;
  context: TeachingContext;
  mentorRole: MentorRole;
  focus: LessonFocus;
  preLesson: PreLessonInquiry;
  data: LessonData;
  narrative: NarrativeReconstruction;
  reflection: ReflectionAnalysis;
  insight: DeepInsight;
  isLoading: boolean;
  error: string | null;
}

export const INITIAL_STATE: AppState = {
  currentStage: 0,
  context: {
    subject: '',
    level: '',
    institution: '',
    classProfile: '',
    experienceYears: '',
    expertise: '',
    background: '',
  },
  mentorRole: { description: '', isConfirmed: false },
  focus: { aims: '', selfObservationAims: '' },
  preLesson: {
    lessonPlan: '',
    aiQuestions: [],
    teacherAnswers: '',
    challenges: '',
    connectionToFocus: '',
    guidingInquiry: '',
  },
  data: { transcript: '' },
  narrative: { narrative: '' },
  reflection: { teacherReflection: '', comparison: '' },
  insight: {
    socraticQuestions: [],
    teacherResponses: '',
    aiSuggestions: '',
    futureQuestions: ''
  },
  isLoading: false,
  error: null,
};