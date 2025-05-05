"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

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
  const [showGuide, setShowGuide] = useState(false);

  const enhancedPrompt = (rawPrompt: string) => {
    let enhanced = "";

    if (options.defineRole) {
      enhanced +=
        "You are an expert in this field with 10+ years of experience. ";
    }

    if (options.provideContext) {
      enhanced +=
        "Context: " +
        (context.length > 0
          ? context
          : "This is important for my work/project.") +
        " ";
    }

    if (options.beSpecific) {
      enhanced += "Please provide a detailed response with explanations. ";
    }

    if (options.setFormat) {
      enhanced +=
        "Format your response with clear headings, bullet points, and numbered steps where appropriate. ";
    }

    if (options.constraints) {
      enhanced += "Include only verified information from reliable sources. ";
    }

    if (options.examples) {
      enhanced += "Provide 2-3 relevant examples to illustrate your points. ";
    }

    return `${enhanced}${rawPrompt}`;
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalPrompt = enhancedPrompt(input);
    originalSubmit(e, { body: finalPrompt });
  };

  return (
    <div className="flex flex-col w-full max-w-3xl py-24 mx-auto stretch">
      {/* Guide toggle */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {showGuide ? "Hide Guide" : "Show Prompt Guide"}
      </button>

      {/* Prompt engineering guide */}
      {showGuide && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Prompt Engineering Guide</h2>
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
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <div
          key={message.id}
          className="whitespace-pre-wrap mb-4 p-3 bg-white rounded shadow"
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
      ))}

      {/* Prompt options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3">Enhance Your Prompt</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="defineRole"
              checked={options.defineRole}
              onChange={handleOptionChange}
              className="h-4 w-4"
            />
            <span>Define Assistant Role</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="provideContext"
              checked={options.provideContext}
              onChange={handleOptionChange}
              className="h-4 w-4"
            />
            <span>Provide Context</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="beSpecific"
              checked={options.beSpecific}
              onChange={handleOptionChange}
              className="h-4 w-4"
            />
            <span>Request Specific Response</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="setFormat"
              checked={options.setFormat}
              onChange={handleOptionChange}
              className="h-4 w-4"
            />
            <span>Structured Format</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="examples"
              checked={options.examples}
              onChange={handleOptionChange}
              className="h-4 w-4"
            />
            <span>Include Examples</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="constraints"
              checked={options.constraints}
              onChange={handleOptionChange}
              className="h-4 w-4"
            />
            <span>Add Constraints</span>
          </label>
        </div>
      </div>

      {/* Context input (shown when provideContext is checked) */}
      {options.provideContext && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Additional Context (optional):
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Explain your situation, project, or what you need this information for..."
            rows={2}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-3xl bg-white p-4 shadow-lg"
      >
        <div className="flex space-x-2">
          <input
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={input}
            placeholder="Type your message here..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tip: Use the options above to improve your prompt. For complex
          queries, combine multiple options.
        </p>
      </form>
    </div>
  );
}
