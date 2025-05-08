import { supabase } from "@/utils/supabase";

export default async function DashboardPage() {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading evaluations: {error.message}</div>;
  }

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
            {messages.map((e: Evaluation) => (
              <tr key={e.id} className="border-b">
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
