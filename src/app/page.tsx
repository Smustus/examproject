"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import PromptEnhancer from "@/components/promptEnhancer";
import PromptGuide from "@/components/promptOrderGuide";
import PromptEngineeringAdvice from "@/components/promptEngineeringAdvice";
import { evaluateResponse } from "@/utils/evaluateResponse";
import ChatMessage from "@/components/chatMessage";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
  } = useChat({
    onFinish: async (message, options) => {
      const evaluationPrompt = {
        prompt: enhancedPrompt,
        response: message.content,
        usage: options.usage,
        options: promptOptions,
      };
      await evaluateResponse(evaluationPrompt);
    },
  });

  const [promptOptions, setPromptOptions] = useState({
    defineRole: false,
    provideContext: false,
    setFormat: false,
    examples: false,
    constraints: false,
    cot: false,
  });
  const [enhanceText, setEnhanceText] = useState<EnhanceTextType>({
    context: "",
    roleDescription: "",
    formatInstructions: "",
    exampleInstructions: "",
    constraintsText: "",
  });

  const [showGuide, setShowGuide] = useState(false);
  const [showEnhancePrompt, setShowEnhancePrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const lastMessage = document.querySelector("#chat-bottom");
    lastMessage?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enhancedPrompt = useMemo(() => {
    let enhanced = input;
    if (promptOptions.defineRole) {
      enhanced =
        `You are ${
          enhanceText.roleDescription ||
          "an expert in this field with 10+ years of experience"
        }. ` + enhanced;
    }
    if (promptOptions.provideContext) {
      enhanced += enhanceText.context;
    }

    if (promptOptions.setFormat) {
      enhanced +=
        " " +
        (enhanceText.formatInstructions ||
          "Format your response with clear headings, bullet points, and numbered steps where appropriate.");
    }
    if (promptOptions.examples) {
      enhanced +=
        " " +
        (enhanceText.exampleInstructions ||
          "Provide a relevant example to illustrate your points.");
    }
    if (promptOptions.constraints) {
      enhanced +=
        " " +
        (enhanceText.constraintsText ||
          "Include only verified information from reliable sources.");
    }
    if (promptOptions.cot) {
      enhanced +=
        " " +
        "Reason step-by-step (Chain of thought) and take pauses before answering.";
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
    <div className="flex flex-col justify-between items-center min-h-[97vh] w-full max-w-3xl mx-auto">
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
      <section className="flex flex-col pt-2 h-full lg:max-h-[85vh] overflow-scroll w-full">
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
            <input
              className="group outline-none px-3 w-full py-4 text-black/90"
              value={input}
              placeholder="Type your message here..."
              onChange={handleInputChange}
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
          {/* <PromptEnhancer
            enhanceText={enhanceText}
            setEnhanceText={setEnhanceText}
            setShowEnhancePrompt={setShowEnhancePrompt}
            showEnhancePrompt={showEnhancePrompt}
            setPromptOptions={setPromptOptions}
            promptOptions={promptOptions}
          /> */}
        </form>
      </section>
    </div>
  );
}
