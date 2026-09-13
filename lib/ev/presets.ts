import type { Climate, Hills, TripInputs } from "./model";

export type RoutePresetId = "city-errands" | "daily-commute" | "road-trip";
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
    id: "city-errands",
    label: "City errands",
    hint: "Short hops, stop-and-go",
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
  {
    id: "daily-commute",
    label: "Daily commute",
    hint: "Mixed arterial + freeway",
    patch: {
      distanceMi: 52,
      averageSpeedMph: 52,
      temperatureF: 55,
      hills: "rolling",
      climate: "normal",
      loadLb: 200,
      elevationGainFt: 200,
    },
  },
  {
    id: "road-trip",
    label: "Road trip",
    hint: "Highway stretch",
    patch: {
      distanceMi: 180,
      averageSpeedMph: 70,
      temperatureF: 45,
      hills: "rolling",
      climate: "normal",
      loadLb: 350,
      elevationGainFt: 400,
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
