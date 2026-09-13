export type EvCar = {
  id: string;
  make: string;
  name: string;
  shortName: string;
  bodyStyle: "sedan" | "crossover" | "suv" | "truck";
  usableBatteryKwh: number;
  baselineWhPerMi: number;
  referenceRangeMi: number;
  accent: string;
};

export const cars: EvCar[] = [
  { id: "model-3-lr", make: "Tesla", name: "Tesla Model 3 Long Range", shortName: "Model 3 LR", bodyStyle: "sedan", usableBatteryKwh: 75, baselineWhPerMi: 245, referenceRangeMi: 305, accent: "#bdff59" },
  { id: "model-s", make: "Tesla", name: "Tesla Model S Long Range", shortName: "Model S", bodyStyle: "sedan", usableBatteryKwh: 100, baselineWhPerMi: 244, referenceRangeMi: 410, accent: "#bdff59" },
  { id: "model-y", make: "Tesla", name: "Tesla Model Y Long Range AWD", shortName: "Model Y", bodyStyle: "crossover", usableBatteryKwh: 75, baselineWhPerMi: 229, referenceRangeMi: 327, accent: "#bdff59" },
  { id: "model-x", make: "Tesla", name: "Tesla Model X AWD", shortName: "Model X", bodyStyle: "suv", usableBatteryKwh: 100, baselineWhPerMi: 284, referenceRangeMi: 352, accent: "#bdff59" },
  { id: "cybertruck", make: "Tesla", name: "Tesla Cybertruck AWD", shortName: "Cybertruck", bodyStyle: "truck", usableBatteryKwh: 120, baselineWhPerMi: 369, referenceRangeMi: 325, accent: "#bdff59" },
  { id: "hummer-pickup", make: "GMC", name: "GMC HUMMER EV Pickup 3X", shortName: "HUMMER Pickup", bodyStyle: "truck", usableBatteryKwh: 212, baselineWhPerMi: 679, referenceRangeMi: 312, accent: "#f59e0b" },
  { id: "hummer-suv", make: "GMC", name: "GMC HUMMER EV SUV 3X", shortName: "HUMMER SUV", bodyStyle: "suv", usableBatteryKwh: 170, baselineWhPerMi: 540, referenceRangeMi: 315, accent: "#f59e0b" },
  { id: "volvo-ex30", make: "Volvo", name: "Volvo EX30 Single Motor", shortName: "Volvo EX30", bodyStyle: "crossover", usableBatteryKwh: 65, baselineWhPerMi: 249, referenceRangeMi: 261, accent: "#7dd3fc" },
  { id: "volvo-ex40", make: "Volvo", name: "Volvo EX40 Single Motor Extended Range", shortName: "Volvo EX40", bodyStyle: "crossover", usableBatteryKwh: 79, baselineWhPerMi: 267, referenceRangeMi: 296, accent: "#7dd3fc" },
  { id: "volvo-ex90", make: "Volvo", name: "Volvo EX90 Twin Motor", shortName: "Volvo EX90", bodyStyle: "suv", usableBatteryKwh: 107, baselineWhPerMi: 345, referenceRangeMi: 310, accent: "#7dd3fc" },
  { id: "lucid-air-pure", make: "Lucid", name: "Lucid Air Pure", shortName: "Air Pure", bodyStyle: "sedan", usableBatteryKwh: 84, baselineWhPerMi: 200, referenceRangeMi: 420, accent: "#d8b4fe" },
  { id: "lucid-air-gt", make: "Lucid", name: "Lucid Air Grand Touring", shortName: "Air Grand Touring", bodyStyle: "sedan", usableBatteryKwh: 118, baselineWhPerMi: 230, referenceRangeMi: 512, accent: "#d8b4fe" },
  { id: "lucid-gravity", make: "Lucid", name: "Lucid Gravity Grand Touring", shortName: "Lucid Gravity", bodyStyle: "suv", usableBatteryKwh: 123, baselineWhPerMi: 273, referenceRangeMi: 450, accent: "#d8b4fe" },
  { id: "ioniq-5", make: "Hyundai", name: "Hyundai IONIQ 5 AWD", shortName: "IONIQ 5", bodyStyle: "crossover", usableBatteryKwh: 74, baselineWhPerMi: 285, referenceRangeMi: 260, accent: "#7dd3fc" },
  { id: "ioniq-6", make: "Hyundai", name: "Hyundai IONIQ 6 SE RWD", shortName: "IONIQ 6", bodyStyle: "sedan", usableBatteryKwh: 74, baselineWhPerMi: 216, referenceRangeMi: 342, accent: "#7dd3fc" },
  { id: "mach-e", make: "Ford", name: "Ford Mustang Mach-E AWD", shortName: "Mach-E", bodyStyle: "crossover", usableBatteryKwh: 91, baselineWhPerMi: 310, referenceRangeMi: 293, accent: "#fbbf24" },
  { id: "f150-lightning", make: "Ford", name: "Ford F-150 Lightning Extended Range", shortName: "F-150 Lightning", bodyStyle: "truck", usableBatteryKwh: 123, baselineWhPerMi: 384, referenceRangeMi: 320, accent: "#fbbf24" },
  { id: "rivian-r1s", make: "Rivian", name: "Rivian R1S Dual Large", shortName: "Rivian R1S", bodyStyle: "suv", usableBatteryKwh: 131, baselineWhPerMi: 375, referenceRangeMi: 349, accent: "#fb923c" },
  { id: "ev9", make: "Kia", name: "Kia EV9 Long Range", shortName: "Kia EV9", bodyStyle: "suv", usableBatteryKwh: 96, baselineWhPerMi: 345, referenceRangeMi: 278, accent: "#c4b5fd" },
  { id: "ev6", make: "Kia", name: "Kia EV6 Long Range RWD", shortName: "Kia EV6", bodyStyle: "crossover", usableBatteryKwh: 81, baselineWhPerMi: 254, referenceRangeMi: 319, accent: "#c4b5fd" },
  { id: "id4", make: "Volkswagen", name: "Volkswagen ID.4 Pro", shortName: "VW ID.4", bodyStyle: "crossover", usableBatteryKwh: 77, baselineWhPerMi: 295, referenceRangeMi: 261, accent: "#93c5fd" },
  { id: "equinox", make: "Chevrolet", name: "Chevrolet Equinox EV", shortName: "Equinox EV", bodyStyle: "crossover", usableBatteryKwh: 85, baselineWhPerMi: 270, referenceRangeMi: 315, accent: "#6ee7b7" },
  { id: "lyriq", make: "Cadillac", name: "Cadillac LYRIQ AWD", shortName: "Cadillac LYRIQ", bodyStyle: "suv", usableBatteryKwh: 102, baselineWhPerMi: 337, referenceRangeMi: 303, accent: "#f0abfc" },
  { id: "bmw-ix", make: "BMW", name: "BMW iX xDrive60", shortName: "BMW iX", bodyStyle: "suv", usableBatteryKwh: 109, baselineWhPerMi: 299, referenceRangeMi: 364, accent: "#60a5fa" },
  { id: "audi-q6", make: "Audi", name: "Audi Q6 e-tron quattro", shortName: "Audi Q6 e-tron", bodyStyle: "suv", usableBatteryKwh: 95, baselineWhPerMi: 309, referenceRangeMi: 307, accent: "#fb7185" },
  { id: "eqs-suv", make: "Mercedes-Benz", name: "Mercedes-Benz EQS 450+ SUV", shortName: "EQS SUV", bodyStyle: "suv", usableBatteryKwh: 118, baselineWhPerMi: 365, referenceRangeMi: 323, accent: "#a5b4fc" },
  { id: "taycan-4s", make: "Porsche", name: "Porsche Taycan 4S", shortName: "Taycan 4S", bodyStyle: "sedan", usableBatteryKwh: 97, baselineWhPerMi: 305, referenceRangeMi: 318, accent: "#fda4af" },
  { id: "leaf", make: "Nissan", name: "Nissan LEAF SV Plus", shortName: "Nissan LEAF", bodyStyle: "crossover", usableBatteryKwh: 60, baselineWhPerMi: 282, referenceRangeMi: 213, accent: "#f9a8d4" },
];

export const DEFAULT_CAR = cars[0];
