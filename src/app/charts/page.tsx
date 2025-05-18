"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase";
import Chart from "@/components/chart";

export default function ChartsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [normalityResult, setNormalityResult] = useState<{
    statistic: number;
    p_value: number;
    isNormal: boolean | null;
  }>({ statistic: 0, p_value: 0, isNormal: null });

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comparisons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setComparisons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisons();
  }, []);

  // Run Shapiro-Wilk test when scoreDiff changes
  const runNormalityTest = async (data: number[]) => {
    try {
      const response = await fetch("/api/shapiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();
      console.log(result);

      setNormalityResult({
        statistic: result.statistic,
        p_value: result.p_value,
        isNormal: result.p_value > 0.05, // Common significance level
      });
    } catch (error) {
      console.error("Normality test failed:", error);
    }
  };

  const scoreDiff = useMemo(() => {
    return comparisons.map((obj: Comparison) => {
      return (
        obj.evaluation_enhanced_prompt.score - obj.evaluation_base_prompt.score
      );
    });
  }, [comparisons]);

  useEffect(() => {
    console.log(scoreDiff);
    if (scoreDiff.length > 3) {
      // Shapiro-Wilk requires 3+ data points
      runNormalityTest(scoreDiff);
    }
  }, [scoreDiff]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Prompt Comparisons</h1>

      {/*    {normalityResult.isNormal !== null && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Normality Test Results</h2>
          <p>Shapiro-Wilk Statistic: {normalityResult.statistic.toFixed(4)}</p>
          <p>p-value: {normalityResult.p_value.toFixed(4)}</p>
          <p className="font-medium">
            Distribution is{" "}
            {normalityResult.isNormal ? "normal ✅" : "NOT normal ❌"}
            (α = 0.05)
          </p>
        </div>
      )} */}

      <Suspense fallback={<p>Loading...</p>}>
        <Chart chartData={scoreDiff} />
      </Suspense>
    </div>
  );
}
