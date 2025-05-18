import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  /* const { messages } = await req.json(); */
  const data = await req.json();
  console.log(data);

  const systemInstruction = `You are a helpful assistant. You listen carefully to instructions. You can answer questions and provide information on a wide range of topics. Your answers should be clear, concise, and well-structured using proper Markdown syntax.
    Guidelines:
    - Use **bold** for emphasis
    - Use *italics* for subtle emphasis
    - Format links like [example](https://www.example.com), have text change color to blue for links
    - Use # Headings and ## Subheadings where appropriate
    - Use bullet points and numbered lists for structure
    - Format code using \`\`inline code\`\` or code blocks with triple backticks

    Do not use any HTML.  Just Markdown.
    All responses must follow these formatting rules consistently.`;

  const result = streamText({
    model: openai("gpt-4o-mini"), //o3-mini gpt-4o gpt-4o-mini o4-mini gpt-4.1-mini gpt-4.1-nano
    temperature: 0.5,
    /* topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered */
    topK: 40, //Only sample from the top K options for each subsequent token.
    /* messages, */
    /* messages: data.clearHistory ? data.finalPrompt : messages, */
    prompt: data.finalPrompt,
    system: systemInstruction,
  });

  return result.toDataStreamResponse();
}

/* Focus Area 5: Efficiency and Optimization

    Optimizing Prompt Strategies for Cost and Performance Trade-offs:
        What to Evaluate: How do different prompting approaches affect factors like token usage (cost) and generation latency, while maintaining a required level of output quality?
        How to Evaluate:
            Select a task and an LLM with a usage-based cost model (many public APIs).
            Implement and test different prompting strategies (e.g., concise zero-shot vs. verbose few-shot vs. multi-turn conversation).
            Measure token usage, response time, and evaluate output quality.
            Analyze the trade-offs.
        Potential Question: How does the length and structure of prompts influence token cost and response time for a complex summarization task, and at what point do these factors outweigh the benefits in output quality?
         */
