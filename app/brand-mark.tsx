/**
 * Pixel EV + battery brand mark (IQ Bulls–style retro-tech silhouette).
 * Uses the raster sprite so Minecraft-like pixels stay crisp via CSS.
 */
export function BrandMark({ className = "brand-mark" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional pixel asset, not optimization candidate
    <img
      className={className}
      src="/brand-mark.png"
      width={38}
      height={38}
      alt=""
      decoding="async"
    />
  );
}
