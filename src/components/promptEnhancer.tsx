import React from "react";
import CheckboxWithInput from "./ui/checkboxWithInput";
import { Button } from "./ui/button";

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
    setPromptOptions((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <>
      <Button
        onClick={() => setShowEnhancePrompt(!showEnhancePrompt)}
        className=""
      >
        {showEnhancePrompt ? "Hide Enhancer" : "Prompt Enhancer"}
      </Button>

      {showEnhancePrompt && (
        <article
          className={`relative flex flex-col p-2 pb-0 border rounded-lg transition-transform duration-300 ease-out ${
            showEnhancePrompt
              ? "max-h-full opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <h3 className="font-bold mb-3">Enhance Your Prompt</h3>
          <div className="grid gap-2">
            <CheckboxWithInput
              name="defineRole"
              label="Define Assistant Role"
              checked={promptOptions.defineRole}
              onCheckboxChange={handleOptionChange}
              inputValue={enhanceText.roleDescription}
              onInputChange={(e) =>
                setEnhanceText((prevValue) => ({
                  ...prevValue,
                  roleDescription: e.target.value,
                }))
              }
              placeholder="e.g., a helpful travel agent, a senior Javascript developer, a critical editor"
              inputType="text"
              inputLabel="Specify the Assistant’s Role:"
            />

            <CheckboxWithInput
              name="provideContext"
              label="Provide Context"
              checked={promptOptions.provideContext}
              onCheckboxChange={handleOptionChange}
              inputValue={enhanceText.context}
              onInputChange={(e) =>
                setEnhanceText((prevValue) => ({
                  ...prevValue,
                  context: e.target.value,
                }))
              }
              placeholder="Explain your situation, project, or what you need this information for..."
              inputType="textarea"
              inputLabel="Additional Context (optional):"
            />

            <CheckboxWithInput
              name="setFormat"
              label="Structured Format"
              checked={promptOptions.setFormat}
              onCheckboxChange={handleOptionChange}
              inputValue={enhanceText.formatInstructions}
              onInputChange={(e) =>
                setEnhanceText((prevValue) => ({
                  ...prevValue,
                  formatInstructions: e.target.value,
                }))
              }
              placeholder="e.g., 'Respond in valid JSON format.', 'Use markdown for headings and code blocks.'"
              inputType="textarea"
              inputLabel="Desired Output Format Instructions:"
            />

            <CheckboxWithInput
              name="examples"
              label="Include Examples"
              checked={promptOptions.examples}
              onCheckboxChange={handleOptionChange}
              inputValue={enhanceText.exampleInstructions}
              onInputChange={(e) =>
                setEnhanceText((prevValue) => ({
                  ...prevValue,
                  exampleInstructions: e.target.value,
                }))
              }
              placeholder="e.g., '3 simple examples', 'one code example in Python'"
              inputType="text"
              inputLabel="Specify Examples Needed:"
            />

            <CheckboxWithInput
              name="constraints"
              label="Add Constraints"
              checked={promptOptions.constraints}
              onCheckboxChange={handleOptionChange}
              inputValue={enhanceText.constraintsText}
              onInputChange={(e) =>
                setEnhanceText((prevValue) => ({
                  ...prevValue,
                  constraintsText: e.target.value,
                }))
              }
              placeholder="e.g., 'Keep under 300 words.', 'Avoid technical jargon.'"
              inputType="textarea"
              inputLabel="Add Specific Constraints:"
            />

            <label className="flex items-center h-10 space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="cot"
                checked={promptOptions.cot}
                onChange={handleOptionChange}
                className="h-4 w-4"
              />
              <span>Step-by-Step Reasoning</span>
            </label>
          </div>
        </article>
      )}
    </>
  );
};

export default PromptEnhancer;
