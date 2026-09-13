"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { cars, DEFAULT_CAR } from "@/lib/ev/cars";
import { estimateTrip, getPlainTip, type Climate, type Hills } from "@/lib/ev/model";

const presets = [
  { label: "City errands", distance: 24, speed: 32 },
  { label: "Daily commute", distance: 52, speed: 52 },
  { label: "Road trip", distance: 210, speed: 70 },
];

function RangeControl({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="range-control">
      <span><span>{label}</span><strong>{value}{unit}</strong></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export default function Home() {
  const [carId, setCarId] = useState(DEFAULT_CAR.id);
  const [distance, setDistance] = useState(120);
  const [battery, setBattery] = useState(90);
  const [temperature, setTemperature] = useState(55);
  const [speed, setSpeed] = useState(62);
  const [hills, setHills] = useState<Hills>("rolling");
  const [climate, setClimate] = useState<Climate>("normal");
  const [load, setLoad] = useState(250);
  const [expert, setExpert] = useState(false);
  const car = cars.find((item) => item.id === carId) ?? DEFAULT_CAR;
  const inputs = useMemo(() => ({ distanceMi: distance, startBatteryPct: battery, temperatureF: temperature, averageSpeedMph: speed, hills, climate, loadLb: load }), [distance, battery, temperature, speed, hills, climate, load]);
  const result = useMemo(() => estimateTrip(car, inputs), [car, inputs]);
  const tip = getPlainTip(inputs, result);
  const gauge = Math.min(100, Math.max(0, result.endBatteryPct));

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="EV Range Lab home"><span className="brand-mark">EV</span><span>Range Lab</span></a>
        <div className="mode-toggle" aria-label="View mode">
          <button className={!expert ? "active" : ""} onClick={() => setExpert(false)}>Learn</button>
          <button className={expert ? "active" : ""} onClick={() => setExpert(true)}>Expert</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">Range without the guesswork</p>
          <h1>See how far your EV can <em>really</em> go.</h1>
          <p className="lede">Pick a car, shape the drive, and watch conditions change the outcome. Built for first-time EV shoppers and seasoned road-trippers.</p>
        </div>
        <div className="hero-note"><span>LIVE MODEL</span><p>Adjust any input. Your estimate updates instantly.</p></div>
      </section>

      <section className="lab-shell" aria-label="EV range calculator">
        <div className="controls-panel">
          <div className="section-heading"><span>01</span><div><p>Choose your EV</p><h2>{car.shortName}</h2></div></div>
          <label className="select-label">Vehicle
            <select value={carId} onChange={(event) => setCarId(event.target.value)}>
              {cars.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <div className="car-specs">
            <span><small>Usable battery</small><strong>{car.usableBatteryKwh} kWh</strong></span>
            <span><small>Reference range</small><strong>{car.referenceRangeMi} mi</strong></span>
          </div>

          <div className="section-heading compact"><span>02</span><div><p>Shape the trip</p><h2>Conditions</h2></div></div>
          <div className="preset-row">
            {presets.map((preset) => <button key={preset.label} onClick={() => { setDistance(preset.distance); setSpeed(preset.speed); }}>{preset.label}</button>)}
          </div>
          <RangeControl label="Trip distance" value={distance} min={5} max={400} step={5} unit=" mi" onChange={setDistance} />
          <RangeControl label="Starting battery" value={battery} min={10} max={100} step={5} unit="%" onChange={setBattery} />
          <RangeControl label="Outside temperature" value={temperature} min={-10} max={110} step={5} unit="°F" onChange={setTemperature} />
          <RangeControl label="Average speed" value={speed} min={20} max={85} unit=" mph" onChange={setSpeed} />
          <div className="field-grid">
            <label className="select-label">Terrain<select value={hills} onChange={(event) => setHills(event.target.value as Hills)}><option value="flat">Mostly flat</option><option value="rolling">Rolling hills</option><option value="steep">Steep hills</option></select></label>
            <label className="select-label">Cabin climate<select value={climate} onChange={(event) => setClimate(event.target.value as Climate)}><option value="off">Off</option><option value="eco">Eco</option><option value="normal">Normal</option><option value="max">Maximum</option></select></label>
          </div>
          <RangeControl label="Passengers + cargo" value={load} min={0} max={1000} step={50} unit=" lb" onChange={setLoad} />
        </div>

        <aside className="results-panel" style={{ "--car-accent": car.accent } as CSSProperties}>
          <div className="result-top"><span>Trip outlook</span><span className={result.tripPossible ? "status good" : "status warning"}>{result.tripPossible ? "Ready to roll" : "Charge stop needed"}</span></div>
          <div className="battery-visual" aria-label={`Estimated arrival battery ${Math.round(result.endBatteryPct)} percent`}>
            <div className="battery-fill" style={{ height: `${gauge}%` }} />
            <div className="battery-copy"><small>ARRIVE WITH</small><strong>{Math.round(result.endBatteryPct)}<sup>%</sup></strong><span>after {distance} miles</span></div>
          </div>
          <div className="metrics">
            <div><small>Range left</small><strong>~{Math.round(result.remainingRangeMi)} mi</strong></div>
            <div><small>Energy use</small><strong>{result.whPerMi} Wh/mi</strong></div>
            <div><small>Trip energy</small><strong>{result.energyUsedKwh.toFixed(1)} kWh</strong></div>
          </div>
          <div className="tip-card"><span>GOOD TO KNOW</span><p>{tip}</p></div>

          {expert ? <div className="expert-panel">
            <div className="expert-title"><span>Model factors</span><small>vs. mild 65 mph baseline</small></div>
            {result.factors.map((factor) => <div className="factor" key={factor.label}><span>{factor.label}</span><div><i style={{ width: `${Math.min(100, Math.max(8, ((factor.multiplier - 0.8) / 0.5) * 100))}%` }} /></div><strong>{factor.multiplier.toFixed(2)}×</strong></div>)}
            <p className="method-note">Factors are broad, rounded estimates—not a physics-grade route simulation.</p>
          </div> : null}
        </aside>
      </section>

      <section className="how-it-works">
        <p className="eyebrow">What changes range?</p><h2>Three forces do most of the work.</h2>
        <div className="explain-grid">
          <article><span>01</span><h3>Air gets expensive</h3><p>At highway speed, pushing air aside takes much more energy. Slowing down is often your most powerful lever.</p></article>
          <article><span>02</span><h3>Temperature matters</h3><p>Cold batteries deliver less energy, while cabin heat adds demand. Preconditioning while plugged in helps.</p></article>
          <article><span>03</span><h3>Elevation collects a toll</h3><p>Climbing costs energy. Regeneration gives some back downhill, but never all of it.</p></article>
        </div>
      </section>

      <footer><strong>EV Range Lab</strong><p>Educational estimates only. Actual range varies by vehicle, battery health, weather, traffic, tires, and driving style. Not an OEM warranty range.</p></footer>
    </main>
  );
}
