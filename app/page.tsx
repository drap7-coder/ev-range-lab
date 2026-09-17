"use client";

import { useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { getBrandLogo } from "@/lib/ev/brands";
import { cars, DEFAULT_CAR, getShopSpec, type EvCar } from "@/lib/ev/cars";
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
import { DEFAULT_PHEV, phevCars, type PhevCar } from "@/lib/phev/cars";
import { estimatePhevLifestyle, type PhevLifestyleResult } from "@/lib/phev/model";

type ViewMode = "single" | "compare" | "shop" | "phev";
type ShopBody = "any" | EvCar["bodyStyle"];
type ShopPriority = "balanced" | "range" | "value" | "charging";
type ShopMatch = { car: EvCar; score: number; realRange: number; reason: string };

function RangeControl({
  label,
  help,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const inputId = useId();

  return (
    <div className="range-control">
      <span>
        <label className="range-label" htmlFor={inputId}>
          {label}
        </label>
        <span className="info-wrap">
          <button className="info-button" type="button" aria-label={`Why ${label.toLowerCase()} matters`} />
          <span className="info-popover" role="tooltip">{help}</span>
        </span>
        <strong>
          {value}
          {unit}
        </strong>
      </span>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value}${unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
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
  const makes = Array.from(new Set(cars.map((item) => item.make)));

  return (
    <div className="vehicle-picker">
      <label className="select-label" htmlFor={id}>
        {label}
        <select id={id} value={carId} onChange={(event) => onChange(event.target.value)}>
          {makes.map((make) => (
            <optgroup key={make} label={make}>
              {cars.filter((item) => item.make === make).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.modelYear} {item.name} — {item.statedRangeMi} mi stated
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="vehicle-card-heading" style={{ "--car-accent": specs.accent } as CSSProperties}>
        <BrandLogo make={specs.make} className="picker-brand" />
        <span><small>{specs.modelYear} · {specs.make}</small><strong>{specs.shortName}</strong></span>
      </div>
      <div className="car-specs">
        <span>
          <small>Usable battery</small>
          <strong>{specs.usableBatteryKwh} kWh</strong>
        </span>
        <span>
          <small>Stated range · {specs.rangeBasis}</small>
          <strong>{specs.statedRangeMi} mi</strong>
        </span>
      </div>
    </div>
  );
}

function EvBrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`ev-brand-mark ${className}`.trim()} aria-hidden="true">
      <Image src="/brand/ev-mark-wide.png" alt="" width={900} height={480} unoptimized />
    </span>
  );
}

function BrandLogo({ make, className = "" }: { make: string; className?: string }) {
  const logo = getBrandLogo(make);
  return (
    <span className={`brand-logo-badge ${logo.shape} ${className}`.trim()} aria-hidden="true">
      <Image className="brand-logo" src={`/brands/${logo.slug}.svg?v=3`} alt="" width={96} height={48} unoptimized />
    </span>
  );
}

function PhevPicker({ car, onChange }: { car: PhevCar; onChange: (id: string) => void }) {
  return (
    <div className="vehicle-picker phev-picker">
      <label className="select-label" htmlFor="phev-vehicle">
        Plug-in hybrid
        <select id="phev-vehicle" value={car.id} onChange={(event) => onChange(event.target.value)}>
          {phevCars.map((item) => (
            <option key={item.id} value={item.id}>
              {item.modelYear} {item.name} — {item.electricRangeMi} mi electric
            </option>
          ))}
        </select>
      </label>
      <div className="vehicle-card-heading" style={{ "--car-accent": car.accent } as CSSProperties}>
        <BrandLogo make={car.make} className="picker-brand" />
        <span><small>{car.modelYear} · {car.make}</small><strong>{car.shortName}</strong></span>
      </div>
      <div className="car-specs">
        <span><small>Electric range · {car.rangeBasis}</small><strong>{car.electricRangeMi} mi</strong></span>
        <span><small>Seats</small><strong>{car.seats}</strong></span>
      </div>
    </div>
  );
}

function VehiclePhoto({ car, compact = false }: { car: EvCar; compact?: boolean }) {
  const commonsSearch = `https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(car.name)}`;

  return (
    <figure className={`vehicle-photo${compact ? " compact" : ""}`}>
      <Image
        className="vehicle-image"
        src={`/vehicles/${car.id}.jpg`}
        alt={`${car.name} exterior`}
        fill
        sizes={compact ? "(max-width: 560px) 90vw, 240px" : "(max-width: 860px) 92vw, 520px"}
        priority={!compact}
        unoptimized
      />
      <figcaption>
        <span className="photo-brand"><BrandLogo make={car.make} className="photo-brand-mark" /><strong>{car.make}</strong></span>
        <a href={commonsSearch} target="_blank" rel="noreferrer" aria-label={`View ${car.name} photo source on Wikimedia Commons`}>Photo: Commons ↗</a>
      </figcaption>
    </figure>
  );
}

function OutlookCard({
  car,
  estimate,
  distance,
  startBattery,
  tip,
  charge,
}: {
  car: EvCar;
  estimate: TripEstimate;
  distance: number;
  startBattery: number;
  tip: string;
  charge: ReturnType<typeof getChargeRecommendation>;
}) {
  const gauge = Math.min(100, Math.max(0, estimate.endBatteryPct));
  const status = estimate.arrivalStatus;
  const conditionsRange = Math.max(0, Math.round((car.usableBatteryKwh * 1000) / estimate.whPerMi));
  const rangeImpact = conditionsRange - car.statedRangeMi;
  const rangeImpactLabel = rangeImpact === 0
    ? "Matches rating"
    : `${Math.abs(rangeImpact)} mi ${rangeImpact > 0 ? "more" : "less"}`;
  const verdict = status === "ready"
    ? "This trip fits comfortably."
    : status === "low"
      ? "This trip needs a charging plan."
      : "Add a charging stop.";

  return (
    <article
      className="outlook-card"
      style={{ "--car-accent": car.accent } as CSSProperties}
      aria-label={`${car.shortName} trip outlook`}
    >
      <div className="result-top">
        <span className="outlook-car-line">
          <BrandLogo make={car.make} />
          <span className="outlook-car-copy">
            <span className="outlook-car">{car.shortName}</span>
            <small>{car.modelYear} · {car.rangeBasis} {car.statedRangeMi} mi</small>
          </span>
        </span>
        {status !== "ready" ? (
          <span className={`status ${statusClass(status)}`} role="status">
            {getArrivalStatusLabel(status)}
          </span>
        ) : null}
      </div>

      <div className={`trip-verdict tone-${status}`}>
        <span>Trip verdict</span>
        <h3>{verdict}</h3>
        <p>{tip}</p>
      </div>

      <VehiclePhoto car={car} />

      <div className="range-story" aria-label={`${car.statedRangeMi} miles stated range becomes about ${conditionsRange} miles in your selected conditions`}>
        <span>
          <small>{car.modelYear} stated range</small>
          <strong>{car.statedRangeMi} mi</strong>
        </span>
        <b aria-hidden="true">→</b>
        <span>
          <small>Your conditions</small>
          <strong>~{conditionsRange} mi</strong>
        </span>
        <em className={rangeImpact < 0 ? "negative" : rangeImpact > 0 ? "positive" : "neutral"}>{rangeImpactLabel}</em>
      </div>

      <div className={`energy-summary tone-${status}`} aria-label={`Estimated arrival battery ${Math.round(estimate.endBatteryPct)} percent`}>
        <div className="energy-heading">
          <span><small>Estimated arrival</small><strong>{Math.round(estimate.endBatteryPct)}<sup>%</sup></strong></span>
          <span><small>After</small><strong>{distance} mi</strong></span>
        </div>
        <div className="energy-track" aria-hidden="true"><span style={{ width: `${gauge}%` }} /></div>
      </div>

      <div className="metrics beginner-metrics">
        <div>
          <small>Range left</small>
          <strong>~{Math.round(estimate.remainingRangeMi)} mi</strong>
        </div>
        <div>
          <small>Starting charge</small>
          <strong>{startBattery}%</strong>
        </div>
        <div>
          <small>Energy use</small>
          <strong>{estimate.whPerMi} Wh/mi</strong>
        </div>
      </div>

      {charge ? (
        <div className="charge-tip" role="note">
          <span>Recommended fast charge</span>
          <p>Add ~{charge.kwhNeeded.toFixed(1)} kWh—or about {charge.minutes} minutes—to arrive near {charge.targetBufferPct}%.</p>
        </div>
      ) : null}
    </article>
  );
}

function CompareResults({
  first,
  second,
  firstEstimate,
  secondEstimate,
  efficientId,
  firstTip,
  secondTip,
}: {
  first: EvCar;
  second: EvCar;
  firstEstimate: TripEstimate;
  secondEstimate: TripEstimate;
  efficientId: string | null;
  firstTip: string;
  secondTip: string;
}) {
  const firstRange = Math.max(0, Math.round((first.usableBatteryKwh * 1000) / firstEstimate.whPerMi));
  const secondRange = Math.max(0, Math.round((second.usableBatteryKwh * 1000) / secondEstimate.whPerMi));
  const batteryGap = Math.round(Math.abs(firstEstimate.endBatteryPct - secondEstimate.endBatteryPct));
  const leader = firstEstimate.endBatteryPct === secondEstimate.endBatteryPct
    ? null
    : firstEstimate.endBatteryPct > secondEstimate.endBatteryPct ? first : second;

  const rows = [
    { label: "Stated range", first: `${first.statedRangeMi} mi`, second: `${second.statedRangeMi} mi` },
    { label: "Your conditions", first: `~${firstRange} mi`, second: `~${secondRange} mi` },
    { label: "Arrival battery", first: `${Math.round(firstEstimate.endBatteryPct)}%`, second: `${Math.round(secondEstimate.endBatteryPct)}%` },
    { label: "Range left", first: `~${Math.round(firstEstimate.remainingRangeMi)} mi`, second: `~${Math.round(secondEstimate.remainingRangeMi)} mi` },
    { label: "Efficiency", first: `${firstEstimate.whPerMi} Wh/mi`, second: `${secondEstimate.whPerMi} Wh/mi` },
  ];

  return (
    <section className="compare-result" aria-label={`${first.shortName} and ${second.shortName} comparison`}>
      <div className="compare-result-heading">
        <span>Side by side</span>
        <h2>One trip. Two clear outcomes.</h2>
        <p>{leader ? `${leader.shortName} arrives with ${batteryGap}% more battery on this trip.` : "Both vehicles arrive with the same battery level on this trip."}</p>
      </div>
      <div className="compare-vehicle-grid">
        {[first, second].map((item) => (
          <article key={item.id} className="compare-vehicle" style={{ "--car-accent": item.accent } as CSSProperties}>
            <span className="outlook-car-line">
              <BrandLogo make={item.make} />
              <span className="outlook-car-copy"><span className="outlook-car">{item.shortName}</span><small>{item.modelYear} · {item.make}</small></span>
            </span>
            <VehiclePhoto car={item} compact />
            {efficientId === item.id ? <span className="efficient-badge">More efficient</span> : null}
          </article>
        ))}
      </div>
      <div className="comparison-table" role="table" aria-label="Vehicle comparison metrics">
        {rows.map((row) => (
          <div className="comparison-row" role="row" key={row.label}>
            <strong role="rowheader">{row.label}</strong>
            <span role="cell">{row.first}</span>
            <span role="cell">{row.second}</span>
          </div>
        ))}
      </div>
      <div className="compare-guidance">
        <p><strong>{first.shortName}:</strong> {firstTip}</p>
        <p><strong>{second.shortName}:</strong> {secondTip}</p>
      </div>
    </section>
  );
}

function PhevControls({
  car,
  onCarChange,
  dailyMiles,
  daysPerWeek,
  longTripMiles,
  longTripsPerMonth,
  onDailyMiles,
  onDaysPerWeek,
  onLongTripMiles,
  onLongTripsPerMonth,
}: {
  car: PhevCar;
  onCarChange: (id: string) => void;
  dailyMiles: number;
  daysPerWeek: number;
  longTripMiles: number;
  longTripsPerMonth: number;
  onDailyMiles: (value: number) => void;
  onDaysPerWeek: (value: number) => void;
  onLongTripMiles: (value: number) => void;
  onLongTripsPerMonth: (value: number) => void;
}) {
  return (
    <>
      <div className="section-heading">
        <span>01</span>
        <div><p>Choose a plug-in hybrid</p><h2>{car.shortName}</h2></div>
      </div>
      <PhevPicker car={car} onChange={onCarChange} />

      <div className="section-heading compact">
        <span>02</span>
        <div><p>Map your routine</p><h2>Your PHEV life</h2></div>
      </div>
      <section className="control-group trip-group phev-routine" aria-label="Your plug-in hybrid routine">
        <div className="trip-grid">
          <RangeControl label="Daily round trip" help="Your normal total mileage before the vehicle can charge again overnight." value={dailyMiles} min={5} max={100} step={5} unit=" mi" onChange={onDailyMiles} />
          <RangeControl label="Driving days" help="How many days each week you expect to make this regular trip." value={daysPerWeek} min={1} max={7} unit=" /wk" onChange={onDaysPerWeek} />
          <RangeControl label="Typical long trip" help="The distance of a longer drive where the gasoline engine becomes useful after the battery is depleted." value={longTripMiles} min={50} max={500} step={25} unit=" mi" onChange={onLongTripMiles} />
          <RangeControl label="Long trips" help="How often you make that longer trip in a typical month." value={longTripsPerMonth} min={0} max={4} unit=" /mo" onChange={onLongTripsPerMonth} />
        </div>
        <p className="phev-assumption"><strong>Lab assumption:</strong> You plug in overnight and start each driving day with a full battery.</p>
      </section>
    </>
  );
}

function PhevResults({ car, result, dailyMiles, longTripsPerMonth }: { car: PhevCar; result: PhevLifestyleResult; dailyMiles: number; longTripsPerMonth: number }) {
  const fitLabel = result.electricSharePct >= 80
    ? "Electric-first fit"
    : result.electricSharePct >= 55
      ? "Balanced PHEV fit"
      : "Gas will stay busy";
  const routineCopy = result.routineFitsElectric
    ? `Your ${dailyMiles}-mile routine fits inside this PHEV's battery range.`
    : `The battery covers the first ${result.dailyElectricMiles} miles; gas backs up the remaining ${result.dailyGasMiles} miles.`;
  const backupCopy = longTripsPerMonth > 0
    ? `${longTripsPerMonth} longer ${longTripsPerMonth === 1 ? "trip" : "trips"} each month can continue after the battery is depleted—without planning a charging stop.`
    : "Your current routine does not include a regular long trip, so a full EV may also be worth comparing.";

  return (
    <article className="phev-results-card" style={{ "--car-accent": car.accent } as CSSProperties} aria-label={`${car.shortName} plug-in hybrid lifestyle outlook`}>
      <div className="phev-result-head">
        <span className="outlook-car-line">
          <BrandLogo make={car.make} />
          <span className="outlook-car-copy">
            <span className="outlook-car">{car.shortName}</span>
            <small>{car.modelYear} · {car.rangeBasis} {car.electricRangeMi} mi electric</small>
          </span>
        </span>
        <span className="phev-fit-badge">{fitLabel}</span>
      </div>

      <figure className="vehicle-photo phev-photo">
        <Image
          className="vehicle-image"
          src={`/phevs/${car.id}.jpg`}
          alt={`${car.name} exterior`}
          fill
          sizes="(max-width: 860px) 92vw, 520px"
          unoptimized
        />
        <figcaption>
          <span className="photo-brand"><BrandLogo make={car.make} className="photo-brand-mark" /><strong>{car.make}</strong></span>
          <a href={car.photoSourceUrl} target="_blank" rel="noreferrer" aria-label={`View ${car.name} photo source on Wikimedia Commons`}>Photo: Commons ↗</a>
        </figcaption>
      </figure>

      <div className={`phev-verdict ${result.routineFitsElectric ? "fits" : "mixed"}`}>
        <span>Daily-drive verdict</span>
        <h2>{result.routineFitsElectric ? "Your routine fits on electricity." : "Gas joins your daily drive."}</h2>
        <p>{routineCopy}</p>
      </div>

      <div className="phev-share" aria-label={`${result.electricSharePct} percent of projected monthly miles on electricity`}>
        <small>PROJECTED ELECTRIC SHARE</small>
        <strong>{result.electricSharePct}<sup>%</sup></strong>
        <div className="phev-share-track" aria-hidden="true"><span style={{ width: `${result.electricSharePct}%` }} /></div>
        <p>of your routine and longer-trip miles could start on battery power.</p>
      </div>

      <div className="phev-mile-split">
        <div><small>Electric miles / month</small><strong>~{result.electricMiles}</strong></div>
        <div><small>Gas-backed miles / month</small><strong>~{result.gasBackedMiles}</strong></div>
      </div>

      <div className="phev-daily-story">
        <span><small>Daily drive</small><strong>{dailyMiles} mi</strong></span>
        <b aria-hidden="true">→</b>
        <span><small>Electric window</small><strong>{car.electricRangeMi} mi</strong></span>
      </div>

      <div className={`tip-card ${result.routineFitsElectric ? "tone-ready" : "tone-low"}`}>
        <span>LONG-TRIP BACKUP</span>
        <p>{backupCopy}</p>
      </div>

      <a className="phev-source" href={car.sourceUrl} target="_blank" rel="noreferrer">Verify {car.modelYear} range with {car.make} ↗</a>
      <p className="phev-disclaimer">Lifestyle projection uses the listed EPA electric range and assumes a full overnight charge. Weather, speed, battery condition, and trim can reduce real electric range.</p>
    </article>
  );
}

function ShoppingProfile({
  budget,
  body,
  seats,
  priority,
  onBudget,
  onBody,
  onSeats,
  onPriority,
}: {
  budget: number;
  body: ShopBody;
  seats: number;
  priority: ShopPriority;
  onBudget: (value: number) => void;
  onBody: (value: ShopBody) => void;
  onSeats: (value: number) => void;
  onPriority: (value: ShopPriority) => void;
}) {
  return (
    <div className="shop-profile">
      <RangeControl label="Maximum budget" help="We use an illustrative starting price before incentives, taxes, and options." value={budget / 1000} min={35} max={130} step={5} unit="k" onChange={(value) => onBudget(value * 1000)} />
      <div className="shop-field-grid">
        <label className="select-label">Body style
          <select value={body} onChange={(event) => onBody(event.target.value as ShopBody)}>
            <option value="any">Any body style</option><option value="sedan">Sedan</option><option value="crossover">Crossover</option><option value="suv">SUV</option><option value="truck">Truck</option>
          </select>
        </label>
        <label className="select-label">Seats needed
          <select value={seats} onChange={(event) => onSeats(Number(event.target.value))}>
            <option value={4}>4 or more</option><option value={5}>5 or more</option><option value={7}>7 seats</option>
          </select>
        </label>
        <label className="select-label">Top priority
          <select value={priority} onChange={(event) => onPriority(event.target.value as ShopPriority)}>
            <option value="balanced">Balanced match</option><option value="range">Longest range</option><option value="value">Best value</option><option value="charging">Fast charging</option>
          </select>
        </label>
      </div>
      <p className="shop-note">We assume overnight home charging. Adjust the trip below and matches will follow your real driving life.</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-label="Find the EV that fits your life">
      <div className="desktop-hero-art" aria-hidden="true">
        <Image src="/hero-premium.png" alt="" fill sizes="(max-width: 1240px) 100vw, 1240px" priority unoptimized />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">Your EV decision laboratory</p>
        <h1>Find the EV that <em>fits your life.</em></h1>
        <p className="lede">
          Explore the models, compare the tradeoffs, and test how your trips, weather, speed, passengers, and landscape
          change real-world range—before you choose.
        </p>
        <a className="hero-action mobile-hero-action" href="#lab">Enter the lab <span aria-hidden="true">↓</span></a>
      </div>
      <div className="hero-stage" aria-hidden="true">
        <figure className="hero-photo main">
          <Image src="/vehicles/model-3-lr.jpg" alt="" fill sizes="(max-width: 860px) 92vw, 480px" unoptimized />
        </figure>
        <div className="hero-caption"><span>{cars.length} EVs · {phevCars.length} PHEVs</span><strong>Real conditions. Honest range.</strong></div>
      </div>
      <div className="desktop-hero-actions">
        <a className="hero-action" href="#lab">Enter the lab <span aria-hidden="true">↓</span></a>
        <span>{cars.length} EVs · {phevCars.length} PHEVs · Live range simulator</span>
      </div>
    </section>
  );
}

function ShoppingResults({ matches, onCompare }: { matches: ShopMatch[]; onCompare: (first: EvCar, second: EvCar) => void }) {
  return (
    <div className="shop-results">
      <div className="shop-results-heading"><span>YOUR BEST MATCHES</span><h2>Your strongest matches.</h2><p>Ranked for your needs and the conditions selected on this page.</p></div>
      <div className="shop-match-list">
        {matches.map((match, index) => {
          const spec = getShopSpec(match.car);
          return (
            <article className={`shop-match${index === 0 ? " is-primary" : ""}`} key={match.car.id} style={{ "--car-accent": match.car.accent } as CSSProperties}>
              <div className="shop-rank">0{index + 1}</div>
              <VehiclePhoto car={match.car} compact />
              <div className="shop-match-title"><BrandLogo make={match.car.make} /><div><small>{match.car.modelYear} · {match.car.make}</small><h3>{match.car.shortName}</h3></div><strong>{match.score}% fit</strong></div>
              <div className="shop-match-metrics"><span><small>Stated · {match.car.rangeBasis}</small><strong>{match.car.statedRangeMi} mi</strong></span><span><small>Your conditions</small><strong>~{match.realRange} mi</strong></span><span><small>From</small><strong>~${Math.round(spec.startingPriceUsd / 1000)}k</strong></span><span><small>Seats</small><strong>{spec.seats}</strong></span></div>
              <p>{match.reason}</p>
            </article>
          );
        })}
      </div>
      {matches.length >= 2 ? <button className="compare-matches" type="button" onClick={() => onCompare(matches[0].car, matches[1].car)}>Compare the top two</button> : null}
      <p className="shopping-disclaimer">Stated range is the listed EPA or manufacturer estimate for that model year and trim. Pricing and specifications can change; confirm them before purchasing.</p>
    </div>
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
  const [hills, setHills] = useState<Hills>("flat");
  const [climate, setClimate] = useState<Climate>("normal");
  const [load, setLoad] = useState(250);
  const [elevationGainFt, setElevationGainFt] = useState(0);
  const [shopBudget, setShopBudget] = useState(60000);
  const [shopBody, setShopBody] = useState<ShopBody>("any");
  const [shopSeats, setShopSeats] = useState(5);
  const [shopPriority, setShopPriority] = useState<ShopPriority>("balanced");
  const [phevId, setPhevId] = useState(DEFAULT_PHEV.id);
  const [phevDailyMiles, setPhevDailyMiles] = useState(30);
  const [phevDaysPerWeek, setPhevDaysPerWeek] = useState(5);
  const [phevLongTripMiles, setPhevLongTripMiles] = useState(250);
  const [phevLongTripsPerMonth, setPhevLongTripsPerMonth] = useState(1);

  const car = cars.find((item) => item.id === carId) ?? DEFAULT_CAR;
  const carB = cars.find((item) => item.id === carIdB) ?? cars[1] ?? DEFAULT_CAR;
  const phev = phevCars.find((item) => item.id === phevId) ?? DEFAULT_PHEV;
  const phevResult = useMemo(
    () => estimatePhevLifestyle(phev, {
      dailyMiles: phevDailyMiles,
      daysPerWeek: phevDaysPerWeek,
      longTripMiles: phevLongTripMiles,
      longTripsPerMonth: phevLongTripsPerMonth,
    }),
    [phev, phevDailyMiles, phevDaysPerWeek, phevLongTripMiles, phevLongTripsPerMonth],
  );

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
  const activeRoute = matchRoutePreset(inputs);
  const activeGeo = matchGeoPreset(inputs);

  const winnerId =
    viewMode === "compare"
      ? getMoreEfficientCarId({ carId: car.id, whPerMi: result.whPerMi }, { carId: carB.id, whPerMi: resultB.whPerMi })
      : null;

  const shopMatches = useMemo<ShopMatch[]>(() => cars.map((candidate) => {
    const spec = getShopSpec(candidate);
    const estimate = estimateTrip(candidate, inputs);
    const realRange = Math.max(0, Math.round((candidate.usableBatteryKwh * 1000) / estimate.whPerMi));
    const budgetFit = spec.startingPriceUsd <= shopBudget ? 30 : Math.max(0, 30 - ((spec.startingPriceUsd - shopBudget) / 2000));
    const bodyFit = shopBody === "any" || candidate.bodyStyle === shopBody ? 18 : 0;
    const seatFit = spec.seats >= shopSeats ? 14 : 0;
    const rangeWeight = shopPriority === "range" ? 30 : 20;
    const valueWeight = shopPriority === "value" ? 18 : 8;
    const chargeWeight = shopPriority === "charging" ? 18 : 10;
    const rangeFit = Math.min(rangeWeight, (realRange / 450) * rangeWeight);
    const valueFit = Math.min(valueWeight, (realRange / Math.max(1, spec.startingPriceUsd / 1000)) * (valueWeight / 7));
    const chargeFit = Math.min(chargeWeight, (spec.dcFastChargeKw / 300) * chargeWeight);
    const total = budgetFit + bodyFit + seatFit + rangeFit + valueFit + chargeFit;
    const max = 30 + 18 + 14 + rangeWeight + valueWeight + chargeWeight;
    const score = Math.max(1, Math.min(99, Math.round((total / max) * 100)));
    const reason = spec.startingPriceUsd > shopBudget
      ? `Strong capability, but its illustrative starting price is about $${Math.round((spec.startingPriceUsd - shopBudget) / 1000)}k over your budget.`
      : shopPriority === "range"
        ? `A standout for distance, with about ${realRange} miles under the conditions you selected.`
        : shopPriority === "charging" && spec.dcFastChargeKw >= 220
          ? `Its strong DC charging rate makes road-trip stops shorter.`
          : `${candidate.bodyStyle === shopBody || shopBody === "any" ? "Fits your preferred shape" : "A smart alternative shape"} with a useful balance of range, price, and charging.`;
    return { car: candidate, score, realRange, reason };
  }).sort((a, b) => b.score - a.score).slice(0, 3), [inputs, shopBudget, shopBody, shopSeats, shopPriority]);

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
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="EV Range Lab home">
          <EvBrandMark className="brand-mark" />
          <span className="brand-copy">
            <span className="brand-name"><b>EV</b> Range Lab</span>
            <small>Know your range.</small>
          </span>
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
            <button type="button" className={viewMode === "shop" ? "active" : ""} aria-pressed={viewMode === "shop"} onClick={() => setViewMode("shop")}>Shop</button>
            <button type="button" className={viewMode === "phev" ? "active" : ""} aria-pressed={viewMode === "phev"} onClick={() => setViewMode("phev")}>PHEV</button>
          </div>
        </div>
      </header>

      <Hero />

      <section id="lab" className="lab-shell" aria-label="EV range calculator" data-mode={viewMode}>
        <div className="controls-panel">
          {viewMode === "phev" ? (
            <PhevControls
              car={phev}
              onCarChange={setPhevId}
              dailyMiles={phevDailyMiles}
              daysPerWeek={phevDaysPerWeek}
              longTripMiles={phevLongTripMiles}
              longTripsPerMonth={phevLongTripsPerMonth}
              onDailyMiles={setPhevDailyMiles}
              onDaysPerWeek={setPhevDaysPerWeek}
              onLongTripMiles={setPhevLongTripMiles}
              onLongTripsPerMonth={setPhevLongTripsPerMonth}
            />
          ) : (
          <>
          <div className="section-heading">
            <span>01</span>
            <div>
              <p>{viewMode === "shop" ? "Find your EV" : "Choose your EV"}</p>
              <h2>{viewMode === "compare" ? "Compare models" : viewMode === "shop" ? "What fits your life?" : car.shortName}</h2>
            </div>
          </div>

          {viewMode === "shop" ? (
            <ShoppingProfile budget={shopBudget} body={shopBody} seats={shopSeats} priority={shopPriority} onBudget={setShopBudget} onBody={setShopBody} onSeats={setShopSeats} onPriority={setShopPriority} />
          ) : viewMode === "single" ? (
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
              <p>Plan the drive</p>
              <h2>Your trip</h2>
            </div>
          </div>

          <section className="control-group trip-group" aria-label="Your trip">
            <div className="trip-grid">
              <RangeControl label="Trip distance" help="How far you plan to drive before reaching your destination or next charger." value={distance} min={5} max={400} step={5} unit=" mi" onChange={setDistance} />
              <RangeControl label="Starting battery" help="Think of this like the fuel gauge when you leave. Most EV owners charge at home overnight." value={battery} min={10} max={100} step={5} unit="%" onChange={setBattery} />
            </div>
          </section>

          <details className="conditions-disclosure">
            <summary>
              <span className="summary-index">03</span>
              <span><small>Fine-tune the estimate</small><strong>Driving conditions</strong></span>
              <em>{temperature}°F · {speed} mph · {geoPresets.find((item) => item.id === activeGeo)?.label ?? "Custom"}</em>
            </summary>
          <section className="control-group conditions-group" aria-label="Driving conditions">
            <div className="preset-block">
              <p className="preset-label">Scenario shortcuts</p>
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

            <RangeControl
              label="Outside temperature"
              help="Cold slows the battery's chemistry and cabin heat uses extra energy. Preheating while plugged in helps."
              value={temperature}
              min={-10}
              max={110}
              step={5}
              unit="°F"
              onChange={setTemperature}
            />
            <RangeControl label="Average speed" help="Driving faster pushes much more air out of the way. Highway speed usually reduces range the most." value={speed} min={20} max={85} unit=" mph" onChange={setSpeed} />

            <label className="select-label climate-field" htmlFor="climate">
              Cabin climate
              <select id="climate" value={climate} onChange={(event) => setClimate(event.target.value as Climate)}>
                <option value="off">Off</option>
                <option value="eco">Eco</option>
                <option value="normal">Normal</option>
                <option value="max">Maximum</option>
              </select>
            </label>

            <div className="preset-block geo">
              <p className="preset-label">Landscape</p>
              <div className="geo-row" role="radiogroup" aria-label="Landscape">
                {geoPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={activeGeo === preset.id}
                    className={`landscape-card ${preset.id}${activeGeo === preset.id ? " active" : ""}`}
                    onClick={() => onGeoPreset(preset.id)}
                  >
                    <span className="landscape-shape" aria-hidden="true" />
                    <strong>{preset.label}</strong>
                    <span>{preset.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <RangeControl label="Passengers + cargo" help="More people and luggage add weight. The effect is usually smaller than speed or temperature." value={load} min={0} max={1000} step={50} unit=" lb" onChange={setLoad} />
          </section>
          </details>
          </>
          )}
        </div>

        <aside className={`results-panel${viewMode === "compare" ? " compare" : ""}${viewMode === "shop" ? " shopping" : ""}${viewMode === "phev" ? " phev" : ""}`}>
          {viewMode === "phev" ? (
            <PhevResults car={phev} result={phevResult} dailyMiles={phevDailyMiles} longTripsPerMonth={phevLongTripsPerMonth} />
          ) : viewMode === "shop" ? (
            <div className="desktop-shopping-results">
              <ShoppingResults matches={shopMatches} onCompare={(first, second) => { setCarId(first.id); setCarIdB(second.id); setViewMode("compare"); }} />
            </div>
          ) : viewMode === "compare" ? (
            <CompareResults
              first={car}
              second={carB}
              firstEstimate={result}
              secondEstimate={resultB}
              efficientId={winnerId}
              firstTip={tip}
              secondTip={tipB}
            />
          ) : (
          <div className="outlook-stack">
            <OutlookCard
              car={car}
              estimate={result}
              distance={distance}
              startBattery={battery}
              tip={tip}
              charge={charge}
            />
          </div>
          )}
        </aside>
      </section>

      <section className="how-it-works">
        <div className="explain-heading">
          <div>
            <p className="eyebrow">{viewMode === "phev" ? "How a PHEV works" : "What changes range?"}</p>
            <h2>{viewMode === "phev" ? "Battery first. Gas when you need it." : "Three inputs matter most."}</h2>
          </div>
        </div>
        <div className="explain-grid" role="list" aria-label={viewMode === "phev" ? "How a plug-in hybrid fits everyday driving" : "The three biggest forces affecting EV range"}>
          <article role="listitem">
            <span>01</span>
            <h3>{viewMode === "phev" ? "Plug in nightly" : "Air gets expensive"}</h3>
            <p>{viewMode === "phev" ? "A PHEV delivers its biggest benefit when the smaller battery starts each day full. A standard household outlet is often enough overnight." : "At highway speed, pushing air aside takes much more energy. Slowing down is often your most powerful lever."}</p>
          </article>
          <article role="listitem">
            <span>02</span>
            <h3>{viewMode === "phev" ? "Drive electric first" : "Temperature matters"}</h3>
            <p>{viewMode === "phev" ? "If your routine fits inside the electric range, most ordinary days can feel like owning an EV—with the engine waiting in reserve." : "Cold batteries deliver less energy, while cabin heat adds demand. Preconditioning while plugged in helps."}</p>
          </article>
          <article role="listitem">
            <span>03</span>
            <h3>{viewMode === "phev" ? "Keep gas backup" : "Elevation collects a toll"}</h3>
            <p>{viewMode === "phev" ? "After the battery is depleted, the hybrid system keeps going on gasoline. That flexibility is the reason to choose a PHEV over a full EV." : "Climbing costs energy. Regeneration gives some back downhill, but never all of it—Mountain pass makes that vivid."}</p>
          </article>
        </div>
      </section>

      <footer>
        <strong><EvBrandMark />EV Range Lab</strong>
        <p>
          Stated range is the listed EPA or manufacturer estimate for the model year and trim. EV and PHEV results are educational,
          not an OEM warranty range; actual range varies with battery health, weather, traffic, tires, and driving style.
        </p>
      </footer>
    </main>
  );
}
