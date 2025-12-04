import React from 'react';
import { LessonFocus } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  focus: LessonFocus;
  updateFocus: (focus: LessonFocus) => void;
  onNext: () => void;
}

const Stage1_Focus: React.FC<Props> = ({ focus, updateFocus, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFocus({ ...focus, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Stage 1: Establishing the Lesson Focus</h2>
      <p className="text-slate-600 mb-6">Before we look at the plan, let's clarify your intentions for this language lesson.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-slate-800 mb-2">Lesson Aims (Main & Subsidiary)</label>
          <p className="text-sm text-slate-500 mb-2">What language systems or skills did you want students to improve?</p>
          <textarea 
            name="aims" 
            value={focus.aims} 
            onChange={handleChange} 
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="e.g., By the end of the lesson, students will be able to use the 2nd conditional to give advice. Subsidiary aim: Practice listening for gist."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-slate-800 mb-2">Self-Observation Aims</label>
          <p className="text-sm text-slate-500 mb-2">What specific aspect of your teaching did you want to pay attention to?</p>
          <textarea 
            name="selfObservationAims" 
            value={focus.selfObservationAims} 
            onChange={handleChange} 
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="e.g., Reducing Teacher Talk Time (TTT), effectiveness of CCQs, grading instructions, or monitoring during pair work."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={onNext} 
            disabled={!focus.aims || !focus.selfObservationAims}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Continue to Pre-Lesson Inquiry <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage1_Focus;