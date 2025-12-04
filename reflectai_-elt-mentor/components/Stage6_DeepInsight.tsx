import React, { useEffect, useState } from 'react';
import { ReflectionAnalysis, DeepInsight } from '../types';
import { generateSocraticQuestions, generateSuggestionsAndFuture } from '../services/geminiService';
import { Loader2, MessageSquare, Lightbulb, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  reflection: ReflectionAnalysis;
  insight: DeepInsight;
  updateInsight: (i: DeepInsight) => void;
  onNext: () => void;
  isLoading: boolean;
  setLoading: (l: boolean) => void;
}

const Stage6_DeepInsight: React.FC<Props> = ({
  reflection, insight, updateInsight, onNext, isLoading, setLoading
}) => {
  const [phase, setPhase] = useState<'questions' | 'suggestions'>('questions');

  useEffect(() => {
    // Generate initial questions if not present
    if (insight.socraticQuestions.length === 0 && !isLoading && phase === 'questions') {
      setLoading(true);
      generateSocraticQuestions(reflection.comparison)
        .then(qs => updateInsight({ ...insight, socraticQuestions: qs }))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetSuggestions = async () => {
    if (!insight.teacherResponses) return;
    setLoading(true);
    try {
      const result = await generateSuggestionsAndFuture(
        reflection.comparison,
        insight.socraticQuestions,
        insight.teacherResponses
      );
      updateInsight({ 
        ...insight, 
        aiSuggestions: result.suggestions,
        futureQuestions: result.futureQuestions
      });
      setPhase('suggestions');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && insight.socraticQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500">Formulating Socratic questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      
      {/* Socratic Questions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Stage 6: Socratic Inquiry</h2>
        
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-lg mb-6">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <MessageSquare size={18} /> Reflective Questions
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-amber-800">
            {insight.socraticQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>

        <div className={phase === 'suggestions' ? "opacity-75 pointer-events-none" : ""}>
          <label className="block text-sm font-medium text-slate-700 mb-2">Your Thoughts</label>
          <textarea 
            value={insight.teacherResponses}
            onChange={(e) => updateInsight({ ...insight, teacherResponses: e.target.value })}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Exploring these questions..."
          />
          
          {phase === 'questions' && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleGetSuggestions}
                disabled={isLoading || !insight.teacherResponses}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Lightbulb size={20} />}
                Get Mentoring Insights
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions & Future Path */}
      {phase === 'suggestions' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Mentoring Suggestions</h3>
            <div className="prose prose-indigo max-w-none text-sm">
              <ReactMarkdown>{insight.aiSuggestions}</ReactMarkdown>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Future Professional Development</h3>
            <div className="prose prose-emerald max-w-none text-sm">
              <ReactMarkdown>{insight.futureQuestions}</ReactMarkdown>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={onNext}
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition shadow-lg"
            >
              Finalize & Download Report <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stage6_DeepInsight;