import React, { useEffect } from 'react';
import { LessonData, NarrativeReconstruction } from '../types';
import { generateNarrative } from '../services/geminiService';
import { Loader2, BookOpen, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  data: LessonData;
  narrative: NarrativeReconstruction;
  updateNarrative: (n: NarrativeReconstruction) => void;
  onNext: () => void;
  isLoading: boolean;
  setLoading: (l: boolean) => void;
}

const Stage4_Narrative: React.FC<Props> = ({ 
  data, narrative, updateNarrative, onNext, isLoading, setLoading 
}) => {

  useEffect(() => {
    // Auto-generate if empty
    if (!narrative.narrative && data.transcript && !isLoading) {
      setLoading(true);
      generateNarrative(data.transcript)
        .then(text => updateNarrative({ narrative: text }))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !narrative.narrative) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 animate-fade-in">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-slate-800">Reconstructing Narrative...</h3>
        <p className="text-slate-500">Creating an authentic, non-evaluative account of the lesson.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Stage 4: Narrative Reconstruction</h2>
          <BookOpen className="text-indigo-500" size={24} />
        </div>
        
        <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-lg border border-slate-100">
           <ReactMarkdown>{narrative.narrative}</ReactMarkdown>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onNext} 
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Proceed to Reflection <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage4_Narrative;