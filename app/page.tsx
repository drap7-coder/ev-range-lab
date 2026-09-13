"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { cars, DEFAULT_CAR, type EvCar } from "@/lib/ev/cars";
import {
  estimateTrip,
  getArrivalStatusLabel,
  getChargeRecommendation,
  getMoreEfficientCarId,
  getPlainTip,
  type ArrivalStatus,
  type Climate,
  type Hills,
  type TripEstimate,
  type TripInputs,
} from "@/lib/ev/model";
import {
  applyGeoPreset,
  applyRoutePreset,
  geoPresets,
  matchGeoPreset,
  matchRoutePreset,
  routePresets,
  type GeoPresetId,
  type RoutePresetId,
} from "@/lib/ev/presets";

type ViewMode = "single" | "compare";

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-control">
      <span>
        <span>{label}</span>
        <strong>
          {value}
          {unit}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value}${unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function VehiclePicker({
  id,
  label,
  carId,
  onChange,
  specs,
}: {
  id: string;
  label: string;
  carId: string;
  onChange: (id: string) => void;
  specs: EvCar;
}) {
  return (
    <div className="vehicle-picker">
      <label className="select-label" htmlFor={id}>
        {label}
        <select id={id} value={carId} onChange={(event) => onChange(event.target.value)}>
          {cars.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="car-specs">
        <span>
          <small>Usable battery</small>
          <strong>{specs.usableBatteryKwh} kWh</strong>
        </span>
        <span>
          <small>Reference range</small>
          <strong>{specs.referenceRangeMi} mi</strong>
        </span>
      </div>
    </div>
  );
}

function OutlookCard({
  car,
  estimate,
  distance,
  tip,
  charge,
  moreEfficient,
  compact,
}: {
  car: EvCar;
  estimate: TripEstimate;
  distance: number;
  tip: string;
  charge: ReturnType<typeof getChargeRecommendation>;
  moreEfficient: boolean;
  compact?: boolean;
}) {
  const gauge = Math.min(100, Math.max(0, estimate.endBatteryPct));
  const status = estimate.arrivalStatus;

  return (
    <article
      className={`outlook-card${compact ? " compact" : ""}${moreEfficient ? " is-efficient" : ""}`}
      style={{ "--car-accent": car.accent } as CSSProperties}
      aria-label={`${car.shortName} trip outlook`}
    >
      <div className="result-top">
        <div className="outlook-identity">
          <span className="outlook-car">{car.shortName}</span>
          {moreEfficient ? <span className="efficient-badge">More efficient</span> : null}
        </div>
        <span className={`status ${statusClass(status)}`} role="status">
          {getArrivalStatusLabel(status)}
        </span>
      </div>

      <div
        className="battery-visual"
        aria-label={`Estimated arrival battery ${Math.round(estimate.endBatteryPct)} percent`}
      >
        <div className={`battery-fill tone-${status}`} style={{ height: `${gauge}%` }} />
        <div className="battery-copy">
          <small>ARRIVE WITH</small>
          <strong>
            {Math.round(estimate.endBatteryPct)}
            <sup>%</sup>
          </strong>
          <span>after {distance} miles</span>
        </div>
      </div>

      <div className="metrics">
        <div>
          <small>Range left</small>
          <strong>~{Math.round(estimate.remainingRangeMi)} mi</strong>
        </div>
        <div>
          <small>Energy use</small>
          <strong>{estimate.whPerMi} Wh/mi</strong>
        </div>
        <div>
          <small>Trip energy</small>
          <strong>{estimate.energyUsedKwh.toFixed(1)} kWh</strong>
        </div>
      </div>

      {charge ? (
        <div className="charge-tip" role="note">
          <span>Fast Charge</span>
          <p>
            Add ~{charge.kwhNeeded.toFixed(1)} kWh (~{charge.minutes} min) to arrive near a{" "}
            {charge.targetBufferPct}% buffer.
          </p>
        </div>
      ) : null}

      <div className={`tip-card tone-${status}`}>
        <span>GOOD TO KNOW</span>
        <p>{tip}</p>
      </div>
    </article>
  );
}

function statusClass(status: ArrivalStatus) {
  if (status === "insufficient") return "danger";
  if (status === "low") return "caution";
  return "good";
}

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [carId, setCarId] = useState(DEFAULT_CAR.id);
  const [carIdB, setCarIdB] = useState(cars[1]?.id ?? DEFAULT_CAR.id);
  const [distance, setDistance] = useState(120);
  const [battery, setBattery] = useState(90);
  const [temperature, setTemperature] = useState(55);
  const [speed, setSpeed] = useState(62);
  const [hills, setHills] = useState<Hills>("rolling");
  const [climate, setClimate] = useState<Climate>("normal");
  const [load, setLoad] = useState(250);
  const [elevationGainFt, setElevationGainFt] = useState(0);
  const [expert, setExpert] = useState(false);

  const car = cars.find((item) => item.id === carId) ?? DEFAULT_CAR;
  const carB = cars.find((item) => item.id === carIdB) ?? cars[1] ?? DEFAULT_CAR;

  const inputs: TripInputs = useMemo(
    () => ({
      distanceMi: distance,
      startBatteryPct: battery,
      temperatureF: temperature,
      averageSpeedMph: speed,
      hills,
      climate,
      loadLb: load,
      elevationGainFt,
    }),
    [distance, battery, temperature, speed, hills, climate, load, elevationGainFt],
  );

  const result = useMemo(() => estimateTrip(car, inputs), [car, inputs]);
  const resultB = useMemo(() => estimateTrip(carB, inputs), [carB, inputs]);
  const tip = getPlainTip(inputs, result, viewMode === "compare" ? car.shortName : undefined);
  const tipB = getPlainTip(inputs, resultB, carB.shortName);
  const charge = getChargeRecommendation(car, result);
  const chargeB = getChargeRecommendation(carB, resultB);
  const activeRoute = matchRoutePreset(inputs);
  const activeGeo = matchGeoPreset(inputs);

  const winnerId =
    viewMode === "compare"
      ? getMoreEfficientCarId({ carId: car.id, whPerMi: result.whPerMi }, { carId: carB.id, whPerMi: resultB.whPerMi })
      : null;

  function patchInputs(next: TripInputs) {
    setDistance(next.distanceMi);
    setBattery(next.startBatteryPct);
    setTemperature(next.temperatureF);
    setSpeed(next.averageSpeedMph);
    setHills(next.hills);
    setClimate(next.climate);
    setLoad(next.loadLb);
    setElevationGainFt(next.elevationGainFt);
  }

  function onRoutePreset(id: RoutePresetId) {
    patchInputs(applyRoutePreset(inputs, id));
  }

  function onGeoPreset(id: GeoPresetId) {
    patchInputs(applyGeoPreset(inputs, id));
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="EV Range Lab home">
          <span className="brand-mark">EV</span>
          <span>Range Lab</span>
        </a>
        <div className="header-controls">
          <div className="mode-toggle" role="group" aria-label="Vehicle view">
            <button
              type="button"
              className={viewMode === "single" ? "active" : ""}
              aria-pressed={viewMode === "single"}
              onClick={() => setViewMode("single")}
            >
              Single
            </button>
            <button
              type="button"
              className={viewMode === "compare" ? "active" : ""}
              aria-pressed={viewMode === "compare"}
              onClick={() => setViewMode("compare")}
            >
              Compare
            </button>
          </div>
          <div className="mode-toggle subtle" role="group" aria-label="Detail level">
            <button type="button" className={!expert ? "active" : ""} aria-pressed={!expert} onClick={() => setExpert(false)}>
              Learn
            </button>
            <button type="button" className={expert ? "active" : ""} aria-pressed={expert} onClick={() => setExpert(true)}>
              Expert
            </button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">Range without the guesswork</p>
          <h1>
            See how far your EV can <em>really</em> go.
          </h1>
          <p className="lede">
            Pick a car, shape the drive, and watch conditions change the outcome. Compare models, catch low-buffer trips early, and
            stress-test climbs before you leave.
          </p>
        </div>
        <div className="hero-note">
          <span>LIVE MODEL</span>
          <p>One shared set of conditions. Every estimate updates together.</p>
        </div>
      </section>

      <section className="lab-shell" aria-label="EV range calculator" data-mode={viewMode}>
        <div className="controls-panel">
          <div className="section-heading">
            <span>01</span>
            <div>
              <p>Choose your EV</p>
              <h2>{viewMode === "compare" ? "Compare models" : car.shortName}</h2>
            </div>
          </div>

          {viewMode === "single" ? (
            <VehiclePicker id="vehicle-a" label="Vehicle" carId={carId} onChange={setCarId} specs={car} />
          ) : (
            <div className="compare-pickers">
              <VehiclePicker id="vehicle-a" label="Vehicle A" carId={carId} onChange={setCarId} specs={car} />
              <VehiclePicker
                id="vehicle-b"
                label="Vehicle B"
                carId={carIdB}
                onChange={(id) => {
                  setCarIdB(id);
                }}
                specs={carB}
              />
            </div>
          )}

          <div className="section-heading compact">
            <span>02</span>
            <div>
              <p>Shape the trip</p>
              <h2>Conditions</h2>
            </div>
          </div>

          <div className="preset-block">
            <p className="preset-label">Route shortcuts</p>
            <div className="preset-row" role="group" aria-label="Route presets">
              {routePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={activeRoute === preset.id ? "active" : ""}
                  aria-pressed={activeRoute === preset.id}
                  title={preset.hint}
                  onClick={() => onRoutePreset(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <RangeControl label="Trip distance" value={distance} min={5} max={400} step={5} unit=" mi" onChange={setDistance} />
          <RangeControl label="Starting battery" value={battery} min={10} max={100} step={5} unit="%" onChange={setBattery} />
          <RangeControl
            label="Outside temperature"
            value={temperature}
            min={-10}
            max={110}
            step={5}
            unit="°F"
            onChange={setTemperature}
          />
          <RangeControl label="Average speed" value={speed} min={20} max={85} unit=" mph" onChange={setSpeed} />

          <div className="field-grid">
            <label className="select-label" htmlFor="terrain">
              Terrain
              <select id="terrain" value={hills} onChange={(event) => setHills(event.target.value as Hills)}>
                <option value="flat">Mostly flat</option>
                <option value="rolling">Rolling hills</option>
                <option value="steep">Steep hills</option>
              </select>
            </label>
            <label className="select-label" htmlFor="climate">
              Cabin climate
              <select id="climate" value={climate} onChange={(event) => setClimate(event.target.value as Climate)}>
                <option value="off">Off</option>
                <option value="eco">Eco</option>
                <option value="normal">Normal</option>
                <option value="max">Maximum</option>
              </select>
            </label>
          </div>

          <div className="preset-block geo">
            <p className="preset-label">Elevation story</p>
            <div className="geo-row" role="radiogroup" aria-label="Elevation presets">
              {geoPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={activeGeo === preset.id}
                  className={activeGeo === preset.id ? "active" : ""}
                  onClick={() => onGeoPreset(preset.id)}
                >
                  <strong>{preset.label}</strong>
                  <span>{preset.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <RangeControl
            label="Net elevation"
            value={elevationGainFt}
            min={-3000}
            max={5000}
            step={100}
            unit=" ft"
            onChange={setElevationGainFt}
          />
          <RangeControl label="Passengers + cargo" value={load} min={0} max={1000} step={50} unit=" lb" onChange={setLoad} />
        </div>

        <aside className={`results-panel${viewMode === "compare" ? " compare" : ""}`}>
          <div className={`outlook-stack${viewMode === "compare" ? " dual" : ""}`}>
            <OutlookCard
              car={car}
              estimate={result}
              distance={distance}
              tip={tip}
              charge={charge}
              moreEfficient={winnerId === car.id}
              compact={viewMode === "compare"}
            />
            {viewMode === "compare" ? (
              <OutlookCard
                car={carB}
                estimate={resultB}
                distance={distance}
                tip={tipB}
                charge={chargeB}
                moreEfficient={winnerId === carB.id}
                compact
              />
            ) : null}
          </div>

          {expert ? (
            <div className="expert-panel">
              <div className="expert-title">
                <span>Model factors{viewMode === "compare" ? ` · ${car.shortName}` : ""}</span>
                <small>vs. mild 65 mph baseline</small>
              </div>
              {result.factors.map((factor) => (
                <div className="factor" key={factor.label}>
                  <span>{factor.label}</span>
                  <div>
                    <i style={{ width: `${Math.min(100, Math.max(8, ((factor.multiplier - 0.8) / 0.5) * 100))}%` }} />
                  </div>
                  <strong>{factor.multiplier.toFixed(2)}×</strong>
                </div>
              ))}
              {result.elevationWhPerMi !== 0 ? (
                <p className="method-note">
                  Elevation adds {result.elevationWhPerMi > 0 ? "+" : ""}
                  {result.elevationWhPerMi} Wh/mi before rounding
                  {viewMode === "compare" ? ` · ${carB.shortName}: ${resultB.elevationWhPerMi > 0 ? "+" : ""}${resultB.elevationWhPerMi} Wh/mi` : ""}.
                </p>
              ) : (
                <p className="method-note">Factors are broad, rounded estimates—not a physics-grade route simulation.</p>
              )}
            </div>
          ) : null}
        </aside>
      </section>

      <section className="how-it-works">
        <p className="eyebrow">What changes range?</p>
        <h2>Three forces do most of the work.</h2>
        <div className="explain-grid">
          <article>
            <span>01</span>
            <h3>Air gets expensive</h3>
            <p>At highway speed, pushing air aside takes much more energy. Slowing down is often your most powerful lever.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Temperature matters</h3>
            <p>Cold batteries deliver less energy, while cabin heat adds demand. Preconditioning while plugged in helps.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Elevation collects a toll</h3>
            <p>Climbing costs energy. Regeneration gives some back downhill, but never all of it—Mountain Pass makes that vivid.</p>
          </article>
        </div>
      </section>

      <footer>
        <strong>EV Range Lab</strong>
        <p>
          Educational estimates only. Actual range varies by vehicle, battery health, weather, traffic, tires, and driving style. Not
          an OEM warranty range.
        </p>
      </footer>
    </main>
  );
}
