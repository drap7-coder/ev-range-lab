import type { PhevCar } from "./cars";

export type PhevLifestyleInputs = {
  dailyMiles: number;
  daysPerWeek: number;
  longTripMiles: number;
  longTripsPerMonth: number;
};

export type PhevLifestyleResult = {
  monthlyMiles: number;
  electricMiles: number;
  gasBackedMiles: number;
  electricSharePct: number;
  dailyElectricMiles: number;
  dailyGasMiles: number;
  routineFitsElectric: boolean;
};

const WEEKS_PER_MONTH = 52 / 12;

export function estimatePhevLifestyle(car: PhevCar, inputs: PhevLifestyleInputs): PhevLifestyleResult {
  const routineDaysPerMonth = inputs.daysPerWeek * WEEKS_PER_MONTH;
  const routineMiles = inputs.dailyMiles * routineDaysPerMonth;
  const routineElectricMiles = Math.min(inputs.dailyMiles, car.electricRangeMi) * routineDaysPerMonth;
  const longTripMiles = inputs.longTripMiles * inputs.longTripsPerMonth;
  const longTripElectricMiles = Math.min(inputs.longTripMiles, car.electricRangeMi) * inputs.longTripsPerMonth;
  const monthlyMiles = routineMiles + longTripMiles;
  const electricMiles = routineElectricMiles + longTripElectricMiles;
  const gasBackedMiles = Math.max(0, monthlyMiles - electricMiles);

  return {
    monthlyMiles: Math.round(monthlyMiles),
    electricMiles: Math.round(electricMiles),
    gasBackedMiles: Math.round(gasBackedMiles),
    electricSharePct: monthlyMiles > 0 ? Math.round((electricMiles / monthlyMiles) * 100) : 0,
    dailyElectricMiles: Math.min(inputs.dailyMiles, car.electricRangeMi),
    dailyGasMiles: Math.max(0, inputs.dailyMiles - car.electricRangeMi),
    routineFitsElectric: inputs.dailyMiles <= car.electricRangeMi,
  };
}
