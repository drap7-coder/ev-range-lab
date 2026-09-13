import type { EvCar } from "./cars";

export type Hills = "flat" | "rolling" | "steep";
export type Climate = "off" | "eco" | "normal" | "max";
export type ArrivalStatus = "ready" | "low" | "insufficient";

export type TripInputs = {
  distanceMi: number;
  startBatteryPct: number;
  temperatureF: number;
  averageSpeedMph: number;
  hills: Hills;
  climate: Climate;
  loadLb: number;
  /** Net elevation change over the trip in feet. Positive = climb. */
  elevationGainFt: number;
};

export type TripEstimate = {
  whPerMi: number;
  energyUsedKwh: number;
  endBatteryPct: number;
  remainingRangeMi: number;
  tripPossible: boolean;
  arrivalStatus: ArrivalStatus;
  elevationWhPerMi: number;
  factors: { label: string; multiplier: number }[];
};

export type ChargeRecommendation = {
  kwhNeeded: number;
  minutes: number;
  targetBufferPct: number;
};

/** Wh added per foot of climb (educational, rounded model). */
export const CLIMB_WH_PER_FT = 0.042;
/** Fraction of climb-equivalent energy recovered on descent. */
export const REGEN_EFFICIENCY = 0.55;
/** Downhill cannot improve Wh/mi by more than this fraction of the flat baseline. */
export const REGEN_CAP_FRACTION = 0.12;
export const LOW_BUFFER_PCT = 15;
export const TARGET_BUFFER_PCT = 20;
/** Assumed DC fast-charge rate for stop-time estimates (kW). */
export const FAST_CHARGE_KW = 150;

const hillFactors: Record<Hills, number> = { flat: 1, rolling: 1.06, steep: 1.14 };
const climateFactors: Record<Climate, number> = { off: 1, eco: 1.025, normal: 1.055, max: 1.1 };

function temperatureFactor(tempF: number) {
  if (tempF < 20) return 1.28;
  if (tempF < 40) return 1.16;
  if (tempF <= 75) return 1;
  if (tempF <= 90) return 1.05;
  return 1.1;
}

function speedFactor(speedMph: number) {
  if (speedMph <= 35) return 0.88;
  if (speedMph <= 55) return 0.96;
  if (speedMph <= 65) return 1;
  if (speedMph <= 75) return 1.12;
  return 1.28;
}

/**
 * Elevation contribution to Wh/mi.
 * Climbs add energy; descents recover a capped fraction via regen.
 */
export function elevationWhPerMi(elevationGainFt: number, distanceMi: number, flatWhPerMi: number): number {
  if (distanceMi <= 0) return 0;
  if (elevationGainFt >= 0) {
    return (elevationGainFt * CLIMB_WH_PER_FT) / distanceMi;
  }
  const potentialRecoveryWhPerMi = (Math.abs(elevationGainFt) * CLIMB_WH_PER_FT * REGEN_EFFICIENCY) / distanceMi;
  const cap = flatWhPerMi * REGEN_CAP_FRACTION;
  return -Math.min(potentialRecoveryWhPerMi, cap);
}

export function getArrivalStatus(endBatteryPct: number): ArrivalStatus {
  if (endBatteryPct <= 0) return "insufficient";
  if (endBatteryPct < LOW_BUFFER_PCT) return "low";
  return "ready";
}

export function getArrivalStatusLabel(status: ArrivalStatus): string {
  switch (status) {
    case "insufficient":
      return "🔴 Charging stop required";
    case "low":
      return "🟡 Quick 10-min pit stop recommended";
    default:
      return "🟢 Easy Drive — No stops needed";
  }
}

export function estimateTrip(car: EvCar, inputs: TripInputs): TripEstimate {
  const temp = temperatureFactor(inputs.temperatureF);
  const speed = speedFactor(inputs.averageSpeedMph);
  const hills = hillFactors[inputs.hills];
  const climate = climateFactors[inputs.climate];
  const load = 1 + Math.min(Math.max(inputs.loadLb, 0), 1200) / 12000;
  const combined = temp * speed * hills * climate * load;
  const flatWhPerMi = car.baselineWhPerMi * combined;
  const elevWh = elevationWhPerMi(inputs.elevationGainFt, inputs.distanceMi, flatWhPerMi);
  const whPerMi = Math.round((flatWhPerMi + elevWh) / 5) * 5;
  const availableKwh = car.usableBatteryKwh * (inputs.startBatteryPct / 100);
  const energyUsedKwh = (whPerMi * inputs.distanceMi) / 1000;
  const remainingKwh = availableKwh - energyUsedKwh;
  // Allow negative SoC for honest insufficient-range signaling before clamping display.
  const rawEndPct = (remainingKwh / car.usableBatteryKwh) * 100;
  const endBatteryPct = Math.max(0, rawEndPct);
  const clampedRemainingKwh = Math.max(0, remainingKwh);

  return {
    whPerMi,
    energyUsedKwh,
    endBatteryPct,
    remainingRangeMi: whPerMi > 0 ? (clampedRemainingKwh * 1000) / whPerMi : 0,
    tripPossible: energyUsedKwh <= availableKwh,
    arrivalStatus: getArrivalStatus(rawEndPct <= 0 ? 0 : endBatteryPct),
    elevationWhPerMi: Math.round(elevWh * 10) / 10,
    factors: [
      { label: "Temperature", multiplier: temp },
      { label: "Speed", multiplier: speed },
      { label: "Terrain", multiplier: hills },
      { label: "Climate", multiplier: climate },
      { label: "Load", multiplier: load },
      {
        label: "Elevation",
        multiplier: flatWhPerMi > 0 ? Math.round(((flatWhPerMi + elevWh) / flatWhPerMi) * 100) / 100 : 1,
      },
    ],
  };
}

/** kWh and ~minutes of DC fast charge to reach the target arrival buffer. */
export function getChargeRecommendation(car: EvCar, estimate: TripEstimate): ChargeRecommendation | null {
  if (estimate.endBatteryPct >= LOW_BUFFER_PCT) return null;
  const deficitPct = TARGET_BUFFER_PCT - estimate.endBatteryPct;
  const kwhNeeded = Math.max(0, (deficitPct / 100) * car.usableBatteryKwh);
  const minutes = Math.max(1, Math.round((kwhNeeded / FAST_CHARGE_KW) * 60));
  return { kwhNeeded, minutes, targetBufferPct: TARGET_BUFFER_PCT };
}

export function getPlainTip(inputs: TripInputs, estimate: TripEstimate, carName?: string) {
  if (estimate.arrivalStatus === "insufficient") {
    return carName
      ? `${carName} won't make it on this charge. Plan a Fast Charge stop—or shorten the trip—before you leave.`
      : "This trip won't make it on this charge. Plan a Fast Charge stop—or shorten the trip—before you leave.";
  }
  if (estimate.arrivalStatus === "low") {
    return `You'll arrive with a thin cushion. A short Fast Charge on the way keeps you above a comfortable ${TARGET_BUFFER_PCT}% buffer.`;
  }
  if (inputs.elevationGainFt >= 2000) {
    return "Big climbs spend energy you won't fully get back. Expect higher Wh/mi on the way up.";
  }
  if (inputs.elevationGainFt <= -1500) {
    return "Descending helps, but regen has a ceiling—don't count on downhill to erase a tight plan.";
  }
  if (inputs.temperatureF < 40) {
    return "Cold weather makes the battery and cabin work harder. Preheat while plugged in when you can.";
  }
  if (inputs.averageSpeedMph > 70) {
    return "Highway speed is the biggest drag here. Even 5 mph slower can noticeably improve your cushion.";
  }
  if (inputs.climate === "max") {
    return "Maximum cabin heat or cooling adds load. Eco climate can preserve a few extra miles.";
  }
  return "This trip has a comfortable buffer under the conditions you chose.";
}

/** Lower Wh/mi wins. Returns null when tied. */
export function getMoreEfficientCarId(
  a: { carId: string; whPerMi: number },
  b: { carId: string; whPerMi: number },
): string | null {
  if (a.whPerMi === b.whPerMi) return null;
  return a.whPerMi < b.whPerMi ? a.carId : b.carId;
}
