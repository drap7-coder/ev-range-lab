# EV Range Lab

An interactive browser lab for exploring how vehicle choice, trip distance, temperature, speed, terrain, cabin climate, and passenger/cargo load affect estimated EV range.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run typecheck` — check TypeScript types
- `npm run lint` — run ESLint

## Model approach

The model starts with a rounded baseline efficiency for each vehicle, then applies broad condition multipliers plus an elevation term (climb penalty, capped downhill regen). Outputs are deliberately rounded to avoid implying laboratory precision. This is an educational estimate, not an OEM warranty range or route planner.

The catalog lives in `lib/ev/cars.ts`; the calculation is isolated in `lib/ev/model.ts`, with route/geo presets in `lib/ev/presets.ts`. The UI supports single-vehicle and side-by-side compare modes, arrival SoC warnings with Fast Charge tips, and shared trip conditions so compare never desyncs.
