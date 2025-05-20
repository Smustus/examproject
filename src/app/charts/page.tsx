"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase";
import Chart from "@/components/chart";
import {
  calculateConfidenceInterval,
  calculateMean,
  calculateStandardDeviation,
  performPairedTTest,
  performWilcoxonSignedRankTest,
} from "@/utils/calc";
import TokenUsageChart from "@/components/tokenChart";

export default function ChartsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [normalityResult, setNormalityResult] = useState<{
    statistic: number;
    p_value: number;
    isNormal: boolean | null;
  }>({ statistic: 0, p_value: 0, isNormal: null });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testResult, setTestResult] = useState<any | null>(null);

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

  const scoreDiff = useMemo(() => {
    return comparisons.map((obj: Comparison) => {
      return (
        obj.evaluation_enhanced_prompt.score - obj.evaluation_base_prompt.score
      );
    });
  }, [comparisons]);

  const enhancedScores = useMemo(
    () => comparisons.map((c) => c.evaluation_enhanced_prompt.score),
    [comparisons]
  );
  const baseScores = useMemo(
    () => comparisons.map((c) => c.evaluation_base_prompt.score),
    [comparisons]
  );

  // Run Shapiro-Wilk test when scoreDiff changes
  const runNormalityTest = async (data: number[]) => {
    try {
      const response = await fetch("/api/shapiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();

      setNormalityResult({
        statistic: result.statistic,
        p_value: result.p_value,
        isNormal: result.p_value > 0.05,
      });
    } catch (error) {
      console.error("Normality test failed:", error);
    }
  };

  useEffect(() => {
    if (scoreDiff.length > 3) {
      runNormalityTest(scoreDiff);
    }
  }, [scoreDiff]);

  // Run paired test when normality is determined
  useEffect(() => {
    if (normalityResult.isNormal === null) return;

    try {
      const result = normalityResult.isNormal
        ? performPairedTTest(baseScores, enhancedScores)
        : performWilcoxonSignedRankTest(enhancedScores, baseScores);

      setTestResult(result);
      console.log(result);
    } catch (e) {
      console.error("Paired test failed:", e);
    }
  }, [baseScores, enhancedScores, normalityResult]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Prompt Comparisons</h1>
      <div className="flex justify-between space-x-6 mb-6 p-4 bg-gray-100 rounded-lg w-full">
        {
          <div className="">
            <h2 className="font-semibold mb-2">Data</h2>
            <p>Entries: {scoreDiff.length}</p>
            <p>Mean: {calculateMean(scoreDiff).toFixed(4)}</p>
            <p>{`CI (95%): ${calculateConfidenceInterval(
              scoreDiff
            ).lowerBound.toFixed(2)} - ${calculateConfidenceInterval(
              scoreDiff
            ).upperBound.toFixed(2)}`}</p>
            <p>SD: {calculateStandardDeviation(scoreDiff).toFixed(4)}</p>
          </div>
        }
        {normalityResult.isNormal !== null && (
          <div className="">
            <h2 className="font-semibold mb-2">Normality Test Results</h2>
            <p>
              Shapiro-Wilk Statistic: {normalityResult.statistic.toFixed(4)}
            </p>
            <p>p-value: {normalityResult.p_value}</p>
            <p className="font-medium">
              Distribution is{" "}
              {normalityResult.isNormal ? "normal ✅" : "NOT normal ❌"}
              (α = 0.05)
            </p>
          </div>
        )}

        {testResult && (
          <div className="">
            <h2 className="font-semibold mb-2">
              {normalityResult.isNormal ? "Paired T-Test" : "Wilcoxon Test"}{" "}
              Result
            </h2>
            {normalityResult.isNormal ? (
              <>
                <p>t-statistic: {testResult.tStatistic.toFixed(4)}</p>
                <p>p-value: {testResult.pValue}</p>
                <p>
                  Result:{" "}
                  {testResult.pValue < 0.05
                    ? "Significant ✅"
                    : "Not significant ❌"}
                </p>
              </>
            ) : (
              <>
                <p>W: {testResult.W}</p>
                <p>z-statistic: {testResult.zStatistic.toFixed(4)}</p>
                <p>p-value: {testResult.pValue}</p>{" "}
                {/* The probability of seeing such an W statistic by chance if there was really no difference. */}
                <p>
                  Result:{" "}
                  {testResult.isSignificant
                    ? "Significant ✅"
                    : "Not significant ❌"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <Chart chartData={scoreDiff} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <TokenUsageChart chartData={comparisons} />
      </Suspense>
    </div>
  );
}
