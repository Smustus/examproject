import React from "react";

const guideSteps = [
  {
    title: "Start with Defining the Assistant Role",
    description:
      "Establish who the AI should act as (e.g., 'You are a career coach/software developer...')",
  },
  {
    title: "Define the Objective",
    description:
      "Clearly state what you want the AI to do — this sets the direction. For example: 'Summarize the article below...' or 'Explain this like I’m 5...'.",
  },
  {
    title: "Define Tone and Target Audience",
    description:
      "Define the tone (e.g., 'formal, playful') and target audience (e.g., professionals, layman).",
  },
  {
    title: "Provide Context",
    description:
      "Give any necessary background or constraints as early as possible. This helps the AI form a better mental model before generating a response.",
  },
  {
    title: "Specify Format or Style",
    description:
      "If you expect a certain structure (like bullet points, JSON, a numbered list), say so upfront.",
  },
  {
    title: "Include Optional Details",
    description:
      "Less critical info or additional clarifications can come later in the prompt — after the essential instructions.",
  },
];

export default function PromptOrderGuideModern() {
  return (
    <section className="max-w-3xl mx-auto p-6 md:p-8 space-y-4 ">
      <div className="text-center">
        <h2 className="text-3xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/90 via-black/70 to-black/80 pb-4 ">
          Prompt Construction: Order is Key
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Large language models assign greater importance to the initial tokens
          in a prompt. Strategically order your prompt elements, placing the
          most critical information upfront.
        </p>
      </div>

      <div className="space-y-4">
        {guideSteps.map((step, index) => (
          <div
            key={index}
            className="relative flex items-start py-4 px-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-200/80 group overflow-hidden"
          >
            <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-black/80 via-red-800/80 to-white group-hover:from-black/90 group-hover:via-red-900 group-hover:to-red-900/10 transition-all duration-300" />
            <div className="flex-shrink-0 mr-4 mt-1">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-black/80 text-white text-sm font-semibold shadow-md group-hover:bg-black/90 transition-all duration-300">
                {index + 1}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-black/90 transition-colors duration-200 mb-1">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <p className="text-sm text-gray-500 italic">
          Tip: Iterate on your prompt structure for the best results. Small
          changes can lead to big improvements!
        </p>
      </div>
    </section>
  );
}
