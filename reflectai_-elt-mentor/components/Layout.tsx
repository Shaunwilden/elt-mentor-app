import React from 'react';
import { GraduationCap } from 'lucide-react';

interface Props {
  currentStage: number;
  children: React.ReactNode;
}

const STAGES = [
  "Context",
  "Focus",
  "Pre-Lesson",
  "Data",
  "Narrative",
  "Reflection",
  "Insight",
  "Output"
];

const Layout: React.FC<Props> = ({ currentStage, children }) => {
  const progress = ((currentStage) / (STAGES.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">ReflectAI</span>
          </div>
          <div className="hidden md:block text-sm font-medium text-slate-500">
            ELT Mentor Edition
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto">
             <div className="flex gap-4 md:justify-between text-xs font-medium text-slate-400 whitespace-nowrap">
                {STAGES.map((label, idx) => (
                    <span key={idx} className={idx <= currentStage ? "text-indigo-600" : ""}>
                        {idx}. {label}
                    </span>
                ))}
             </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          ReflectAI © {new Date().getFullYear()} - Empowering ELT Professionals
        </div>
      </footer>
    </div>
  );
};

export default Layout;