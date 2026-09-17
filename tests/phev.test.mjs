import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PHEV, phevCars } from "../lib/phev/cars.ts";
import { estimatePhevLifestyle } from "../lib/phev/model.ts";

test("PHEV catalog has model years, sources, and stated electric ranges", () => {
  assert.ok(phevCars.length >= 6);
  for (const car of phevCars) {
    assert.ok(car.modelYear >= 2025);
    assert.ok(car.electricRangeMi > 0);
    assert.equal(car.rangeBasis, "EPA est.");
    assert.match(car.sourceUrl, /^https:\/\//);
  }
});

test("routine miles within battery range stay electric", () => {
  const result = estimatePhevLifestyle(
    { ...DEFAULT_PHEV, electricRangeMi: 40 },
    { dailyMiles: 30, daysPerWeek: 5, longTripMiles: 200, longTripsPerMonth: 1 },
  );

  assert.equal(result.routineFitsElectric, true);
  assert.equal(result.dailyGasMiles, 0);
  assert.equal(result.monthlyMiles, 850);
  assert.equal(result.electricMiles, 690);
  assert.equal(result.gasBackedMiles, 160);
  assert.equal(result.electricSharePct, 81);
});

test("miles beyond stated electric range use gas backup", () => {
  const result = estimatePhevLifestyle(
    { ...DEFAULT_PHEV, electricRangeMi: 40 },
    { dailyMiles: 60, daysPerWeek: 5, longTripMiles: 0, longTripsPerMonth: 0 },
  );

  assert.equal(result.routineFitsElectric, false);
  assert.equal(result.dailyElectricMiles, 40);
  assert.equal(result.dailyGasMiles, 20);
  assert.equal(result.electricSharePct, 67);
});
