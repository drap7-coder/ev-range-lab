import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { brandLogos, getBrandLogo } from "../lib/ev/brands.ts";
import { cars } from "../lib/ev/cars.ts";

test("every catalog make has a mapped manufacturer logo file", () => {
  const makes = [...new Set(cars.map((car) => car.make))];
  assert.equal(makes.length, Object.keys(brandLogos).length);

  for (const make of makes) {
    const logo = getBrandLogo(make);
    assert.equal(logo.slug, brandLogos[make].slug);
    assert.match(logo.shape, /^(emblem|wordmark)$/);
    assert.ok(
      existsSync(new URL(`../public/brands/${logo.slug}.svg`, import.meta.url)),
      `missing public/brands/${logo.slug}.svg for ${make}`,
    );
  }
});

test("Mercedes-Benz maps to the hyphenated asset slug", () => {
  assert.equal(getBrandLogo("Mercedes-Benz").slug, "mercedes-benz");
});
