import React from 'react';
import { LessonData } from '../types';
import { FileText, Upload, ChevronRight } from 'lucide-react';

interface Props {
  data: LessonData;
  updateData: (data: LessonData) => void;
  onNext: () => void;
}

const Stage3_DataCollection: React.FC<Props> = ({ data, updateData, onNext }) => {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        updateData({ transcript: text });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Stage 3: Collecting Lesson Data</h2>
      <p className="text-slate-600 mb-8">Please provide the lesson transcript or a detailed account. The more detailed regarding T-S and S-S interaction, the better.</p>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition">
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <label className="cursor-pointer block">
            <span className="text-indigo-600 font-medium hover:text-indigo-700">Upload a text file</span>
            <span className="text-slate-500"> or paste text below</span>
            <input type="file" className="hidden" accept=".txt,.md" onChange={handleFileUpload} />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <FileText size={16} /> Transcript Content
          </label>
          <textarea 
            value={data.transcript}
            onChange={(e) => updateData({ transcript: e.target.value })}
            rows={10}
            className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
            placeholder="[10:05] T: Okay, look at the picture. What's he doing?
[10:06] S1: He swim.
[10:07] T: He is swimming. Good. Repeat. He is swimming.
[10:08] Ss: He is swimming..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={onNext} 
            disabled={!data.transcript || data.transcript.length < 50}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Generate Narrative <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage3_DataCollection;