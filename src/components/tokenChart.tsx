/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { ChartConfig, ChartContainer } from "./ui/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  calculateConfidenceInterval,
  calculateMean,
  calculateMedian,
  calculateStandardDeviation,
  performPairedTTest,
} from "@/utils/calc";

const chartConfig = {
  tokens: {
    label: "Avg Token Usage",
    color: "#000000",
  },
  diff: {
    label: "Diff",
    color: "#000000",
  },
} satisfies ChartConfig;

const TokenUsageChart = ({ chartData }: { chartData: any }) => {
  const extractBaseUsage = useMemo(() => {
    return chartData.map((dataPoint: Comparison) => {
      return dataPoint.base_prompt_usage.totalTokens;
    });
  }, [chartData]);
  const extractEnhancedUsage = useMemo(() => {
    return chartData.map((dataPoint: Comparison) => {
      return dataPoint.enhanced_prompt_usage.totalTokens;
    });
  }, [chartData]);

  const calcAvgTokenUsage = () => {
    const avgBase = calculateMean(extractBaseUsage);
    const avgEnhanced = calculateMean(extractEnhancedUsage);
    return [
      { label: "Base", avgTokens: avgBase.toFixed() },
      { label: "Enhanced", avgTokens: avgEnhanced.toFixed() },
    ];
  };

  /*   const calcMedianTokenUsage = () => {
    const medianBase = calculateMedian(extractBaseUsage);
    const medianEnhanced = calculateMedian(extractEnhancedUsage);
    return [
      { label: "Base", medianTokens: medianBase.toFixed() },
      { label: "Enhanced", medianTokens: medianEnhanced.toFixed() },
    ];
  }; */

  /*   const calcDiffTokenUsage = useMemo(() => {
    const calcDiff = extractEnhancedUsage.map(
      (value: number, index: number) => value - extractBaseUsage[index]
    );
    return [...calcDiff].sort((a, b) => a - b);
  }, [extractBaseUsage, extractEnhancedUsage]); */

  /*  const calcFrequency = (data: number[]) => {
    const frequencyMap = new Map<number, number>();
    const sortData = data.sort((a, b) => a - b);

    for (const value of sortData) {
      frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
    }
    return Array.from(frequencyMap, ([diff, frequency]) => ({
      diff,
      frequency,
    }));
  }; */

  /*   const calcStdTokenUsage = () => {
    const stdBase = calculateStandardDeviation(extractBaseUsage);
    const stdEnhanced = calculateStandardDeviation(extractEnhancedUsage);
    return [
      { label: "Base", stdTokens: stdBase.toFixed() },
      { label: "Enhanced", stdTokens: stdEnhanced.toFixed() },
    ];
  }; */

  /*   console.log(calculateStandardDeviation(extractBaseUsage())); */
  console.log(calculateConfidenceInterval(extractEnhancedUsage, true));
  /*   console.log(calcDiffTokenUsage); */

  const chartData2 = calcAvgTokenUsage();
  /*   const chartDataDiff = calcFrequency(calcDiffTokenUsage); */
  /*  const tTest = performPairedTTest(extractBaseUsage, extractEnhancedUsage);
  console.log(tTest); */

  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-60">
        <BarChart accessibilityLayer data={chartData2}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent nameKey="tokens" />} />
          <Bar dataKey="avgTokens" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default TokenUsageChart;
