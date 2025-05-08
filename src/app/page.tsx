"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import PromptEnhancer from "@/components/promptEnhancer";
import PromptGuide from "@/components/promptOrderGuide";
import PromptEngineeringAdvice from "@/components/promptEngineeringAdvice";

const SUPABASE_URL = "https://xtmzpyqwdxspyifzbspv.supabase.co";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
  } = useChat({
    onFinish: (message, options) => {
      /* console.log("Stream finished:", message); */
      console.log("Options:", options);
    },
  });

  const [options, setOptions] = useState({
    defineRole: false,
    provideContext: false,
    beSpecific: false,
    setFormat: false,
    examples: false,
    constraints: false,
    cot: false,
  });
  /* const [context, setContext] = useState<string>("");
  const [roleDescription, setRoleDescription] = useState("");
  const [formatInstructions, setFormatInstructions] = useState("");
  const [exampleInstructions, setExampleInstructions] = useState("");
  const [constraintsText, setConstraintsText] = useState(""); */
  const [enhanceText, setEnhanceText] = useState<EnhanceTextType>({
    context: "",
    roleDescription: "",
    formatInstructions: "",
    exampleInstructions: "",
    constraintsText: "",
  });

  const [showGuide, setShowGuide] = useState(false);
  const [showEnhancePrompt, setShowEnhancePrompt] = useState(true);

  useEffect(() => {
    const lastMessage = document.querySelector("#chat-bottom");
    lastMessage?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enhancedPrompt = useMemo(() => {
    let enhanced = input;
    if (options.defineRole) {
      enhanced =
        `You are ${
          enhanceText.roleDescription ||
          "an expert in this field with 10+ years of experience"
        }. ` + enhanced;
    }
    if (options.provideContext) {
      enhanced += enhanceText.context;
    }

    if (options.setFormat) {
      enhanced +=
        " " +
        (enhanceText.formatInstructions ||
          "Format your response with clear headings, bullet points, and numbered steps where appropriate.");
    }
    if (options.examples) {
      enhanced +=
        " " +
        (enhanceText.exampleInstructions ||
          "Provide a relevant example to illustrate your points.");
    }
    if (options.constraints) {
      enhanced +=
        " " +
        (enhanceText.constraintsText ||
          "Include only verified information from reliable sources.");
    }
    if (options.cot) {
      enhanced += " " + "Reason step-by-step before answering.";
    }
    return enhanced;
  }, [input, options, enhanceText]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*  const finalPrompt = enhancedPrompt(input); */
    try {
      originalSubmit(e, {
        body: {
          finalPrompt: enhancedPrompt,
          options: options,
          clearHistory: true,
        },
      });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("There was an error sending your message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen w-full max-w-3xl mx-auto">
      <Button
        onClick={() => setShowGuide(!showGuide)}
        className="fixed top-4 right-4 z-50"
      >
        {showGuide ? "Hide" : "Show Prompt Guide"}
      </Button>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] xl:max-w-[600px] bg-gray-100 shadow-lg border transition-transform duration-300 ease-in-out z-40 overflow-scroll
    ${showGuide ? "translate-x-0" : "translate-x-full"}`}
      >
        <PromptEngineeringAdvice />
        <PromptGuide />
      </div>
      <section className="flex flex-col pt-2 h-full lg:max-h-[85vh] overflow-scroll w-full">
        {messages.length < 1 ? (
          <p className="font-semibold text-black/70 text-center mt-10">
            Send a message to initiate the chat
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="whitespace-pre-wrap my-1 p-3 bg-gray-100 rounded-lg shadow-md"
            >
              <strong
                className={
                  message.role === "user" ? "text-blue-600" : "text-green-600"
                }
              >
                {message.role === "user" ? "You: " : "Assistant: "}
              </strong>
              {message.parts.map(
                (part, i) =>
                  part.type === "text" && (
                    <div key={`${message.id}-${i}`}>{part.text}</div>
                  )
              )}
            </div>
          ))
        )}
        <div id="chat-bottom" />
      </section>

      <section className="sticky bottom-2 w-full max-w-3xl bg-gray-200 p-2 sm:p-4 shadow-lg space-y-2 rounded-3xl border">
        {/* <section className="w-full max-w-3xl bg-gray-200 p-4 shadow-lg space-y-2 rounded-3xl"> */}
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-2 text-black/80"
        >
          {(input || enhancedPrompt) && (
            <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg text-sm">
              <strong>Prompt Preview:</strong> {enhancedPrompt}
            </div>
          )}

          <div className=" flex items-center justify-between space-x-2 flex-1 border border-gray-300 rounded-xl bg-gray-100 overflow-hidden focus-within:bg-white duration-200">
            <input
              className="group outline-none px-3 w-full py-4 text-black/90"
              value={input}
              placeholder="Type your message here..."
              onChange={handleInputChange}
            />
            <Button type="submit" className="rounded-lg transition mr-2">
              Send
            </Button>
          </div>
          <p className="text-xs text-black/60 mt-2 ml-1">
            Tip: Use the prompt enhancer to improve your prompt. For complex
            queries, combine multiple options.
          </p>
          <PromptEnhancer
            enhanceText={enhanceText}
            setEnhanceText={setEnhanceText}
            setShowEnhancePrompt={setShowEnhancePrompt}
            showEnhancePrompt={showEnhancePrompt}
            setOptions={setOptions}
            options={options}
          />
        </form>
      </section>
    </div>
  );
}

/* <Button onClick={() => setShowEnhancePrompt(!showEnhancePrompt)} className="">
  {showEnhancePrompt ? "Hide Enhancer" : "Prompt Enhancer"}
</Button>;

{
  showEnhancePrompt && (
    <article className="relative flex flex-col p-4 pb-2 bg-gray-200 border rounded-lg">
      <h3 className="font-bold mb-3">Enhance Your Prompt</h3>
      <div className="grid gap-2">
        <CheckboxWithInput
          name="defineRole"
          label="Define Assistant Role"
          checked={options.defineRole}
          onCheckboxChange={handleOptionChange}
          inputValue={roleDescription}
          onInputChange={(e) => setRoleDescription(e.target.value)}
          placeholder="e.g., a helpful travel agent, a senior Python developer, a critical editor"
          inputType="text"
          inputLabel="Specify the Assistant’s Role:"
        />

        <CheckboxWithInput
          name="provideContext"
          label="Provide Context"
          checked={options.provideContext}
          onCheckboxChange={handleOptionChange}
          inputValue={context}
          onInputChange={(e) => setContext(e.target.value)}
          placeholder="Explain your situation, project, or what you need this information for..."
          inputType="textarea"
          inputLabel="Additional Context (optional):"
        />

        <CheckboxWithInput
          name="setFormat"
          label="Structured Format"
          checked={options.setFormat}
          onCheckboxChange={handleOptionChange}
          inputValue={formatInstructions}
          onInputChange={(e) => setFormatInstructions(e.target.value)}
          placeholder="e.g., 'Respond in valid JSON format.', 'Use markdown for headings and code blocks.'"
          inputType="textarea"
          inputLabel="Desired Output Format Instructions:"
        />

        <CheckboxWithInput
          name="examples"
          label="Include Examples"
          checked={options.examples}
          onCheckboxChange={handleOptionChange}
          inputValue={exampleInstructions}
          onInputChange={(e) => setExampleInstructions(e.target.value)}
          placeholder="e.g., '3 simple examples', 'one code example in Python'"
          inputType="text"
          inputLabel="Specify Examples Needed:"
        />

        <CheckboxWithInput
          name="constraints"
          label="Add Constraints"
          checked={options.constraints}
          onCheckboxChange={handleOptionChange}
          inputValue={constraintsText}
          onInputChange={(e) => setConstraintsText(e.target.value)}
          placeholder="e.g., 'Keep under 300 words.', 'Avoid technical jargon.'"
          inputType="textarea"
          inputLabel="Add Specific Constraints:"
        />
      </div>
    </article>
  );
} */
