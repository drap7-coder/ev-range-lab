import type { EvCar } from "./cars";

export type Hills = "flat" | "rolling" | "steep";
export type Climate = "off" | "eco" | "normal" | "max";

export type TripInputs = {
  distanceMi: number;
  startBatteryPct: number;
  temperatureF: number;
  averageSpeedMph: number;
  hills: Hills;
  climate: Climate;
  loadLb: number;
};

export type TripEstimate = {
  whPerMi: number;
  energyUsedKwh: number;
  endBatteryPct: number;
  remainingRangeMi: number;
  tripPossible: boolean;
  factors: { label: string; multiplier: number }[];
};

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

export function estimateTrip(car: EvCar, inputs: TripInputs): TripEstimate {
  const temp = temperatureFactor(inputs.temperatureF);
  const speed = speedFactor(inputs.averageSpeedMph);
  const hills = hillFactors[inputs.hills];
  const climate = climateFactors[inputs.climate];
  const load = 1 + Math.min(Math.max(inputs.loadLb, 0), 1200) / 12000;
  const combined = temp * speed * hills * climate * load;
  const whPerMi = Math.round(car.baselineWhPerMi * combined / 5) * 5;
  const availableKwh = car.usableBatteryKwh * (inputs.startBatteryPct / 100);
  const energyUsedKwh = (whPerMi * inputs.distanceMi) / 1000;
  const remainingKwh = Math.max(0, availableKwh - energyUsedKwh);

  return {
    whPerMi,
    energyUsedKwh,
    endBatteryPct: Math.max(0, (remainingKwh / car.usableBatteryKwh) * 100),
    remainingRangeMi: (remainingKwh * 1000) / whPerMi,
    tripPossible: energyUsedKwh <= availableKwh,
    factors: [
      { label: "Temperature", multiplier: temp },
      { label: "Speed", multiplier: speed },
      { label: "Terrain", multiplier: hills },
      { label: "Climate", multiplier: climate },
      { label: "Load", multiplier: load },
    ],
  };
}

export function getPlainTip(inputs: TripInputs, estimate: TripEstimate) {
  if (!estimate.tripPossible) return "This trip needs a charging stop. Try starting with more charge or plan a quick stop on the way.";
  if (estimate.endBatteryPct < 15) return "You may arrive with a thin cushion. Slowing down a little can add useful breathing room.";
  if (inputs.temperatureF < 40) return "Cold weather makes the battery and cabin work harder. Preheat while plugged in when you can.";
  if (inputs.averageSpeedMph > 70) return "Highway speed is the biggest drag here. Even 5 mph slower can noticeably improve your cushion.";
  if (inputs.climate === "max") return "Maximum cabin heat or cooling adds load. Eco climate can preserve a few extra miles.";
  return "This trip has a comfortable buffer under the conditions you chose.";
}
