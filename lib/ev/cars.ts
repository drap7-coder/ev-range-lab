export type EvCar = {
  id: string;
  modelYear: number;
  make: string;
  name: string;
  shortName: string;
  bodyStyle: "sedan" | "crossover" | "suv" | "truck";
  usableBatteryKwh: number;
  baselineWhPerMi: number;
  statedRangeMi: number;
  rangeBasis: "EPA est." | "Brand est." | "GM est.";
  accent: string;
};

export const cars: EvCar[] = [
  { id: "model-3-lr", modelYear: 2025, make: "Tesla", name: "Tesla Model 3 Long Range", shortName: "Model 3 LR", bodyStyle: "sedan", usableBatteryKwh: 75, baselineWhPerMi: 245, statedRangeMi: 305, rangeBasis: "EPA est.", accent: "#bdff59" },
  { id: "model-s", modelYear: 2025, make: "Tesla", name: "Tesla Model S Long Range", shortName: "Model S", bodyStyle: "sedan", usableBatteryKwh: 100, baselineWhPerMi: 244, statedRangeMi: 410, rangeBasis: "EPA est.", accent: "#bdff59" },
  { id: "model-y", modelYear: 2025, make: "Tesla", name: "Tesla Model Y Long Range AWD", shortName: "Model Y", bodyStyle: "crossover", usableBatteryKwh: 75, baselineWhPerMi: 229, statedRangeMi: 327, rangeBasis: "EPA est.", accent: "#bdff59" },
  { id: "model-x", modelYear: 2025, make: "Tesla", name: "Tesla Model X AWD", shortName: "Model X", bodyStyle: "suv", usableBatteryKwh: 100, baselineWhPerMi: 284, statedRangeMi: 352, rangeBasis: "EPA est.", accent: "#bdff59" },
  { id: "cybertruck", modelYear: 2025, make: "Tesla", name: "Tesla Cybertruck AWD", shortName: "Cybertruck", bodyStyle: "truck", usableBatteryKwh: 120, baselineWhPerMi: 369, statedRangeMi: 325, rangeBasis: "EPA est.", accent: "#bdff59" },
  { id: "hummer-pickup", modelYear: 2025, make: "GMC", name: "GMC HUMMER EV Pickup 3X", shortName: "HUMMER Pickup", bodyStyle: "truck", usableBatteryKwh: 212, baselineWhPerMi: 624, statedRangeMi: 340, rangeBasis: "GM est.", accent: "#f59e0b" },
  { id: "hummer-suv", modelYear: 2025, make: "GMC", name: "GMC HUMMER EV SUV 3X", shortName: "HUMMER SUV", bodyStyle: "suv", usableBatteryKwh: 170, baselineWhPerMi: 540, statedRangeMi: 315, rangeBasis: "GM est.", accent: "#f59e0b" },
  { id: "volvo-ex30", modelYear: 2025, make: "Volvo", name: "Volvo EX30 Single Motor", shortName: "Volvo EX30", bodyStyle: "crossover", usableBatteryKwh: 65, baselineWhPerMi: 249, statedRangeMi: 261, rangeBasis: "EPA est.", accent: "#7dd3fc" },
  { id: "volvo-ex40", modelYear: 2025, make: "Volvo", name: "Volvo EX40 Single Motor Extended Range", shortName: "Volvo EX40", bodyStyle: "crossover", usableBatteryKwh: 79, baselineWhPerMi: 267, statedRangeMi: 296, rangeBasis: "EPA est.", accent: "#7dd3fc" },
  { id: "volvo-ex90", modelYear: 2025, make: "Volvo", name: "Volvo EX90 Twin Motor", shortName: "Volvo EX90", bodyStyle: "suv", usableBatteryKwh: 107, baselineWhPerMi: 345, statedRangeMi: 310, rangeBasis: "EPA est.", accent: "#7dd3fc" },
  { id: "lucid-air-pure", modelYear: 2025, make: "Lucid", name: "Lucid Air Pure", shortName: "Air Pure", bodyStyle: "sedan", usableBatteryKwh: 84, baselineWhPerMi: 200, statedRangeMi: 420, rangeBasis: "EPA est.", accent: "#d8b4fe" },
  { id: "lucid-air-gt", modelYear: 2025, make: "Lucid", name: "Lucid Air Grand Touring", shortName: "Air Grand Touring", bodyStyle: "sedan", usableBatteryKwh: 118, baselineWhPerMi: 230, statedRangeMi: 512, rangeBasis: "EPA est.", accent: "#d8b4fe" },
  { id: "lucid-gravity", modelYear: 2026, make: "Lucid", name: "Lucid Gravity Grand Touring", shortName: "Lucid Gravity", bodyStyle: "suv", usableBatteryKwh: 123, baselineWhPerMi: 273, statedRangeMi: 450, rangeBasis: "EPA est.", accent: "#d8b4fe" },
  { id: "ioniq-5", modelYear: 2025, make: "Hyundai", name: "Hyundai IONIQ 5 AWD", shortName: "IONIQ 5", bodyStyle: "crossover", usableBatteryKwh: 74, baselineWhPerMi: 285, statedRangeMi: 260, rangeBasis: "EPA est.", accent: "#7dd3fc" },
  { id: "ioniq-6", modelYear: 2025, make: "Hyundai", name: "Hyundai IONIQ 6 SE RWD", shortName: "IONIQ 6", bodyStyle: "sedan", usableBatteryKwh: 74, baselineWhPerMi: 216, statedRangeMi: 342, rangeBasis: "EPA est.", accent: "#7dd3fc" },
  { id: "mach-e", modelYear: 2025, make: "Ford", name: "Ford Mustang Mach-E AWD", shortName: "Mach-E", bodyStyle: "crossover", usableBatteryKwh: 91, baselineWhPerMi: 310, statedRangeMi: 293, rangeBasis: "EPA est.", accent: "#fbbf24" },
  { id: "f150-lightning", modelYear: 2025, make: "Ford", name: "Ford F-150 Lightning Extended Range", shortName: "F-150 Lightning", bodyStyle: "truck", usableBatteryKwh: 123, baselineWhPerMi: 384, statedRangeMi: 320, rangeBasis: "EPA est.", accent: "#fbbf24" },
  { id: "rivian-r1s", modelYear: 2025, make: "Rivian", name: "Rivian R1S Dual Large", shortName: "Rivian R1S", bodyStyle: "suv", usableBatteryKwh: 131, baselineWhPerMi: 375, statedRangeMi: 349, rangeBasis: "EPA est.", accent: "#fb923c" },
  { id: "ev9", modelYear: 2025, make: "Kia", name: "Kia EV9 Long Range", shortName: "Kia EV9", bodyStyle: "suv", usableBatteryKwh: 96, baselineWhPerMi: 345, statedRangeMi: 278, rangeBasis: "EPA est.", accent: "#c4b5fd" },
  { id: "ev6", modelYear: 2025, make: "Kia", name: "Kia EV6 Long Range RWD", shortName: "Kia EV6", bodyStyle: "crossover", usableBatteryKwh: 81, baselineWhPerMi: 254, statedRangeMi: 319, rangeBasis: "EPA est.", accent: "#c4b5fd" },
  { id: "id4", modelYear: 2025, make: "Volkswagen", name: "Volkswagen ID.4 Pro", shortName: "VW ID.4", bodyStyle: "crossover", usableBatteryKwh: 77, baselineWhPerMi: 295, statedRangeMi: 261, rangeBasis: "EPA est.", accent: "#93c5fd" },
  { id: "equinox", modelYear: 2025, make: "Chevrolet", name: "Chevrolet Equinox EV", shortName: "Equinox EV", bodyStyle: "crossover", usableBatteryKwh: 85, baselineWhPerMi: 270, statedRangeMi: 315, rangeBasis: "EPA est.", accent: "#6ee7b7" },
  { id: "lyriq", modelYear: 2025, make: "Cadillac", name: "Cadillac LYRIQ AWD", shortName: "Cadillac LYRIQ", bodyStyle: "suv", usableBatteryKwh: 102, baselineWhPerMi: 337, statedRangeMi: 303, rangeBasis: "EPA est.", accent: "#f0abfc" },
  { id: "bmw-ix", modelYear: 2026, make: "BMW", name: "BMW iX xDrive60", shortName: "BMW iX", bodyStyle: "suv", usableBatteryKwh: 109, baselineWhPerMi: 299, statedRangeMi: 364, rangeBasis: "EPA est.", accent: "#60a5fa" },
  { id: "audi-q6", modelYear: 2025, make: "Audi", name: "Audi Q6 e-tron quattro", shortName: "Audi Q6 e-tron", bodyStyle: "suv", usableBatteryKwh: 95, baselineWhPerMi: 309, statedRangeMi: 307, rangeBasis: "EPA est.", accent: "#fb7185" },
  { id: "eqs-suv", modelYear: 2025, make: "Mercedes-Benz", name: "Mercedes-Benz EQS 450+ SUV", shortName: "EQS SUV", bodyStyle: "suv", usableBatteryKwh: 118, baselineWhPerMi: 365, statedRangeMi: 323, rangeBasis: "EPA est.", accent: "#a5b4fc" },
  { id: "taycan-4s", modelYear: 2025, make: "Porsche", name: "Porsche Taycan 4S", shortName: "Taycan 4S", bodyStyle: "sedan", usableBatteryKwh: 97, baselineWhPerMi: 305, statedRangeMi: 318, rangeBasis: "EPA est.", accent: "#fda4af" },
  { id: "leaf", modelYear: 2025, make: "Nissan", name: "Nissan LEAF SV Plus", shortName: "Nissan LEAF", bodyStyle: "crossover", usableBatteryKwh: 60, baselineWhPerMi: 282, statedRangeMi: 213, rangeBasis: "EPA est.", accent: "#f9a8d4" },
];

export const DEFAULT_CAR = cars[0];

export type EvShopSpec = {
  startingPriceUsd: number;
  seats: number;
  dcFastChargeKw: number;
};

const shopSpecs: Record<string, EvShopSpec> = {
  "model-3-lr": { startingPriceUsd: 47500, seats: 5, dcFastChargeKw: 250 },
  "model-s": { startingPriceUsd: 85000, seats: 5, dcFastChargeKw: 250 },
  "model-y": { startingPriceUsd: 49000, seats: 5, dcFastChargeKw: 250 },
  "model-x": { startingPriceUsd: 90000, seats: 7, dcFastChargeKw: 250 },
  cybertruck: { startingPriceUsd: 80000, seats: 5, dcFastChargeKw: 325 },
  "hummer-pickup": { startingPriceUsd: 98000, seats: 5, dcFastChargeKw: 300 },
  "hummer-suv": { startingPriceUsd: 96000, seats: 5, dcFastChargeKw: 300 },
  "volvo-ex30": { startingPriceUsd: 39000, seats: 5, dcFastChargeKw: 175 },
  "volvo-ex40": { startingPriceUsd: 53000, seats: 5, dcFastChargeKw: 205 },
  "volvo-ex90": { startingPriceUsd: 80000, seats: 7, dcFastChargeKw: 250 },
  "lucid-air-pure": { startingPriceUsd: 70000, seats: 5, dcFastChargeKw: 250 },
  "lucid-air-gt": { startingPriceUsd: 111000, seats: 5, dcFastChargeKw: 300 },
  "lucid-gravity": { startingPriceUsd: 95000, seats: 7, dcFastChargeKw: 400 },
  "ioniq-5": { startingPriceUsd: 52000, seats: 5, dcFastChargeKw: 235 },
  "ioniq-6": { startingPriceUsd: 43000, seats: 5, dcFastChargeKw: 235 },
  "mach-e": { startingPriceUsd: 51000, seats: 5, dcFastChargeKw: 150 },
  "f150-lightning": { startingPriceUsd: 70000, seats: 5, dcFastChargeKw: 180 },
  "rivian-r1s": { startingPriceUsd: 76000, seats: 7, dcFastChargeKw: 220 },
  ev9: { startingPriceUsd: 59000, seats: 7, dcFastChargeKw: 210 },
  ev6: { startingPriceUsd: 46000, seats: 5, dcFastChargeKw: 235 },
  id4: { startingPriceUsd: 45000, seats: 5, dcFastChargeKw: 175 },
  equinox: { startingPriceUsd: 44000, seats: 5, dcFastChargeKw: 150 },
  lyriq: { startingPriceUsd: 62000, seats: 5, dcFastChargeKw: 190 },
  "bmw-ix": { startingPriceUsd: 89000, seats: 5, dcFastChargeKw: 195 },
  "audi-q6": { startingPriceUsd: 66000, seats: 5, dcFastChargeKw: 270 },
  "eqs-suv": { startingPriceUsd: 105000, seats: 7, dcFastChargeKw: 200 },
  "taycan-4s": { startingPriceUsd: 119000, seats: 4, dcFastChargeKw: 320 },
  leaf: { startingPriceUsd: 37000, seats: 5, dcFastChargeKw: 100 },
};

export function getShopSpec(car: EvCar): EvShopSpec {
  return shopSpecs[car.id] ?? { startingPriceUsd: 60000, seats: 5, dcFastChargeKw: 150 };
}
