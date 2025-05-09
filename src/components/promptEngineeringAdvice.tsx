import React from "react";

const guideSteps = [
  {
    title: "Define Role",
    description:
      "Helps the AI adopt a specific point of view (e.g., teacher, developer), improving the relevance and tone of responses.",
  },
  {
    title: "Provide Context",
    description:
      "Supplies background info (goals, audience, prior steps) so responses align with your needs.",
  },
  {
    title: "Be Specific",
    description:
      "Narrows the scope of the question, reducing ambiguity and enabling more accurate, useful answers.",
  },
  {
    title: "Set Format",
    description:
      "Specifies how results should be presented (e.g., bullet points, a numbered list, tables) to improve clarity. If you expect a certain structure, say so upfront.",
  },
  {
    title: "Examples",
    description:
      "Requests demonstrations or analogies to clarify complex concepts through relatable scenarios.",
  },
  {
    title: "Constraints",
    description:
      "Applies limits such as word count, tone, or trusted sources to ensure answers meet requirements.",
  },
  {
    title: "Iterate",
    description:
      "Refines results by building on previous responses, allowing deeper exploration or corrections.",
  },
  {
    title: "Ask 'Why' or 'How'",
    description:
      "Prompts deeper reasoning or explanations beyond surface-level facts.",
  },
  {
    title: "Use Step-by-Step Requests (Chain of Thought)",
    description:
      "Instructs the AI to reason step-by-step before answering, improving logic and complex task accuracy. Breaks down complex tasks into manageable parts for clearer guidance and fewer errors",
  },
  {
    title: "Define Tone and Audience",
    description:
      "Tailors the response style for professionals, beginners, or casual readers as needed.",
  },
  {
    title: "Be Concise",
    description:
      "Use focused language to reduce confusion and improve model understanding.",
  },
];

export default function PromptEngineeringAdvice() {
  return (
    <section className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-3xl md:text-3xl mt-14 sm:mt-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/90 via-black/70 to-black/80 pb-4 ">
          Prompt Engineering Guide
        </h2>
      </div>

      <div className="space-y-4">
        {guideSteps.map((step, index) => (
          <div
            key={index}
            className="relative flex items-start py-4 px-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-200/80 group overflow-hidden"
          >
            <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-black/80 via-red-800/80 to-white group-hover:from-black/90 group-hover:via-red-900 group-hover:to-red-900/10 transition-all duration-200" />
            <div className="flex-shrink-0 mr-4 mt-1">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-black/80 text-white text-sm font-semibold shadow-md group-hover:bg-black/90 transition-colors duration-200">
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
          Tip: Combine multiple options for best results. The more precise your
          prompt, the better the response.
        </p>
      </div>
    </section>
  );
}
