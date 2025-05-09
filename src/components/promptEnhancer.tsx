import React from "react";
import CheckboxWithInput from "./ui/checkboxWithInput";
import { Button } from "./ui/button";
import CustomCheckbox from "./ui/checkbox";

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
        className="fixed top-4 left-4 z-50"
      >
        {showEnhancePrompt ? "Hide" : "Prompt Enhancer"}
      </Button>

      <article
        className={`fixed top-0 left-0 h-full w-full max-w-[400px] xl:max-w-[450px] p-4 sm:p-6 bg-gray-100 shadow-lg border-r z-40 transition-transform duration-300 ease-in-out
          ${showEnhancePrompt ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-center mb-3 mt-14 sm:mt-10 text-3xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/90 via-black/70 to-black/80 pb-4 ">
          Enhance Your Prompt
        </h2>
        <div className="grid gap-2 overflow-y-auto max-h-[calc(100vh-6rem)]">
          <CheckboxWithInput
            name="defineRole"
            label="Define Assistant Role"
            checked={promptOptions.defineRole}
            onCheckboxChange={handleOptionChange}
            inputValue={enhanceText.roleDescription}
            onInputChange={(e) =>
              setEnhanceText((prev) => ({
                ...prev,
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
              setEnhanceText((prev) => ({
                ...prev,
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
              setEnhanceText((prev) => ({
                ...prev,
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
              setEnhanceText((prev) => ({
                ...prev,
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
              setEnhanceText((prev) => ({
                ...prev,
                constraintsText: e.target.value,
              }))
            }
            placeholder="e.g., 'Keep under 300 words.', 'Avoid technical jargon.'"
            inputType="textarea"
            inputLabel="Add Specific Constraints:"
          />

          <CustomCheckbox
            name="cot"
            checked={promptOptions.cot}
            onChange={handleOptionChange}
            /*  className="appearance-none h-5 w-5 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" */
            label={`Step-by-Step Reasoning`}
            description="Chain of Thought"
          />
        </div>
      </article>
    </>
  );
};

export default PromptEnhancer;
