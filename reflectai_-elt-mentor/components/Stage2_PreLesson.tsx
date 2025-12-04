import React, { useState } from 'react';
import { TeachingContext, PreLessonInquiry } from '../types';
import { generatePreLessonQuestions } from '../services/geminiService';
import { Loader2, MessageCircle, ChevronRight, HelpCircle } from 'lucide-react';

interface Props {
  context: TeachingContext;
  preLesson: PreLessonInquiry;
  updatePreLesson: (data: PreLessonInquiry) => void;
  onNext: () => void;
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const Stage2_PreLesson: React.FC<Props> = ({ 
  context, preLesson, updatePreLesson, onNext, setLoading, isLoading 
}) => {
  const [step, setStep] = useState<number>(preLesson.aiQuestions.length > 0 ? 1 : 0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePreLesson({ ...preLesson, [e.target.name]: e.target.value });
  };

  const handleGenerateQuestions = async () => {
    if (!preLesson.lessonPlan) return;
    setLoading(true);
    try {
      const questions = await generatePreLessonQuestions(context, preLesson.lessonPlan);
      updatePreLesson({ ...preLesson, aiQuestions: questions });
      setStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Stage 2: Pre-Lesson Socratic Inquiry</h2>
        
        {/* Step 0: Plan Input */}
        <div className={step > 0 ? "opacity-50 pointer-events-none" : ""}>
          <label className="block text-lg font-medium text-slate-800 mb-2">The Planned Lesson</label>
          <p className="text-sm text-slate-500 mb-2">Briefly describe key stages (e.g., Lead-in, Presentation, Controlled Practice), materials, and interaction patterns.</p>
          <textarea 
            name="lessonPlan"
            value={preLesson.lessonPlan}
            onChange={handleTextChange}
            rows={5}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. 1. Lead-in with pictures. 2. Gist reading. 3. Guided discovery of present perfect. 4. Controlled practice drill..."
          />
          {step === 0 && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleGenerateQuestions}
                disabled={isLoading || !preLesson.lessonPlan}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <MessageCircle size={20} />}
                Generate Inquiry Questions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step 1: Questions & Answers */}
      {step >= 1 && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in-up">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <HelpCircle size={20} /> Mentor's Clarifying Questions
          </h3>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-indigo-800">
            {preLesson.aiQuestions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-900 mb-1">Your Responses</label>
              <textarea 
                name="teacherAnswers"
                value={preLesson.teacherAnswers}
                onChange={handleTextChange}
                rows={3}
                className="w-full p-3 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Thinking about these questions..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Challenges & Connection */}
      {step >= 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in-up">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">Anticipation & Guiding Inquiry</h3>
           
           <div className="space-y-6">
              <div>
                <label className="block text-md font-medium text-slate-700 mb-1">Anticipated Problems & Solutions</label>
                <p className="text-xs text-slate-500 mb-2">Meaning, Form, Pronunciation (MFP), L1 interference, cultural misunderstandings...</p>
                <textarea 
                  name="challenges"
                  value={preLesson.challenges}
                  onChange={handleTextChange}
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-slate-700 mb-1">Connection to Self-Observation</label>
                <p className="text-xs text-slate-500 mb-2">How does your self-observation focus (e.g. TTT) connect to this plan?</p>
                <textarea 
                  name="connectionToFocus"
                  value={preLesson.connectionToFocus}
                  onChange={handleTextChange}
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-slate-700 mb-1">One Guiding Inquiry</label>
                <p className="text-xs text-slate-500 mb-2">e.g., "What happens when I give instructions for the pair work?"</p>
                <textarea 
                  name="guidingInquiry"
                  value={preLesson.guidingInquiry}
                  onChange={handleTextChange}
                  rows={1}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
           </div>

           <div className="mt-8 flex justify-end">
              <button 
                onClick={onNext}
                disabled={!preLesson.teacherAnswers || !preLesson.guidingInquiry}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                Ready to Teach / Upload Data <ChevronRight size={20} />
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Stage2_PreLesson;