export async function evaluateResponse({
  prompt,
  response,
  usage,
  options = {},
}: {
  prompt: string;
  response: string;
  usage: object;
  options: object;
}) {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, response, usage, options }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to evaluate response");
  }
  console.log("----------------------------------------");
  const data = await res.json();
  console.log(data);

  return data;
}

export async function compareResponses({
  basePrompt,
  enhancedPrompt,
  enhancedPromptResponse,
  enhancedPromptUsage,
  options = {},
}: {
  basePrompt: string;
  enhancedPrompt: string;
  enhancedPromptResponse: string;
  enhancedPromptUsage: object;
  options: object;
}) {
  const res = await fetch("/api/compare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      basePrompt,
      enhancedPrompt,
      enhancedPromptResponse,
      enhancedPromptUsage,
      options,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to evaluate response");
  }
  console.log("----------------------------------------");
  const data = await res.json();
  console.log(data);

  return data;
}

/* 
export async function evaluateResponse({
  prompt,
  response,
  usage,
  options,
}: {
  prompt: string;
  response: string;
  usage: any;
  options: any;
}) {
  const evaluationLog = {
    timestamp: new Date().toISOString(),
    prompt,
    response,
    usage,
    promptOptions: options,
    autoMetrics: {
      tokenCount: usage?.total_tokens,
      responseLength: response.length,
      // Add semantic evaluation scores later
    },
  };

  // Save to localStorage or your database
  const logs = JSON.parse(localStorage.getItem("promptLogs") || "[]");
  logs.push(evaluationLog);
  localStorage.setItem("promptLogs", JSON.stringify(logs));
} 
*/

/* 
5. Visual Analytics Tools (Optional)

Use a library like Recharts or Chart.js to:

    Plot token usage vs. number of enhancements

    Average output length per strategy

    Frequency of prompt features used
*/

/* 
🧪 Example Evaluation Questions You Can Now Answer

With this in place, you could empirically evaluate:

    Does adding examples increase output quality but cost more tokens?

    Do chain-of-thought prompts lead to longer, more accurate outputs?

    Are responses more concise or verbose with format instructions?

    What combination of prompt strategies yields the best coherence vs. cost tradeoff?
*/
