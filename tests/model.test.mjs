import assert from "node:assert/strict";
import test from "node:test";
import { cars, DEFAULT_CAR } from "../lib/ev/cars.ts";
import {
  elevationWhPerMi,
  estimateTrip,
  getArrivalStatus,
  getChargeRecommendation,
  getMoreEfficientCarId,
  getPlainTip,
  CLIMB_WH_PER_FT,
  REGEN_CAP_FRACTION,
  REGEN_EFFICIENCY,
} from "../lib/ev/model.ts";
import {
  applyGeoPreset,
  applyRoutePreset,
  matchGeoPreset,
  matchRoutePreset,
  routePresets,
} from "../lib/ev/presets.ts";

const baseInputs = {
  distanceMi: 100,
  startBatteryPct: 90,
  temperatureF: 65,
  averageSpeedMph: 65,
  hills: "flat",
  climate: "off",
  loadLb: 0,
  elevationGainFt: 0,
};

test("every catalog vehicle has a model year and a stated-range baseline", () => {
  assert.equal(cars.length, 28);
  for (const car of cars) {
    assert.ok(car.modelYear >= 2025, `${car.id} needs a current model year`);
    assert.ok(car.statedRangeMi > 0, `${car.id} needs a stated range`);
    assert.match(car.rangeBasis, /est\.$/);

    const modeledBaseline = (car.usableBatteryKwh * 1000) / car.baselineWhPerMi;
    assert.ok(
      Math.abs(modeledBaseline - car.statedRangeMi) <= 1.5,
      `${car.id} baseline should start from its stated range`,
    );
  }

  assert.equal(cars.find((car) => car.id === "hummer-pickup")?.statedRangeMi, 367);
  assert.equal(cars.find((car) => car.id === "rivian-r1s")?.statedRangeMi, 330);
});

test("SoC thresholds map to ready / low / insufficient", () => {
  assert.equal(getArrivalStatus(40), "ready");
  assert.equal(getArrivalStatus(15), "ready");
  assert.equal(getArrivalStatus(14.9), "low");
  assert.equal(getArrivalStatus(0.1), "low");
  assert.equal(getArrivalStatus(0), "insufficient");
  assert.equal(getArrivalStatus(-5), "insufficient");
});

test("estimateTrip flags insufficient range and clamps displayed SoC at zero", () => {
  const car = cars.find((item) => item.id === "leaf") ?? DEFAULT_CAR;
  const estimate = estimateTrip(car, {
    ...baseInputs,
    distanceMi: 400,
    startBatteryPct: 40,
    averageSpeedMph: 75,
  });
  assert.equal(estimate.tripPossible, false);
  assert.equal(estimate.endBatteryPct, 0);
  assert.equal(estimate.arrivalStatus, "insufficient");
  assert.match(getPlainTip(baseInputs, estimate), /won't make it|Fast Charge/i);
});

test("low buffer yields charge recommendation toward 20% target", () => {
  const car = DEFAULT_CAR;
  // Force a thin arrival cushion with a long highway stretch.
  const estimate = estimateTrip(car, {
    ...baseInputs,
    distanceMi: 220,
    startBatteryPct: 70,
    averageSpeedMph: 75,
    temperatureF: 30,
    climate: "max",
    hills: "steep",
  });
  assert.ok(estimate.endBatteryPct < 15, `expected low SoC, got ${estimate.endBatteryPct}`);
  assert.equal(estimate.arrivalStatus, estimate.endBatteryPct <= 0 ? "insufficient" : "low");
  const charge = getChargeRecommendation(car, estimate);
  assert.ok(charge);
  assert.ok(charge.kwhNeeded > 0);
  assert.ok(charge.minutes >= 1);
  assert.equal(charge.targetBufferPct, 20);
  const expectedKwh = ((20 - estimate.endBatteryPct) / 100) * car.usableBatteryKwh;
  assert.ok(Math.abs(charge.kwhNeeded - expectedKwh) < 0.05);
});

test("ready trips do not recommend a charge stop", () => {
  const estimate = estimateTrip(DEFAULT_CAR, baseInputs);
  assert.equal(estimate.arrivalStatus, "ready");
  assert.equal(getChargeRecommendation(DEFAULT_CAR, estimate), null);
});

test("elevation climb increases Wh/mi; downhill regen is capped", () => {
  const flat = elevationWhPerMi(0, 100, 250);
  const climb = elevationWhPerMi(3000, 100, 250);
  // Extreme short descent so uncapped regen would exceed the 12% Wh/mi ceiling.
  const descent = elevationWhPerMi(-5000, 2, 250);

  assert.equal(flat, 0);
  assert.ok(climb > 0);
  assert.ok(Math.abs(climb - (3000 * CLIMB_WH_PER_FT) / 100) < 1e-9);
  assert.ok(descent < 0);
  const uncapped = (5000 * CLIMB_WH_PER_FT * REGEN_EFFICIENCY) / 2;
  const cap = 250 * REGEN_CAP_FRACTION;
  assert.ok(uncapped > cap, "fixture should exceed regen cap");
  assert.equal(descent, -cap);
});

test("Mountain Pass estimate uses more Wh/mi than Flat Highway under identical other inputs", () => {
  const flat = estimateTrip(DEFAULT_CAR, { ...baseInputs, elevationGainFt: 0, hills: "flat" });
  const mountain = estimateTrip(DEFAULT_CAR, { ...baseInputs, elevationGainFt: 3000, hills: "steep" });
  assert.ok(mountain.whPerMi > flat.whPerMi);
  assert.ok(mountain.elevationWhPerMi > 0);
});

test("beginner scenarios apply coherent multi-variable conditions", () => {
  const road = routePresets.find((preset) => preset.id === "summer-road-trip");
  assert.ok(road);
  const next = applyRoutePreset(baseInputs, "summer-road-trip");
  assert.equal(next.distanceMi, 220);
  assert.equal(next.averageSpeedMph, 75);
  assert.equal(next.temperatureF, 92);
  assert.equal(next.hills, "rolling");
  assert.equal(matchRoutePreset(next), "summer-road-trip");

  const city = applyRoutePreset(baseInputs, "city-errands");
  assert.equal(city.distanceMi, 24);
  assert.equal(city.averageSpeedMph, 32);
  assert.equal(matchRoutePreset(city), "city-errands");
});

test("geo presets set elevation + terrain together", () => {
  const mountain = applyGeoPreset(baseInputs, "mountain-pass");
  assert.equal(mountain.elevationGainFt, 3000);
  assert.equal(mountain.hills, "steep");
  assert.equal(matchGeoPreset(mountain), "mountain-pass");

  const coastal = applyGeoPreset(baseInputs, "coastal-drive");
  assert.equal(coastal.elevationGainFt, 400);
  assert.equal(coastal.hills, "rolling");
});

test("comparison math badges the lower Wh/mi car and ties cleanly", () => {
  const a = estimateTrip(cars[0], baseInputs);
  const b = estimateTrip(cars[2], baseInputs);
  const winner = getMoreEfficientCarId(
    { carId: cars[0].id, whPerMi: a.whPerMi },
    { carId: cars[2].id, whPerMi: b.whPerMi },
  );
  assert.ok(winner === cars[0].id || winner === cars[2].id);
  assert.equal(
    winner,
    a.whPerMi < b.whPerMi ? cars[0].id : a.whPerMi > b.whPerMi ? cars[2].id : null,
  );
  assert.equal(
    getMoreEfficientCarId({ carId: "x", whPerMi: 300 }, { carId: "y", whPerMi: 300 }),
    null,
  );
});

test("shared compare inputs never diverge between vehicles", () => {
  const shared = applyRoutePreset(baseInputs, "summer-road-trip");
  const left = estimateTrip(cars[0], shared);
  const right = estimateTrip(cars[3], shared);
  assert.notEqual(left.whPerMi, right.whPerMi);
  // Same environment: elevation contribution sign/direction matches for both.
  assert.equal(Math.sign(left.elevationWhPerMi), Math.sign(right.elevationWhPerMi));
});
