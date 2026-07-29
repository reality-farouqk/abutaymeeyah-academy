import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export async function generateSocialImage() {
  const logoPath = path.join(process.cwd(), "app", "icon.png");
  const logoData = fs.readFileSync(logoPath);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0A1530 0%, #16295A 55%, #0F1E3D 100%)",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={168} height={168} style={{ marginBottom: 36 }} alt="" />
        <div style={{ display: "flex", fontSize: 58, fontWeight: 700, letterSpacing: -1 }}>
          Abu Taymeeyah Academy
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 26,
            color: "#E8C878",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Qur&apos;anic Memorisation &amp; Training
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
