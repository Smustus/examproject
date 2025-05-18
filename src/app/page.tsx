"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import PromptEnhancer from "@/components/promptEnhancer";
import PromptGuide from "@/components/promptOrderGuide";
import PromptEngineeringAdvice from "@/components/promptEngineeringAdvice";
import { compareResponses } from "@/utils/evaluateResponse";
import ChatMessage from "@/components/chatMessage";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
  } = useChat({
    onFinish: async (message, options) => {
      /* const evaluationPrompt = {
        prompt: enhancedPrompt,
        response: message.content,
        usage: options.usage,
        options: promptOptions,
      }; */
      console.log(options.usage);
      console.log(basePrompt);

      const comparePrompt = {
        basePrompt: basePrompt,
        enhancedPrompt: enhancedPrompt,
        enhancedPromptResponse: message.content,
        enhancedPromptUsage: options.usage,
        options: promptOptions,
      };
      /* await evaluateResponse(evaluationPrompt); */
      await compareResponses(comparePrompt);
    },
  });

  const [promptOptions, setPromptOptions] = useState({
    defineRole: false,
    provideContext: false,
    setFormat: false,
    examples: false,
    constraints: false,
    cot: false,
    targetAudience: false,
    desiredLength: false,
    explicitThinking: false,
    generateKnowledge: false,
  });
  const [enhanceText, setEnhanceText] = useState<EnhanceTextType>({
    context: "",
    roleDescription: "",
    formatInstructions: "",
    exampleInstructions: "",
    constraintsText: "",
    targetAudienceDescription: "",
    desiredLengthHint: "",
  });
  const [basePrompt, setBasePrompt] = useState<string>("");

  const [showGuide, setShowGuide] = useState(false);
  const [showEnhancePrompt, setShowEnhancePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const lastMessage = document.querySelector("#chat-bottom");
    lastMessage?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enhancedPrompt = useMemo(() => {
    let enhanced = input;
    const instructionParts: string[] = [];

    if (promptOptions.defineRole && enhanceText.roleDescription) {
      instructionParts.push(`You are ${enhanceText.roleDescription}.`);
    } else if (promptOptions.defineRole) {
      instructionParts.push(
        `Act as an expert in this field with 10+ years of experience.`
      );
    }

    if (promptOptions.targetAudience && enhanceText.targetAudienceDescription) {
      instructionParts.push(
        `Tailor the response for ${enhanceText.targetAudienceDescription}.`
      );
    } else if (promptOptions.targetAudience) {
      instructionParts.push(`Tailor the response for a general audience.`);
    }

    if (promptOptions.provideContext && enhanceText.context) {
      instructionParts.push(`Additional context: ${enhanceText.context}.`);
    }

    if (promptOptions.setFormat && enhanceText.formatInstructions) {
      instructionParts.push(
        `Format your response as follows: ${enhanceText.formatInstructions}.`
      );
    } else if (promptOptions.setFormat) {
      instructionParts.push(
        `Format your response with clear headings, bullet points, and numbered steps where appropriate.`
      );
    }

    if (promptOptions.examples && enhanceText.exampleInstructions) {
      instructionParts.push(
        `Here are examples: ${enhanceText.exampleInstructions}.`
      );
    }
    if (promptOptions.constraints && enhanceText.constraintsText) {
      instructionParts.push(
        `Adhere to these constraints: ${enhanceText.constraintsText}.`
      );
    } else if (promptOptions.constraints) {
      instructionParts.push(
        `Adhere to these constraints: Include only verified information from reliable sources.`
      );
    }

    if (promptOptions.cot) {
      instructionParts.push(
        "Think step-by-step (Chain of thought) while reasoning."
      );
    }

    if (promptOptions.desiredLength && enhanceText.desiredLengthHint) {
      instructionParts.push(
        `The desired output length is ${enhanceText.desiredLengthHint}.`
      );
    }

    if (promptOptions.explicitThinking) {
      instructionParts.push(
        `Before providing the final answer, internally think step-by-step to analyze the problem.`
      );
    }
    if (promptOptions.generateKnowledge) {
      instructionParts.push(
        `First, generate and list relevant facts about the topic before providing the final response.`
      );
    }
    if (instructionParts.length > 0) {
      enhanced = instructionParts.join("\n") + "\n" + enhanced;
    }

    return enhanced;
  }, [input, promptOptions, enhanceText]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      originalSubmit(e, {
        body: {
          finalPrompt: enhancedPrompt,
          clearHistory: true,
        },
      });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-[95vh] w-full max-w-3xl mx-auto">
      <PromptEnhancer
        enhanceText={enhanceText}
        setEnhanceText={setEnhanceText}
        setShowEnhancePrompt={setShowEnhancePrompt}
        showEnhancePrompt={showEnhancePrompt}
        setPromptOptions={setPromptOptions}
        promptOptions={promptOptions}
      />

      <Button
        onClick={() => setShowGuide(!showGuide)}
        className="fixed top-4 right-4 z-50"
      >
        {showGuide ? "Hide" : "Show Prompt Guide"}
      </Button>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] xl:max-w-[450px] 2xl:max-w-[500px] bg-gray-100 shadow-lg border transition-transform duration-300 ease-in-out z-40 overflow-scroll
    ${showGuide ? "translate-x-0" : "translate-x-full"}`}
      >
        <PromptEngineeringAdvice />
        <PromptGuide />
      </div>
      <section className="flex flex-col pt-2 h-full lg:max-h-[85vh] overflow-y-scroll w-full">
        {messages.length < 1 ? (
          <p className="font-semibold text-black/70 text-center mt-14">
            Send a message to initiate the chat
          </p>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div id="chat-bottom" />
      </section>

      <section className="sticky bottom-2 w-full max-w-3xl bg-gray-200 p-2 sm:p-4 shadow-lg space-y-2 rounded-3xl border">
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
            <textarea
              rows={2}
              className="group outline-none px-3 w-full py-4 text-black/90"
              value={input}
              placeholder="Type your message here..."
              onChange={(e) => {
                handleInputChange(e);
                setBasePrompt(e.target.value);
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg transition mr-2"
            >
              {isSubmitting ? "Processing..." : "Send"}
            </Button>
          </div>
          <p className="text-xs text-black/60 mt-2 ml-1">
            Tip: Use the prompt enhancer to improve your prompt. For complex
            queries, combine multiple options.
          </p>
          <Button
            onClick={() => setShowEnhancePrompt(!showEnhancePrompt)}
            className={` ${showEnhancePrompt ? "" : ""}`}
          >
            {showEnhancePrompt ? "Hide" : "Prompt Enhancer"}
          </Button>
        </form>
      </section>
    </div>
  );
}
