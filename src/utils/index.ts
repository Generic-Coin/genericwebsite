// TODO: write tests for utils
type OptionalNumber = number | null;
export function clamp(value: number, min: OptionalNumber, max: OptionalNumber) {
  if (max !== null && value > max) {
    return max;
  }
  if (min !== null && value < min) {
    return min;
  }
  return value;
}

// helper functions below are from Material UI (https://github.com/mui-org/material-ui)
export function getDecimalPrecision(num: number) {
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const matissaDecimalPart = parts[0].split('.')[1];
    return (
      (matissaDecimalPart ? matissaDecimalPart.length : 0) +
      parseInt(parts[1], 10)
    );
  }

  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

export function roundValueToStep(value: number, step: number, min: number) {
  const nearest = Math.round((value - min) / step) * step + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

export function findClosest(values: number[], currentValue: number) {
  const { index: closestIndex } = values.reduce(
    (acc, value, index) => {
      const distance = Math.abs(currentValue - value);

      if (
        acc === null ||
        distance < acc.distance ||
        distance === acc.distance
      ) {
        return {
          distance,
          index,
        };
      }

      return acc;
    },
    {
      index: -1,
      distance: Infinity,
    },
  );
  return closestIndex;
}
