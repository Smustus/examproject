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
  diff: {
    label: "Diff",
    color: "#000000",
  },
} satisfies ChartConfig;

const Chart = ({ chartData }: { chartData: any }) => {
  const calcFrequency = (data: number[]) => {
    const frequencyMap = new Map<number, number>();
    const sortData = data.sort((a, b) => a - b);

    for (const value of sortData) {
      frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
    }
    return Array.from(frequencyMap, ([diff, frequency]) => ({
      diff,
      frequency,
    }));
  };
  const chartData2 = calcFrequency(chartData);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData2}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="diff"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          /* tickFormatter={(value) => value.slice(0, 3)} */
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent nameKey="diff" />} />
        <Bar dataKey="frequency" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default Chart;
