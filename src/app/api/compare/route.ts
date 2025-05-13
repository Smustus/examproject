import { supabase } from "@/utils/supabase";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  /* const { messages } = await req.json(); */
  try {
    const data = await req.json();
    const {
      basePrompt,
      enhancedPrompt,
      enhancedPromptResponse,
      enhancedPromptUsage,
      options,
    } = data;

    if (!basePrompt || !enhancedPromptResponse) {
      return new Response(
        JSON.stringify({
          error: "Missing 'prompt' or 'response' in request body.",
        }),
        { status: 400 }
      );
    }

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

    const result = await generateText({
      model: openai("gpt-4o-mini"), //o3-mini gpt-4o gpt-4o-mini o4-mini gpt-4.1-mini gtp-4.1
      temperature: 0.8,
      /* topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered */
      topK: 40, //Only sample from the top K options for each subsequent token.
      prompt: `${basePrompt}`,
      system: systemInstruction,
    });

    const responseBasePrompt = result.text.trim();

    const systemInstructionsCompare = `
      You are an expert AI evaluator comparing two different responses provided by an AI assistant to the same user prompt.
      Your goal is to evaluate and critic the quality of *each* response individually using a defined rubric, compare them directly, and provide detailed, structured feedback highlighting strengths, weaknesses, and which response is generally better and why.`;

    const compareInstructionsPrompt = `
      You are an expert AI evaluator comparing two different responses provided by an AI assistant to the same user prompt.

      Your goal is to evaluate and critic the quality of *each* response individually using a defined rubric, compare them directly, and provide detailed, structured feedback highlighting strengths, weaknesses, and which response is generally better and why.

      Response A was generated using the Original Task (Base Prompt).
      Response B was generated using an Enhanced Prompt, which includes the Original Task plus additional instructions.

      Original Task (Base Prompt):
      ${basePrompt}

      Prompt used for Response B (Enhanced Prompt):
      ${enhancedPrompt}

      Response A:
      ${responseBasePrompt}

      Response B:
      ${enhancedPromptResponse}

      1.  Evaluate Response A based on how well it addresses the Original Task (Base Prompt) and general quality criteria.
      2.  Evaluate Response B based on how well it addresses the Original Task AND successfully implements the *additional instructions* present in the Enhanced Prompt (e.g., role, format, constraints, context, etc.). This is the primary focus for Response B.

      3. Evaluate each response across the following six criteria:
        **Accuracy** - Is the information factually correct?
        **Correctness** - Does it logically answer the user's prompt or question?
        **Relevance** - Does it stay on topic and directly address the prompt?
        **Completeness** - Are all important aspects of the user's prompt addressed?
        **Aesthetics** - Is the language clear, well-formatted, and readable?
        **Tone** - Is the tone appropriate, respectful, and helpful?

        For each criterion, give a **score from 1 to 10** for *each* response, where:
        - 1 = Very poor
        - 5 = Acceptable
        - 10 = Excellent

      4. Provide an overall **score** (1-100) for *each* response. This score should reflect the general quality of the response and should not just be an average of the criteria scores. Instead, it should:
      - Heavily penalize failures in Accuracy, Correctness, or Relevance.
      - Reward clarity, helpful tone, and thoroughness.
      - Reflect real-world usefulness and trustworthiness.

      5. Finally, provide a detailed **comparison feedback**. This should:
      - Summarize the strengths and weaknesses of Response 1.
      - Summarize the strengths and weaknesses of Response 2.
      - Clearly compare the two responses, stating which one is better overall and providing specific reasons why, referencing the criteria and content as needed.

      Respond ONLY with valid, parsable JSON in the following format:

      {
        "prompt": "<The original user prompt>",
        "responseBasePrompt": "<The text of Response A>",
        "evaluationBasePrompt": { 
          "criteria_scores": {
            "accuracy": <1-10>,
            "correctness": <1-10>,
            "relevance": <1-10>,
            "completeness": <1-10>,
            "aesthetics": <1-10>,
            "tone": <1-10>
          },
          "score": <1-100>
        },
        "enhancedPrompt: "<The enhanced prompt">
        "responseEnhancedPrompt": "<The text of Response B>",
        "evaluationEnhancedPrompt": {
          "criteria_scores": {
            "accuracy": <1-10>,
            "correctness": <1-10>,
            "relevance": <1-10>,
            "completeness": <1-10>,
            "aesthetics": <1-10>,
            "tone": <1-10>
          },
          "score": <1-100>
        },
        "feedback": "<Detailed explanation comparing Response 1 and Response 2, concluding which is better and why.>"
      }
      Make sure the JSON is strictly valid and contains only the specified fields.
    `;

    const resultCompare = await generateText({
      model: openai("gpt-4o-mini"), //o3-mini gpt-4o gpt-4o-mini o4-mini gpt-4.1-mini gtp-4.1
      temperature: 0.8,
      /* topP: 0.1, //0.1 would mean that only tokens with the top 10% probability mass are considered */
      topK: 40, //Only sample from the top K options for each subsequent token.
      system: systemInstructionsCompare,
      prompt: compareInstructionsPrompt,
    });

    const textOutput = resultCompare.text.trim();
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

    const { error } = await supabase.from("comparisons").insert([
      {
        prompt: parsed.prompt,
        response_base_prompt: parsed.responseBasePrompt,
        evaluation_base_prompt: parsed.evaluationBasePrompt,
        base_prompt_usage: result.usage,
        response_enhanced_prompt: parsed.responseEnhancedPrompt,
        evaluation_enhanced_prompt: parsed.evaluationEnhancedPrompt,
        enhanced_prompt_usage: enhancedPromptUsage,
        feedback: parsed.feedback,
        options: options,
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
