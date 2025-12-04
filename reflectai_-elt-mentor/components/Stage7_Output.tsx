import React from 'react';
import { AppState } from '../types';
import { Download, CheckCircle, RefreshCcw } from 'lucide-react';
import jsPDF from 'jspdf';

interface Props {
  state: AppState;
}

const Stage7_Output: React.FC<Props> = ({ state }) => {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - margin * 2;

    const addText = (text: string, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      const splitText = doc.splitTextToSize(text, contentWidth);
      if (y + splitText.length * lineHeight > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitText, margin, y);
      y += splitText.length * lineHeight + 2;
    };

    const addHeading = (text: string) => {
      y += 5;
      addText(text, 14, true);
      y += 2;
    };

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ReflectAI Mentoring Report", margin, y);
    y += 15;

    // Context
    addHeading("Teaching Context");
    addText(`Subject: ${state.context.subject}`);
    addText(`Level: ${state.context.level}`);
    addText(`Institution: ${state.context.institution}`);
    addText(`Background: ${state.context.background}`);
    y += 5;

    // Mentor Role
    addHeading("Mentor Role");
    addText(state.mentorRole.description);
    y += 5;

    // Aims
    addHeading("Lesson Aims & Focus");
    addText(`Aims: ${state.focus.aims}`);
    addText(`Self-Observation: ${state.focus.selfObservationAims}`);
    y += 5;

    // Pre-Lesson
    addHeading("Pre-Lesson Inquiry");
    addText("Questions:");
    state.preLesson.aiQuestions.forEach(q => addText(`- ${q}`));
    addText(`Responses: ${state.preLesson.teacherAnswers}`);
    addText(`Challenges: ${state.preLesson.challenges}`);
    addText(`Guiding Inquiry: ${state.preLesson.guidingInquiry}`);
    y += 5;

    // Narrative
    addHeading("Narrative Reconstruction");
    // Strip markdown formatting simple for PDF
    const cleanNarrative = state.narrative.narrative.replace(/[#*]/g, '');
    addText(cleanNarrative);
    y += 5;

    // Reflection & Analysis
    addHeading("Reflection & Analysis");
    addText("Teacher Reflection:");
    addText(state.reflection.teacherReflection);
    y += 5;
    addText("Mentor Analysis:");
    addText(state.reflection.comparison.replace(/[#*]/g, ''));
    y += 5;

    // Deep Insight
    addHeading("Deep Insight & Future");
    addText("Socratic Questions:");
    state.insight.socraticQuestions.forEach(q => addText(`- ${q}`));
    addText(`Teacher Responses: ${state.insight.teacherResponses}`);
    y += 5;
    addText("Suggestions:");
    const cleanSuggestions = (state.insight.aiSuggestions || '').replace(/[\{\}\"]/g, '').replace(/[#*]/g, ''); // Basic cleanup
    addText(cleanSuggestions);
    
    doc.save("ReflectAI-Report.pdf");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-center py-10">
      <div className="bg-green-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-green-600 h-12 w-12" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800">Reflection Cycle Complete</h2>
      <p className="text-slate-600 max-w-lg mx-auto">
        You have successfully engaged in a deep, evidence-based reflection process. 
        Download your comprehensive report below.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button 
          onClick={generatePDF}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg text-lg font-medium"
        >
          <Download size={24} /> Download Report (PDF)
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-xl hover:bg-slate-50 transition text-lg font-medium"
        >
          <RefreshCcw size={24} /> Start New Cycle
        </button>
      </div>
    </div>
  );
};

export default Stage7_Output;