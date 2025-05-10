"use client";

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
