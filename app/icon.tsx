import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: "#080d12",
          border: "2px solid #71e5da",
        }}
      >
        <div
          style={{
            width: 48,
            height: 22,
            background: "#bdff59",
            clipPath:
              "polygon(0 47%,13% 47%,25% 12%,67% 12%,82% 47%,100% 47%,100% 82%,91% 82%,86% 100%,72% 100%,67% 82%,31% 82%,26% 100%,12% 100%,7% 82%,0 82%)",
          }}
        />
      </div>
    ),
    size,
  );
}
