import type { Climate, Hills, TripInputs } from "./model";

export type RoutePresetId = "winter-commute" | "summer-road-trip" | "city-errands";
export type GeoPresetId = "flat-highway" | "mountain-pass" | "coastal-drive";

export type RoutePreset = {
  id: RoutePresetId;
  label: string;
  hint: string;
  patch: Partial<TripInputs>;
};

export type GeoPreset = {
  id: GeoPresetId;
  label: string;
  hint: string;
  elevationGainFt: number;
  hills: Hills;
};

/** Multi-variable condition shortcuts — one tap sets a coherent drive story. */
export const routePresets: RoutePreset[] = [
  {
    id: "winter-commute",
    label: "Winter commute",
    hint: "Cold battery, full heat, freeway speeds",
    patch: {
      distanceMi: 52,
      startBatteryPct: 80,
      averageSpeedMph: 68,
      temperatureF: 15,
      hills: "rolling",
      climate: "max",
      loadLb: 200,
      elevationGainFt: 200,
    },
  },
  {
    id: "summer-road-trip",
    label: "Summer road trip",
    hint: "A/C, luggage, and 75 mph highway driving",
    patch: {
      distanceMi: 220,
      startBatteryPct: 100,
      averageSpeedMph: 75,
      temperatureF: 92,
      hills: "rolling",
      climate: "normal",
      loadLb: 700,
      elevationGainFt: 400,
    },
  },
  {
    id: "city-errands",
    label: "City errands",
    hint: "Stop-and-go driving helps regeneration",
    patch: {
      distanceMi: 24,
      averageSpeedMph: 32,
      temperatureF: 62,
      hills: "flat",
      climate: "normal",
      loadLb: 150,
      elevationGainFt: 0,
    },
  },
];

/** Recognizable elevation stories near the terrain control. */
export const geoPresets: GeoPreset[] = [
  {
    id: "flat-highway",
    label: "Flat Highway Run",
    hint: "0 ft net",
    elevationGainFt: 0,
    hills: "flat",
  },
  {
    id: "mountain-pass",
    label: "Mountain Pass",
    hint: "+3,000 ft net",
    elevationGainFt: 3000,
    hills: "steep",
  },
  {
    id: "coastal-drive",
    label: "Coastal Drive",
    hint: "+400 ft, gentle",
    elevationGainFt: 400,
    hills: "rolling",
  },
];

export function applyRoutePreset(current: TripInputs, presetId: RoutePresetId): TripInputs {
  const preset = routePresets.find((item) => item.id === presetId);
  if (!preset) return current;
  return { ...current, ...preset.patch };
}

export function applyGeoPreset(current: TripInputs, presetId: GeoPresetId): TripInputs {
  const preset = geoPresets.find((item) => item.id === presetId);
  if (!preset) return current;
  return {
    ...current,
    elevationGainFt: preset.elevationGainFt,
    hills: preset.hills,
  };
}

export function matchRoutePreset(inputs: TripInputs): RoutePresetId | null {
  for (const preset of routePresets) {
    const p = preset.patch;
    if (
      inputs.distanceMi === p.distanceMi &&
      inputs.averageSpeedMph === p.averageSpeedMph &&
      inputs.temperatureF === p.temperatureF &&
      inputs.hills === (p.hills as Hills) &&
      inputs.climate === (p.climate as Climate) &&
      inputs.loadLb === p.loadLb &&
      inputs.elevationGainFt === p.elevationGainFt
    ) {
      return preset.id;
    }
  }
  return null;
}

export function matchGeoPreset(inputs: TripInputs): GeoPresetId | null {
  for (const preset of geoPresets) {
    if (inputs.elevationGainFt === preset.elevationGainFt && inputs.hills === preset.hills) {
      return preset.id;
    }
  }
  return null;
}
