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
