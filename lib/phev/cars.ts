export type PhevCar = {
  id: string;
  modelYear: number;
  make: string;
  name: string;
  shortName: string;
  bodyStyle: "crossover" | "suv";
  seats: number;
  electricRangeMi: number;
  rangeBasis: "EPA est.";
  accent: string;
  sourceUrl: string;
};

export const phevCars: PhevCar[] = [
  {
    id: "escape-phev",
    modelYear: 2026,
    make: "Ford",
    name: "Ford Escape Plug-In Hybrid",
    shortName: "Escape PHEV",
    bodyStyle: "crossover",
    seats: 5,
    electricRangeMi: 37,
    rangeBasis: "EPA est.",
    accent: "#fbbf24",
    sourceUrl: "https://www.ford.com/suvs-crossovers/escape/",
  },
  {
    id: "gle-450e",
    modelYear: 2026,
    make: "Mercedes-Benz",
    name: "Mercedes-Benz GLE 450e 4MATIC",
    shortName: "GLE 450e",
    bodyStyle: "suv",
    seats: 5,
    electricRangeMi: 49,
    rangeBasis: "EPA est.",
    accent: "#a5b4fc",
    sourceUrl: "https://www.mbusa.com/en/vehicles/model/gle/suv/gle450e4",
  },
  {
    id: "x5-xdrive50e",
    modelYear: 2026,
    make: "BMW",
    name: "BMW X5 xDrive50e",
    shortName: "X5 xDrive50e",
    bodyStyle: "suv",
    seats: 5,
    electricRangeMi: 38,
    rangeBasis: "EPA est.",
    accent: "#60a5fa",
    sourceUrl: "https://www.bmwusa.com/vehicles/plug-in-hybrid-electric.html",
  },
  {
    id: "xc60-phev",
    modelYear: 2026,
    make: "Volvo",
    name: "Volvo XC60 Plug-In Hybrid",
    shortName: "XC60 PHEV",
    bodyStyle: "suv",
    seats: 5,
    electricRangeMi: 35,
    rangeBasis: "EPA est.",
    accent: "#7dd3fc",
    sourceUrl: "https://www.volvocars.com/us/cars/xc60-hybrid/",
  },
  {
    id: "sportage-phev",
    modelYear: 2026,
    make: "Kia",
    name: "Kia Sportage Plug-In Hybrid",
    shortName: "Sportage PHEV",
    bodyStyle: "crossover",
    seats: 5,
    electricRangeMi: 34,
    rangeBasis: "EPA est.",
    accent: "#c4b5fd",
    sourceUrl: "https://www.kia.com/us/en/sportage-plug-in-hybrid",
  },
  {
    id: "tucson-phev",
    modelYear: 2025,
    make: "Hyundai",
    name: "Hyundai Tucson Plug-In Hybrid",
    shortName: "Tucson PHEV",
    bodyStyle: "crossover",
    seats: 5,
    electricRangeMi: 32,
    rangeBasis: "EPA est.",
    accent: "#7dd3fc",
    sourceUrl: "https://www.hyundaiusa.com/us/en/vehicles/2025-tucson-plug-in-hybrid",
  },
];

export const DEFAULT_PHEV = phevCars[0];
