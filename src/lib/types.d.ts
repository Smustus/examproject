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
  beSpecific: boolean;
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
