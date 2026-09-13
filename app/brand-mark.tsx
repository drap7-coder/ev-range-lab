/**
 * Header mark cropped from the evolved logo banner (silhouette car).
 * Same art as `public/og.png` — not a separate icon system.
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
