import React from 'react';
import { TeachingContext, MentorRole } from '../types';
import { generateMentorRole } from '../services/geminiService';
import { Loader2, UserCheck, ChevronRight } from 'lucide-react';

interface Props {
  context: TeachingContext;
  mentorRole: MentorRole;
  updateContext: (ctx: TeachingContext) => void;
  updateRole: (role: MentorRole) => void;
  onNext: () => void;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const Stage0_Context: React.FC<Props> = ({ 
  context, mentorRole, updateContext, updateRole, onNext, setLoading, isLoading 
}) => {
  
  // Set default subject if empty
  React.useEffect(() => {
    if (!context.subject) {
      updateContext({ ...context, subject: 'English Language Teaching (ELT)' });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateContext({ ...context, [e.target.name]: e.target.value });
  };

  const handleGenerateRole = async () => {
    if (!context.subject || !context.level) return; 
    setLoading(true);
    try {
      const roleDescription = await generateMentorRole(context);
      updateRole({ description: roleDescription, isConfirmed: false });
    } catch (error) {
      console.error("Failed to generate role", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmRole = () => {
    updateRole({ ...mentorRole, isConfirmed: true });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Stage 0: Establish ELT Context</h2>
        <p className="text-slate-600 mb-6">Tell me about your teaching environment so I can be the best reflective partner for you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Subject / Focus</label>
            <input 
              name="subject" 
              value={context.subject} 
              onChange={handleChange} 
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g., General English, EAP, Business English"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Level (CEFR / Grade)</label>
            <input 
              name="level" 
              value={context.level} 
              onChange={handleChange} 
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g., A2, B1 Intermediate, C1 Advanced"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Institutional Setting</label>
            <select 
              name="institution" 
              value={context.institution} 
              onChange={handleChange} 
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select setting...</option>
              <option value="Private Language School">Private Language School</option>
              <option value="University (EAP/Pre-sessional)">University (EAP/Pre-sessional)</option>
              <option value="State School (Primary/Secondary)">State School (Primary/Secondary)</option>
              <option value="Online (1-to-1)">Online (1-to-1)</option>
              <option value="In-Company / Business">In-Company / Business</option>
              <option value="Exam Preparation (IELTS/Cambridge)">Exam Preparation</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Class Profile</label>
            <input 
              name="classProfile" 
              value={context.classProfile} 
              onChange={handleChange} 
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g., Monolingual Spanish speakers, Mixed L1"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Experience</label>
            <input 
              name="experienceYears" 
              value={context.experienceYears} 
              onChange={handleChange} 
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g., 2 years post-CELTA, 10 years experience"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Areas of Expertise</label>
            <input 
              name="expertise" 
              value={context.expertise} 
              onChange={handleChange} 
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g., Young Learners, Exam classes, Dogme"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Relevant Background</label>
            <textarea 
              name="background" 
              value={context.background} 
              onChange={handleChange} 
              rows={2}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
              placeholder="Any specific context (e.g., unobserved lesson, exam pressure)..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleGenerateRole} 
            disabled={isLoading || !context.subject}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <UserCheck size={20} />}
            Meet Your Mentor
          </button>
        </div>
      </div>

      {mentorRole.description && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in-up">
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">Your ELT Reflective Partner</h3>
          <p className="text-indigo-800 leading-relaxed whitespace-pre-line">{mentorRole.description}</p>
          <div className="mt-6 flex justify-end">
             <button 
                onClick={confirmRole}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Confirm & Continue <ChevronRight size={20} />
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stage0_Context;