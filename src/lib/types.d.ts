type EnhanceTextType2 = {
  context: string;
  roleDescription: string;
  formatInstructions: string;
  exampleInstructions: string;
  constraintsText: string;
};

type EnhanceOptionsType2 = {
  defineRole: boolean;
  provideContext: boolean;
  setFormat: boolean;
  examples: boolean;
  constraints: boolean;
  cot: boolean;
};

type EnhanceOptionsType = {
  defineRole: boolean;
  targetAudience: boolean; // New
  provideContext: boolean;
  setFormat: boolean;
  examples: boolean;
  constraints: boolean;
  desiredLength: boolean; // New
  explicitThinking: boolean; // New
  generateKnowledge: boolean; // New
  cot: boolean;
};

type EnhanceTextType = {
  roleDescription: string;
  targetAudienceDescription: string; // New
  context: string;
  formatInstructions: string;
  exampleInstructions: string;
  constraintsText: string;
  desiredLengthHint: string; // New
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

type EvaluationResult = {
  criteria_scores: CriteriaScore;
  score: number;
};

type Comparison = {
  id: string;
  created_at: string;
  prompt: string;
  response_base_prompt: string;
  response_enhanced_prompt: string;
  base_prompt_usage: Usage;
  evaluation_base_prompt: EvaluationResult;
  evaluation_enhanced_prompt: EvaluationResult;
  enhanced_prompt_usage: Usage;
  feedback: string;
  options: EnhanceOptionsType;
};

type Usage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

type Evaluation = {
  id: string;
  created_at: string;
  prompt: string;
  response: string;
  options: object;
  criteria_scores: CriteriaScore;
  score: number;
  usage: object;
  feedback: string;
};
