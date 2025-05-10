type EnhanceTextType = {
  context: string;
  roleDescription: string;
  formatInstructions: string;
  exampleInstructions: string;
  constraintsText: string;
};

type EnhanceOptionsType = {
  defineRole: boolean;
  provideContext: boolean;
  setFormat: boolean;
  examples: boolean;
  constraints: boolean;
  cot: boolean;
};

type EnhanceTextProps = {
  setShowEnhancePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  showEnhancePrompt: boolean;
  setEnhanceText: React.Dispatch<React.SetStateAction<EnhanceTextType>>;
  enhanceText: EnhanceTextType;
  setOptions: React.Dispatch<React.SetStateAction<EnhanceOptionsType>>;
  options: EnhanceOptionsType;
};

type EvaluationData = {
  prompt: string;
  response: string;
  options: object;
  criteria_scores: CriteriaScore;
  score: number;
  usage: object;
  feedback: string;
};

type CriteriaScore = {
  accuracy: number;
  correctness: number;
  relevance: number;
  completeness: number;
  aesthetics: number;
  tone: number;
};

/* type Evaluation = {
  id: string;
  created_at: string;
  prompt: string;
  response: string;
  options: object;
  criteria_scores: CriteriaScore;
  score: number;
  usage: object;
  feedback: string;
}; */
