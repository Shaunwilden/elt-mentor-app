import { GoogleGenAI } from "@google/genai";
import { TeachingContext, LessonFocus, PreLessonInquiry, NarrativeReconstruction, ReflectionAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Select model based on complexity. Using pro for deep reasoning tasks.
const REASONING_MODEL = 'gemini-3-pro-preview'; 
const FAST_MODEL = 'gemini-2.5-flash';

export const generateMentorRole = async (context: TeachingContext): Promise<string> => {
  const prompt = `
    You are an expert ELT (English Language Teaching) mentor, qualified to Delta/MA TESOL level. 
    Based on the following teaching context, create a specific role for yourself as the teacher's reflective partner.
    
    Context:
    - Subject/Focus: ${context.subject} (ELT)
    - Level (CEFR): ${context.level}
    - Institution: ${context.institution}
    - Class Profile: ${context.classProfile}
    - Teacher Experience: ${context.experienceYears}
    - Areas of Expertise: ${context.expertise}
    - Relevant Background: ${context.background}

    Your goal: Describe your role as a supportive, non-judgemental mentor. 
    You should demonstrate expertise in communicative language teaching, lexical approaches, and appropriate classroom management for this specific context.
    
    Output a concise, warm, and professional paragraph addressing the teacher directly (using "I" and "You").
  `;

  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
  });
  return response.text || "I am ready to be your reflective ELT partner.";
};

export const generatePreLessonQuestions = async (context: TeachingContext, lessonPlan: string): Promise<string[]> => {
  const prompt = `
    Context: ELT teacher, Level: ${context.level}.
    The teacher has provided this lesson plan description:
    "${lessonPlan}"

    Generate 3-4 Socratic-style clarifying questions to deepen understanding of the teacher's intentions.
    Focus on key ELT concepts such as:
    - Concept Checking (CCQs/ICQs)
    - Meaning, Form, and Pronunciation (MFP)
    - Interaction patterns (T-S, S-S)
    - Staging and scaffolding
    - Anticipated problems with the target language

    Return ONLY the questions, separated by newlines.
  `;

  const response = await ai.models.generateContent({
    model: REASONING_MODEL,
    contents: prompt,
  });
  
  const text = response.text || "";
  return text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[-\d\.]+\s*/, ''));
};

export const generateNarrative = async (transcript: string): Promise<string> => {
  const prompt = `
    You are a neutral observer in an English language classroom.
    Here is a lesson transcript (or detailed account):
    "${transcript}"

    Task: Create an authentic, matter-of-fact narrative of the lesson, written as though by the teacher.
    Rules:
    - Be descriptive, not evaluative.
    - Be detailed and sequential.
    - Focus on observable behaviors: Teacher Talk Time (TTT), Student Talk Time (STT), instructions given, error correction used, board work, and interaction patterns.
    - No excessive positivity or judgement.
    - Write in the first person ("I did...", "The students said...").
  `;

  const response = await ai.models.generateContent({
    model: REASONING_MODEL,
    contents: prompt,
  });
  return response.text || "Could not generate narrative.";
};

export const generateComparisonAnalysis = async (
  narrative: string, 
  teacherReflection: string, 
  focus: LessonFocus
): Promise<string> => {
  const prompt = `
    Act as a skilled ELT mentor (Delta/MA qualified).
    
    Step 1: Analyze these two texts.
    
    [AI Generated Narrative based on Transcript]
    ${narrative}

    [Teacher's Self-Reflection]
    ${teacherReflection}

    [Teacher's Self-Observation Aim]
    ${focus.selfObservationAims}

    Step 2: Compare them. Highlight similarities, differences, omissions, and mismatches between intention/reflection and the actual action described in the narrative.
    
    Step 3: Analyze the transcript narrative for areas that went well or could be improved, specifically looking for:
    - Effectiveness of instructions (grading language)
    - Checking of understanding (CCQs/ICQs)
    - Appropriateness of TTT vs STT
    - Handling of error correction
    - Alignment with the self-observation aim

    Step 4: Explain possible reasons for differences.

    Format the output in clear Markdown with headings.
  `;

  const response = await ai.models.generateContent({
    model: REASONING_MODEL,
    contents: prompt,
  });
  return response.text || "Analysis failed.";
};

export const generateSocraticQuestions = async (analysis: string): Promise<string[]> => {
  const prompt = `
    Based on this analysis of an English language lesson:
    "${analysis}"

    Generate 3-4 deep, Socratic-style reflective questions.
    Focus on:
    - The impact of teacher decisions on learner output.
    - Assumptions made about learner knowledge (L1 interference, interlanguage).
    - The effectiveness of the communicative purpose.
    
    Return ONLY the questions, separated by newlines.
  `;

  const response = await ai.models.generateContent({
    model: REASONING_MODEL,
    contents: prompt,
  });
  
  const text = response.text || "";
  return text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[-\d\.]+\s*/, ''));
};

export const generateSuggestionsAndFuture = async (
  analysis: string, 
  questions: string[], 
  teacherResponses: string
): Promise<{ suggestions: string, futureQuestions: string }> => {
  const prompt = `
    Context: ELT Mentoring.
    Analysis: ${analysis.substring(0, 1000)}...
    Socratic Questions Asked: ${questions.join(' | ')}
    Teacher's Response: "${teacherResponses}"

    Part 1: Provide concrete suggestions for each reflective point raised. 
    Reference standard ELT practices or methodology (e.g., Task-Based Learning, Dogme, Lexical Approach, or specific techniques like back-chaining, finger correction) where appropriate.

    Part 2: Offer mentoring questions to support future-oriented professional development in ELT (e.g., experimenting with different feedback stages, varying interaction patterns).

    Return the result as JSON with keys: "suggestions" (string, markdown) and "futureQuestions" (string, markdown).
  `;

  const response = await ai.models.generateContent({
    model: REASONING_MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  
  try {
    const json = JSON.parse(response.text || "{}");
    return {
      suggestions: json.suggestions || "No suggestions generated.",
      futureQuestions: json.futureQuestions || "No future questions generated."
    };
  } catch (e) {
    return { suggestions: response.text || "", futureQuestions: "" };
  }
};