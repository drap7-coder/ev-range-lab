export type BrandLogoShape = "emblem" | "wordmark";

export type BrandLogoMeta = {
  slug: string;
  shape: BrandLogoShape;
};

export const brandLogos: Record<string, BrandLogoMeta> = {
  Audi: { slug: "audi", shape: "wordmark" },
  BMW: { slug: "bmw", shape: "emblem" },
  Cadillac: { slug: "cadillac", shape: "wordmark" },
  Chevrolet: { slug: "chevrolet", shape: "wordmark" },
  Ford: { slug: "ford", shape: "wordmark" },
  GMC: { slug: "gmc", shape: "wordmark" },
  Hyundai: { slug: "hyundai", shape: "wordmark" },
  Kia: { slug: "kia", shape: "wordmark" },
  Lucid: { slug: "lucid", shape: "wordmark" },
  "Mercedes-Benz": { slug: "mercedes-benz", shape: "emblem" },
  Nissan: { slug: "nissan", shape: "emblem" },
  Porsche: { slug: "porsche", shape: "emblem" },
  Rivian: { slug: "rivian", shape: "emblem" },
  Tesla: { slug: "tesla", shape: "emblem" },
  Volkswagen: { slug: "volkswagen", shape: "emblem" },
  Volvo: { slug: "volvo", shape: "emblem" },
};

export function getBrandLogo(make: string): BrandLogoMeta {
  return brandLogos[make] ?? { slug: make.toLowerCase().replace(/\s+/g, "-"), shape: "emblem" };
}
