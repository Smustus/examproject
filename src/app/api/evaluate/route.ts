import { supabase } from "@/utils/supabase";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  /* const { messages } = await req.json(); */
  try {
    const data = await req.json();
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
      You are an expert AI critic, evaluating an assistant's response to a user's prompt.

      Your goal is to rate the quality of the response using a holistic but clearly defined rubric, and to provide detailed, structured feedback.

      Evaluate the assistant's response across the following six criteria:

      1. **Accuracy** - Is the information factually correct?
      2. **Correctness** - Does it logically answer the user's prompt or question?
      3. **Relevance** - Does it stay on topic and directly address the prompt?
      4. **Completeness** - Are all important aspects of the user's prompt addressed?
      5. **Aesthetics** - Is the language clear, well-formatted, and readable?
      6. **Tone** - Is the tone appropriate, respectful, and helpful?

      For each criterion, give a **score from 1 to 10**, where:
      - 1 = Very poor
      - 5 = Acceptable
      - 10 = Excellent

      The overall **score** (1-100) should reflect the general quality of the response and should not just be an average. Instead, it should:
      - Heavily penalize failures in Accuracy, Correctness, or Relevance.
      - Reward clarity, helpful tone, and thoroughness.
      - Reflect real-world usefulness and trustworthiness.

      Then, provide a detailed explanation of the assistant's strengths and weaknesses, and suggestions for improvement.

      Respond ONLY with valid, parsable JSON in the following format:

      {
        "prompt": ${JSON.stringify(prompt)},
        "response": ${JSON.stringify(response)},
        "criteria_scores": {
          "accuracy": <1-10>,
          "correctness": <1-10>,
          "relevance": <1-10>,
          "completeness": <1-10>,
          "aesthetics": <1-10>,
          "tone": <1-10>
        },
        "score": <1-100>,
        "feedback": "<Detailed explanation of the evaluation, including both strengths and areas for improvement.>"
      }
    `;

    const result = await generateText({
      model: openai("gpt-4o-mini"), //o3-mini gpt-4o gpt-4o-mini o4-mini gpt-4.1-mini gtp-4.1
      temperature: 0.5,
      topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered
      topK: 50, //Only sample from the top K options for each subsequent token.
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
        options: options,
        criteria_scores: parsed.criteria_scores,
        score: parsed.score,
        usage: usage,
        feedback: parsed.feedback,
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
