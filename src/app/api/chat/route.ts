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
    model: openai("gpt-4o"),
    temperature: 0.5,
    topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered
    topK: 20, //Only sample from the top K options for each subsequent token.
    /* messages, */
    messages: data.clearHistory ? [messages[messages.length - 1]] : messages,
    system: `You are a helpful assistant. You can answer questions and provide information on a wide range of topics. Be concise and clear in your responses.
    Respond using *only* Markdown formatting.  For example:
    * **Bold text**
    * *Italics*
    * A [link](https://www.example.com)
    * # Heading 1
    * ## Heading 2

    Do not use any HTML.  Just Markdown.`,
  });

  return result.toDataStreamResponse();
}
