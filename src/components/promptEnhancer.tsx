import React from "react";
import CheckboxWithInput from "./ui/checkboxWithInput";
import { Button } from "./ui/button";
import CustomCheckbox from "./ui/checkbox";

// Define this array either inside PromptEnhancer or import it
const promptEnhancementOptionsConfig = [
  {
    name: "defineRole",
    label: "Define Assistant Role",
    description: "Set a specific persona for the AI.", // Add descriptions for clarity
    placeholder: "e.g., a helpful travel agent, a senior Javascript developer",
    inputType: "text",
    inputLabel: "Specify the Assistant’s Role:",
    textKey: "roleDescription",
    type: "checkboxWithInput", // Add a type to differentiate input types
  },
  {
    name: "targetAudience", // New Option
    label: "Define Target Audience",
    description: "Specify who the response should be tailored for.",
    placeholder: "e.g., technical users, general public, children",
    inputType: "text",
    inputLabel: "Specify the Audience:",
    textKey: "targetAudienceDescription",
    type: "checkboxWithInput",
  },
  {
    name: "provideContext",
    label: "Provide Context",
    description: "Give background information relevant to the task.",
    placeholder:
      "Explain your project, situation, or what you need this for...",
    inputType: "textarea",
    inputLabel: "Additional Context:",
    textKey: "context",
    type: "checkboxWithInput",
  },
  {
    name: "setFormat",
    label: "Structured Format",
    description:
      "Request a specific output structure (JSON, Markdown, list, etc.).",
    placeholder:
      "e.g., 'Respond in valid JSON format.', 'Use markdown headings.'",
    inputType: "textarea",
    inputLabel: "Desired Output Format Instructions:",
    textKey: "formatInstructions",
    type: "checkboxWithInput",
  },
  {
    name: "examples",
    label: "Include Examples (Few-Shot)",
    description: "Provide examples of desired output or input/output pairs.",
    placeholder: "",
    inputType: "text",
    inputLabel: "Provide the Assistant with Examples:",
    textKey: "exampleInstructions",
    type: "checkboxWithInput",
  },
  {
    name: "constraints",
    label: "Add Constraints",
    description: "Specify rules or limitations the AI must follow.",
    placeholder:
      "e.g., 'Avoid technical jargon.', 'Include atleast 1 example', 'Only vegan diet tips'",
    inputType: "textarea",
    inputLabel: "Add Specific Constraints:",
    textKey: "constraintsText",
    type: "checkboxWithInput",
  },
  {
    name: "desiredLength", // New Option
    label: "Desired Output Length",
    description: "Hint at the preferred length of the response.",
    placeholder: "e.g., 'Approx 500 words', 'No more than 3 paragraphs'",
    inputType: "text",
    inputLabel: "Specify Desired Length:",
    textKey: "desiredLengthHint",
    type: "checkboxWithInput",
  },
  {
    name: "explicitThinking", // New Option
    label: "Explicit Thinking Instruction",
    description:
      "Add phrases to encourage the AI to think step-by-step internally.",
    type: "checkbox",
  },
  {
    name: "generateKnowledge", // New Option
    label: "Generate Knowledge First",
    description:
      "Instruct the AI to first generate relevant facts before answering.",
    type: "checkbox",
  },
  {
    name: "cot",
    label: `Step-by-Step Reasoning (CoT)`,
    description: "Ask the AI to explain its reasoning process.",
    type: "checkbox",
  },
];

const PromptEnhancer = ({
  setShowEnhancePrompt,
  showEnhancePrompt,
  setEnhanceText,
  enhanceText,
  setPromptOptions,
  promptOptions,
}: {
  setShowEnhancePrompt: React.Dispatch<React.SetStateAction<boolean>>;
  showEnhancePrompt: boolean;
  setEnhanceText: React.Dispatch<React.SetStateAction<EnhanceTextType>>;
  enhanceText: EnhanceTextType;
  setPromptOptions: React.Dispatch<React.SetStateAction<EnhanceOptionsType>>;
  promptOptions: EnhanceOptionsType;
}) => {
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPromptOptions((prev: EnhanceOptionsType) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Centralized input handler (as suggested before)
  const handleTextInputChange =
    (key: keyof EnhanceTextType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEnhanceText((prev: EnhanceTextType) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  return (
    <>
      <article
        className={`fixed top-0 flex flex-col left-0 h-full w-full max-w-[400px] xl:max-w-[450px] p-4 sm:p-6 sm:pt-4 bg-gray-100 shadow-lg border-r z-40 transition-transform duration-300 ease-in-out
          ${showEnhancePrompt ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Button
          onClick={() => setShowEnhancePrompt(!showEnhancePrompt)}
          className={`self-start sm:self-end z-50 ${
            showEnhancePrompt ? "block" : "hidden"
          }`}
        >
          {showEnhancePrompt ? "X" : "X"}
        </Button>
        <h2 className="text-center mb-3 mt-3 sm:mt-2 text-3xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/90 via-black/70 to-black/80 pb-4 ">
          Enhance Your Prompt
        </h2>

        <div className="grid gap-2 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {promptEnhancementOptionsConfig.map((option) => {
            if (option.type === "checkboxWithInput") {
              return (
                <CheckboxWithInput
                  key={option.name}
                  name={option.name}
                  label={option.label}
                  checked={
                    promptOptions[option.name as keyof EnhanceOptionsType] ||
                    false
                  }
                  onCheckboxChange={handleOptionChange}
                  inputValue={
                    enhanceText[option.textKey as keyof EnhanceTextType] || ""
                  }
                  onInputChange={handleTextInputChange(
                    option.textKey as keyof EnhanceTextType
                  )}
                  placeholder={option.placeholder ?? ""}
                  inputType={option.inputType as "text" | "textarea"}
                  inputLabel={option.inputLabel ?? ""}
                  description={option.description}
                />
              );
            } else if (option.type === "checkbox") {
              return (
                <CustomCheckbox
                  key={option.name}
                  name={option.name}
                  checked={
                    promptOptions[option.name as keyof EnhanceOptionsType] ||
                    false
                  }
                  onChange={handleOptionChange}
                  label={option.label}
                  description={option.description}
                />
              );
            }
            return null; // Or handle other types
          })}
        </div>
      </article>
    </>
  );
};

export default PromptEnhancer;
