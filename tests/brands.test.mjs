import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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

test("wordmark assets expose their cropped aspect ratio", () => {
  for (const [make, logo] of Object.entries(brandLogos)) {
    if (logo.shape !== "wordmark") continue;

    const svg = readFileSync(new URL(`../public/brands/${logo.slug}.svg`, import.meta.url), "utf8");
    const dimensions = svg.match(/<svg width="([\d.]+)" height="([\d.]+)" viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/);
    assert.ok(dimensions, `could not read dimensions for ${make}`);
    assert.equal(dimensions[1], dimensions[3], `${make} width should match its cropped viewBox`);
    assert.equal(dimensions[2], dimensions[4], `${make} height should match its cropped viewBox`);
  }
});
