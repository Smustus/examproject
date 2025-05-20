/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ChartConfig, ChartContainer } from "./ui/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  tokens: {
    label: "Avg Token Usage",
    color: "#000000",
  },
} satisfies ChartConfig;

const TokenUsageChart = ({ chartData }: { chartData: any }) => {
  const calcAvgTokenUsage = () => {
    const baseTotal = chartData.reduce((acc: number, dataPoint: Comparison) => {
      return acc + dataPoint.base_prompt_usage.totalTokens;
    }, 0);
    const avgBase = baseTotal / chartData.length;

    const enhancedTotal = chartData.reduce(
      (acc: number, dataPoint: Comparison) => {
        return acc + dataPoint.enhanced_prompt_usage.totalTokens;
      },
      0
    );
    const avgEnhanced = enhancedTotal / chartData.length;
    return [
      { label: "Base", avgTokens: avgBase.toFixed() },
      { label: "Enhanced", avgTokens: avgEnhanced.toFixed() },
    ];
  };
  console.log(calcAvgTokenUsage());

  const chartData2 = calcAvgTokenUsage();

  return (
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
  );
};

export default TokenUsageChart;
