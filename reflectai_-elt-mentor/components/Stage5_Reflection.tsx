import React, { useState } from 'react';
import { NarrativeReconstruction, ReflectionAnalysis, LessonFocus } from '../types';
import { generateComparisonAnalysis } from '../services/geminiService';
import { Loader2, GitCompare, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  narrative: NarrativeReconstruction;
  reflection: ReflectionAnalysis;
  focus: LessonFocus;
  updateReflection: (r: ReflectionAnalysis) => void;
  onNext: () => void;
  isLoading: boolean;
  setLoading: (l: boolean) => void;
}

const Stage5_Reflection: React.FC<Props> = ({
  narrative, reflection, focus, updateReflection, onNext, isLoading, setLoading
}) => {
  const [step, setStep] = useState<number>(reflection.comparison ? 1 : 0);

  const handleGenerateComparison = async () => {
    if (!reflection.teacherReflection) return;
    setLoading(true);
    try {
      const comparison = await generateComparisonAnalysis(
        narrative.narrative, 
        reflection.teacherReflection, 
        focus
      );
      updateReflection({ ...reflection, comparison });
      setStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Teacher Reflection Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Stage 5: Teacher Reflection</h2>
        <p className="text-slate-600 mb-4">Consider the narrative you just read. How does it compare with your initial perception?</p>
        
        <textarea 
          value={reflection.teacherReflection}
          onChange={(e) => updateReflection({ ...reflection, teacherReflection: e.target.value })}
          rows={6}
          disabled={step === 1}
          className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
          placeholder="I felt that the students were..."
        />

        {step === 0 && (
          <div className="flex justify-end">
            <button 
              onClick={handleGenerateComparison} 
              disabled={isLoading || !reflection.teacherReflection}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <GitCompare size={20} />}
              Compare & Analyze
            </button>
          </div>
        )}
      </div>

      {/* Comparison Result */}
      {step === 1 && (
        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-xl shadow-sm animate-fade-in-up">
          <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <GitCompare size={24} /> Mentor's Analysis
          </h3>
          <div className="prose prose-indigo max-w-none">
            <ReactMarkdown>{reflection.comparison}</ReactMarkdown>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              onClick={onNext}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Deepen Insight <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stage5_Reflection;