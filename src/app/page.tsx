"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import CheckboxWithInput from "@/components/ui/checkboxWithInput";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
  } = useChat();
  const [options, setOptions] = useState({
    defineRole: false,
    provideContext: false,
    beSpecific: false,
    setFormat: false,
    examples: false,
    constraints: false,
  });
  const [context, setContext] = useState<string>("");
  const [roleDescription, setRoleDescription] = useState("");
  const [formatInstructions, setFormatInstructions] = useState("");
  const [exampleInstructions, setExampleInstructions] = useState("");
  const [constraintsText, setConstraintsText] = useState("");

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
          roleDescription ||
          "an expert in this field with 10+ years of experience"
        }. ` + enhanced;
    }
    if (options.provideContext) {
      enhanced += " Provide as much relevant context as you can.";
    }
    if (options.beSpecific) {
      enhanced += " Be specific and detailed in your answer.";
    }
    if (options.setFormat) {
      enhanced +=
        " " +
        (formatInstructions ||
          "Format your response with clear headings, bullet points, and numbered steps where appropriate.");
    }
    if (options.examples) {
      enhanced +=
        " " +
        (exampleInstructions ||
          "Provide 2–3 relevant examples to illustrate your points.");
    }
    if (options.constraints) {
      enhanced +=
        " " +
        (constraintsText ||
          "Include only verified information from reliable sources.");
    }
    return enhanced;
  }, [
    input,
    options,
    roleDescription,
    formatInstructions,
    exampleInstructions,
    constraintsText,
  ]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*  const finalPrompt = enhancedPrompt(input); */
    try {
      originalSubmit(e, { body: { finalPrompt: enhancedPrompt } });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("There was an error sending your message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <Button
        onClick={() => setShowGuide(!showGuide)}
        className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {showGuide ? "Hide Guide" : "Show Prompt Guide"}
      </Button>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-100 shadow-lg transition-transform duration-300 ease-in-out z-40
    ${showGuide ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 overflow-y-auto h-full space-y-4">
          <h2 className="text-xl font-bold">Prompt Engineering Guide</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Define Role:</strong> Helps the AI understand its
              perspective and expertise.
            </li>
            <li>
              <strong>Provide Context:</strong> Gives background information for
              more relevant responses.
            </li>
            <li>
              <strong>Be Specific:</strong> Requests detailed, focused answers
              rather than general ones.
            </li>
            <li>
              <strong>Set Format:</strong> Structures the response for better
              readability.
            </li>
            <li>
              <strong>Examples:</strong> Asks for practical illustrations of
              concepts.
            </li>
            <li>
              <strong>Constraints:</strong> Limits responses to certain criteria
              (e.g., verified sources).
            </li>
          </ul>
          <p className="mt-3 text-sm italic">
            Tip: Combine multiple options for best results. The more precise
            your prompt, the better the response.
          </p>

          <Button
            onClick={() => setShowEnhancePrompt(!showEnhancePrompt)}
            className="w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {showEnhancePrompt ? "Hide Enhancer" : "Prompt Enhancer"}
          </Button>

          {showEnhancePrompt && (
            <article className="relative flex flex-col p-4 pb-2 bg-gray-200 rounded-lg">
              <h3 className="font-medium mb-3">Enhance Your Prompt</h3>
              <div className="grid gap-2">
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
          )}
        </div>
      </div>
      <section className="flex flex-col pt-2">
        {messages.map((message) => (
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
            <div id="chat-bottom" />
          </div>
        ))}
      </section>

      <section className="fixed bottom-2 w-full max-w-3xl bg-gray-200 p-4 shadow-lg space-y-2 rounded-3xl">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-2 text-black/80"
        >
          {(input || enhancedPrompt) && (
            <div className="mt-2 p-2 bg-gray-100 border border-gray-200 rounded-lg text-sm">
              <strong>Prompt Preview:</strong> {enhancedPrompt}
            </div>
          )}

          <div className="flex items-center justify-between space-x-2 flex-1 border border-gray-300 rounded-xl bg-gray-100 overflow-hidden focus-within:bg-white duration-200">
            <input
              className="group outline-none px-3 w-full py-4 "
              value={input}
              placeholder="Type your message here..."
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              size={"lg"}
              className="rounded-lg transition mr-2"
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-black/60 mt-2 ml-1">
            Tip: Use the prompt guide to improve your prompt. For complex
            queries, combine multiple options.
          </p>
        </form>
      </section>
    </div>
  );
}
