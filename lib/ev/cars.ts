export type EvCar = {
  id: string;
  name: string;
  shortName: string;
  usableBatteryKwh: number;
  baselineWhPerMi: number;
  referenceRangeMi: number;
  accent: string;
};

export const cars: EvCar[] = [
  { id: "model-3-lr", name: "Tesla Model 3 Long Range", shortName: "Model 3 LR", usableBatteryKwh: 75, baselineWhPerMi: 245, referenceRangeMi: 305, accent: "#bdff59" },
  { id: "ioniq-5", name: "Hyundai IONIQ 5 AWD", shortName: "IONIQ 5", usableBatteryKwh: 74, baselineWhPerMi: 285, referenceRangeMi: 260, accent: "#7dd3fc" },
  { id: "mach-e", name: "Ford Mustang Mach-E AWD", shortName: "Mach-E", usableBatteryKwh: 91, baselineWhPerMi: 310, referenceRangeMi: 293, accent: "#fbbf24" },
  { id: "rivian-r1s", name: "Rivian R1S Dual Large", shortName: "Rivian R1S", usableBatteryKwh: 131, baselineWhPerMi: 375, referenceRangeMi: 349, accent: "#fb923c" },
  { id: "ev9", name: "Kia EV9 Long Range", shortName: "Kia EV9", usableBatteryKwh: 96, baselineWhPerMi: 345, referenceRangeMi: 278, accent: "#c4b5fd" },
  { id: "id4", name: "Volkswagen ID.4 Pro", shortName: "VW ID.4", usableBatteryKwh: 77, baselineWhPerMi: 295, referenceRangeMi: 261, accent: "#93c5fd" },
  { id: "equinox", name: "Chevrolet Equinox EV", shortName: "Equinox EV", usableBatteryKwh: 85, baselineWhPerMi: 270, referenceRangeMi: 315, accent: "#6ee7b7" },
  { id: "leaf", name: "Nissan LEAF SV Plus", shortName: "Nissan LEAF", usableBatteryKwh: 60, baselineWhPerMi: 282, referenceRangeMi: 213, accent: "#f9a8d4" },
];

export const DEFAULT_CAR = cars[0];
