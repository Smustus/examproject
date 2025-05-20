/* "use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

type Evaluation = {
  id: string;
  score: number;
  prompt: string;
  response: string;
  feedback: string;
  created_at: string;
};

export default function DashboardClient() {
  const [messages, setMessages] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setMessages(data || []);
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chatbot Evaluations</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border px-4 py-2 text-left">Score</th>
              <th className="border px-4 py-2 text-left">Prompt</th>
              <th className="border px-4 py-2 text-left">Response</th>
              <th className="border px-4 py-2 text-left">Feedback</th>
              <th className="border px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((e, index) => (
              <tr
                key={e.id}
                className={`border-b ${index % 2 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="px-4 py-2">{e.score}</td>
                <td className="px-4 py-2 max-w-sm truncate" title={e.prompt}>
                  {e.prompt}
                </td>
                <td className="px-4 py-2 max-w-sm truncate" title={e.response}>
                  {e.response}
                </td>
                <td className="px-4 py-2 max-w-sm truncate" title={e.feedback}>
                  {e.feedback}
                </td>
                <td className="px-4 py-2">
                  {new Date(e.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 */

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function DashboardClient() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchComparisons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comparisons")
      .select("*") // Select all columns based on the new type
      .order("created_at", { ascending: false }); // Order by creation time

    if (error) {
      console.error("Error fetching comparisons:", error);
      setError(error.message);
    } else {
      setComparisons(data || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisons();

    // Use a unique channel name, maybe related to the table
    const channel = supabase
      .channel("realtime-comparisons")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "comparisons", // === Change table name ===
        },
        (payload) => {
          console.log("Realtime comparison update:", payload);
          // Re-fetch all data to update the list
          fetchComparisons();
        }
      )
      .subscribe(); // Subscribe to the channel

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error)
    return (
      <div className="p-6 text-red-600">Error loading comparisons: {error}</div>
    );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Prompt Comparison Dashboard
      </h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-xs leading-normal">
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Created
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Original Prompt
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Base Response
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Enhanced Response
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Base Score
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Enhanced Score
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Options Used
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Base Token Usage
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Enhanced Token Usage
              </th>
              <th className="py-2 px-6 text-left border-b border-gray-200">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {comparisons.map((comparison, index) => (
              <tr
                key={comparison.id}
                className={`border-b border-gray-200 ${
                  index % 2 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-2 px-6 text-left whitespace-nowrap">
                  {new Date(comparison.created_at).toLocaleString()}
                </td>

                <td
                  className="py-2 px-6 text-left max-w-xs truncate"
                  title={comparison.prompt || ""}
                >
                  {comparison.prompt}
                </td>

                <td
                  className="py-2 px-6 text-left max-w-xs truncate"
                  title={comparison.response_base_prompt || ""}
                >
                  {comparison.response_base_prompt}
                </td>

                <td
                  className="py-2 px-6 text-left max-w-xs truncate"
                  title={comparison.response_enhanced_prompt || ""}
                >
                  {comparison.response_enhanced_prompt}
                </td>

                <td className="py-2 px-6 text-left ">
                  {comparison.evaluation_base_prompt?.score != null
                    ? (
                        comparison.evaluation_base_prompt.score as number
                      ).toFixed(2)
                    : "N/A"}{" "}
                </td>
                <td className="py-2 px-6 text-left">
                  {comparison.evaluation_enhanced_prompt?.score != null
                    ? (
                        comparison.evaluation_enhanced_prompt.score as number
                      ).toFixed(2)
                    : "N/A"}
                </td>

                <td className="py-2 px-6 text-left max-w-xs">
                  {comparison.options
                    ? // Filter for options that are true and join the keys
                      Object.entries(comparison.options)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .filter(([key, value]) => value === true)
                        .map(([key]) => key) // Get the key name
                        .join(", ") || "None" // Join with comma, display 'None' if no options are true
                    : "N/A"}{" "}
                </td>
                {/* Optional: Display usage or feedback JSONB (might need more complex rendering) */}
                <td
                  className="py-2 px-6 text-left max-w-xs truncate"
                  title={JSON.stringify(comparison.base_prompt_usage)}
                >
                  {/* {`Prompt:
                  ${JSON.stringify(comparison.base_prompt_usage.promptTokens)},
                  Response: ${JSON.stringify(
                    comparison.base_prompt_usage.completionTokens
                  )}`} */}
                  {`${JSON.stringify(
                    comparison.base_prompt_usage.totalTokens
                  )}`}
                </td>
                <td
                  className="py-2 px-6 text-left max-w-xs"
                  title={JSON.stringify(comparison.enhanced_prompt_usage)}
                >
                  {/* {`Prompt: ${JSON.stringify(
                    comparison.enhanced_prompt_usage.promptTokens
                  )},
                  Response: ${JSON.stringify(
                    comparison.enhanced_prompt_usage.completionTokens
                  )}`} */}
                  {`${JSON.stringify(
                    comparison.enhanced_prompt_usage.totalTokens
                  )}`}
                </td>
                <td
                  className="py-2 px-6 text-left max-w-xs truncate"
                  title={comparison.feedback!}
                >
                  {comparison.feedback}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <p className="text-center text-gray-500 mt-8">Loading data...</p>
      )}
      {comparisons.length === 0 && !error && !loading && (
        <p className="text-center text-gray-500 mt-8">
          No comparison data available yet.
        </p>
      )}
    </div>
  );
}
