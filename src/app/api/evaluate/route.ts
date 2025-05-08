import { supabase } from "@/utils/supabase";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  /* const { messages } = await req.json(); */
  try {
    const data = await req.json();
    console.log(data);
    const { prompt, response, usage, options } = data;
    if (!prompt || !response) {
      return new Response(
        JSON.stringify({
          error: "Missing 'prompt' or 'response' in request body.",
        }),
        { status: 400 }
      );
    }

    const systemInstruction = `
    You are an expert AI grader. Evaluate the assistant's response to a user's prompt.
    Rate the response on correctness, relevance, completeness, and tone.
    Return your evaluation in the following strict JSON format:
    
    {
      "prompt": ${JSON.stringify(prompt)},
      "response": ${JSON.stringify(response)},
      "score": 1-10,
      "feedback": "<detailed explanation>",
      "usage": ${JSON.stringify(usage)},
      "options": ${JSON.stringify(options)},
    }
    `;
    const result = await generateText({
      model: openai("gpt-4o"),
      temperature: 0.5,
      topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered
      topK: 20, //Only sample from the top K options for each subsequent token.
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: response,
        },
      ],
      system: systemInstruction,
    });

    const textOutput = result.text.trim();
    let parsed;
    try {
      parsed = JSON.parse(textOutput);
      console.log(parsed);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "LLM did not return valid JSON " + error,
          raw: textOutput,
        }),
        { status: 500 }
      );
    }

    const { error } = await supabase.from("messages").insert([
      {
        prompt: parsed.prompt,
        response: parsed.response,
        score: parsed.score,
        feedback: parsed.feedback,
        usage: parsed.usage,
        options: parsed.options,
      },
    ]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
