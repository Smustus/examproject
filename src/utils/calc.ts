type RankedItem = {
  diff: number;
  abs: number;
  index: number;
  rank?: number;
};

export function calculateMean(array: number[]) {
  const sum = array.reduce((acc, val) => acc + val, 0);
  return sum / array.length;
}
export function calculateStandardDeviation(array: number[]) {
  const mean = calculateMean(array);
  const squareDiffs = array.map((value) => Math.pow(value - mean, 2));
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}
export function calculateConfidenceInterval(array: number[]) {
  const mean = calculateMean(array);
  const standardDeviation = calculateStandardDeviation(array);
  const zScore = 1.96;
  const marginOfError = zScore * (standardDeviation / Math.sqrt(array.length));
  return {
    lowerBound: mean - marginOfError,
    upperBound: mean + marginOfError,
  };
}

export function performPairedTTest(before: number[], after: number[]) {
  if (before.length !== after.length || before.length < 2)
    throw new Error("Samples must be the same length and > 1");

  const differences = after.map((val, i) => val - before[i]);
  const meanDiff = calculateMean(differences);
  const stdDev = calculateStandardDeviation(differences);
  const t = meanDiff / (stdDev / Math.sqrt(differences.length));

  return {
    tStatistic: t,
    degreesOfFreedom: differences.length - 1,
    // Two-tailed approximation assuming normal distribution
    pValue: 2 * (1 - normalCDF(Math.abs(t))),
  };
}

export function performWilcoxonSignedRankTest(
  sample1: number[],
  sample2: number[]
) {
  if (sample1.length !== sample2.length || sample1.length < 5) {
    throw new Error("Samples must be equal length and have at least 5 items.");
  }

  const differences = sample1.map((val, i) => val - sample2[i]);

  // Exclude zero differences
  const filtered = differences
    .map((diff, i) => ({ diff, index: i }))
    .filter(({ diff }) => diff !== 0);

  if (filtered.length === 0) {
    return {
      W: 0,
      zStatistic: NaN,
      pValue: 1,
      isSignificant: false,
      message: "No non-zero differences",
    };
  }

  if (filtered.length < sample1.length / 2) {
    console.warn("Many zero differences. Results may be unreliable.");
  }

  // Sort by absolute difference and assign ranks (with tie handling)
  const ranked: RankedItem[] = filtered
    .map(({ diff, index }) => ({ diff, abs: Math.abs(diff), index }))
    .sort((a, b) => a.abs - b.abs);

  // Assign ranks, adjusting for ties
  let currentRank = 1;
  while (currentRank <= ranked.length) {
    const currentAbs = ranked[currentRank - 1].abs;
    const ties = ranked.filter((x) => x.abs === currentAbs);
    const avgRank = (currentRank + currentRank + ties.length - 1) / 2;

    for (let i = 0; i < ties.length; i++) {
      ranked[currentRank - 1 + i].rank = avgRank;
    }
    currentRank += ties.length;
  }

  // Calculate W+ and W-
  let Wpos = 0;
  let Wneg = 0;
  for (const item of ranked) {
    if (item.diff > 0) Wpos += item.rank!;
    else Wneg += item.rank!;
  }

  const W = Math.min(Wpos, Wneg); // Test statistic
  const n = ranked.length;

  // Normal approximation (with continuity correction)
  const meanW = (n * (n + 1)) / 4; //expected sum of ranks
  const stdW = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
  const z = (W - meanW + 0.5) / stdW; // +0.5 for continuity correction

  // Handle extreme z-values
  const pValue = Math.abs(z) > 6 ? 0 : 2 * (1 - normalCDF(Math.abs(z)));

  return {
    W,
    zStatistic: z,
    pValue,
    isSignificant: pValue < 0.05,
    message: n < 20 ? "Normal approximation may be inaccurate for n < 20." : "",
  };
}

// CDF for standard normal distribution (Z)
function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

// Error function approximation
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const sign = Math.sign(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;

  const t = 1 / (1 + p * Math.abs(x));
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
