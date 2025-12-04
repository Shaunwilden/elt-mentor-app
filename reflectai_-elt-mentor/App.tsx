import React, { useState } from 'react';
import Layout from './components/Layout';
import Stage0_Context from './components/Stage0_Context';
import Stage1_Focus from './components/Stage1_Focus';
import Stage2_PreLesson from './components/Stage2_PreLesson';
import Stage3_DataCollection from './components/Stage3_DataCollection';
import Stage4_Narrative from './components/Stage4_Narrative';
import Stage5_Reflection from './components/Stage5_Reflection';
import Stage6_DeepInsight from './components/Stage6_DeepInsight';
import Stage7_Output from './components/Stage7_Output';
import { AppState, INITIAL_STATE, TeachingContext, MentorRole, LessonFocus, PreLessonInquiry, LessonData, NarrativeReconstruction, ReflectionAnalysis, DeepInsight } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStage = () => {
    setState(prev => ({ ...prev, currentStage: prev.currentStage + 1 }));
  };

  const renderStage = () => {
    switch (state.currentStage) {
      case 0:
        return (
          <Stage0_Context 
            context={state.context}
            mentorRole={state.mentorRole}
            updateContext={(ctx: TeachingContext) => updateState({ context: ctx })}
            updateRole={(role: MentorRole) => updateState({ mentorRole: role })}
            onNext={nextStage}
            setLoading={(isLoading) => updateState({ isLoading })}
            isLoading={state.isLoading}
          />
        );
      case 1:
        return (
          <Stage1_Focus 
            focus={state.focus}
            updateFocus={(focus: LessonFocus) => updateState({ focus })}
            onNext={nextStage}
          />
        );
      case 2:
        return (
          <Stage2_PreLesson 
            context={state.context}
            preLesson={state.preLesson}
            updatePreLesson={(pl: PreLessonInquiry) => updateState({ preLesson: pl })}
            onNext={nextStage}
            setLoading={(isLoading) => updateState({ isLoading })}
            isLoading={state.isLoading}
          />
        );
      case 3:
        return (
          <Stage3_DataCollection 
            data={state.data}
            updateData={(d: LessonData) => updateState({ data: d })}
            onNext={nextStage}
          />
        );
      case 4:
        return (
          <Stage4_Narrative 
            data={state.data}
            narrative={state.narrative}
            updateNarrative={(n: NarrativeReconstruction) => updateState({ narrative: n })}
            onNext={nextStage}
            setLoading={(isLoading) => updateState({ isLoading })}
            isLoading={state.isLoading}
          />
        );
      case 5:
        return (
          <Stage5_Reflection 
            narrative={state.narrative}
            reflection={state.reflection}
            focus={state.focus}
            updateReflection={(r: ReflectionAnalysis) => updateState({ reflection: r })}
            onNext={nextStage}
            setLoading={(isLoading) => updateState({ isLoading })}
            isLoading={state.isLoading}
          />
        );
      case 6:
        return (
          <Stage6_DeepInsight 
            reflection={state.reflection}
            insight={state.insight}
            updateInsight={(i: DeepInsight) => updateState({ insight: i })}
            onNext={nextStage}
            setLoading={(isLoading) => updateState({ isLoading })}
            isLoading={state.isLoading}
          />
        );
      case 7:
        return <Stage7_Output state={state} />;
      default:
        return <div>Unknown Stage</div>;
    }
  };

  return (
    <Layout currentStage={state.currentStage}>
      {renderStage()}
    </Layout>
  );
};

export default App;