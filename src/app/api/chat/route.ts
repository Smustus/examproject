import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  /* const { messages } = await req.json(); */
  const data = await req.json();
  console.log(data);
  const messages = data.messages;

  const result = streamText({
    model: openai("o3-mini"),
    temperature: 0.5,
    topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered
    topK: 20, //Only sample from the top K options for each subsequent token.
    /* messages, */
    messages: data.clearHistory ? [messages[messages.length - 1]] : messages,
    system: `You are a helpful assistant. You can answer questions and provide information on a wide range of topics. Your answers should be clear, concise, and well-structured using proper Markdown syntax.
    Guidelines:
    - Use **bold** for emphasis
    - Use *italics* for subtle emphasis
    - Format links like [example](https://www.example.com) and have them in dark blue text color
    - Use # Headings and ## Subheadings where appropriate
    - Use bullet points and numbered lists for structure
    - Format code using \`\`inline code\`\` or code blocks with triple backticks

    Do not use any HTML.  Just Markdown.
    All responses must follow these formatting rules consistently.`,
  });

  return result.toDataStreamResponse();
}
