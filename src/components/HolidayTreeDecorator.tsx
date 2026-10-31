import React, { useState, useEffect, useRef, useCallback } from "react";

interface PlacedOrnament {
  id: string;
  typeId: string;
  x: number; // Normalized 0..1 relative to canvas width
  y: number; // Normalized 0..1 relative to canvas height
  scale: number;
  rotation: number;
}

interface OrnamentDef {
  id: string;
  name: string;
  category: "classic" | "tech";
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  badgeText?: string;
}

const ORNAMENT_CATALOG: OrnamentDef[] = [
  // Classic Ornaments
  {
    id: "bauble-red",
    name: "Crimson Bauble",
    category: "classic",
    icon: "🔴",
    primaryColor: "#d90429",
    secondaryColor: "#ffccd5",
  },
  {
    id: "bauble-gold",
    name: "Winter Gold Bauble",
    category: "classic",
    icon: "🟡",
    primaryColor: "#eab308",
    secondaryColor: "#fef08a",
  },
  {
    id: "bauble-emerald",
    name: "Emerald Bauble",
    category: "classic",
    icon: "🟢",
    primaryColor: "#059669",
    secondaryColor: "#a7f3d0",
  },
  {
    id: "bauble-ice",
    name: "Frost Blue Bauble",
    category: "classic",
    icon: "🔵",
    primaryColor: "#0284c7",
    secondaryColor: "#bae6fd",
  },
  {
    id: "candy-cane",
    name: "Candy Cane",
    category: "classic",
    icon: "🍬",
    primaryColor: "#ef4444",
    secondaryColor: "#ffffff",
  },
  {
    id: "pinecone-bell",
    name: "Golden Bell",
    category: "classic",
    icon: "🔔",
    primaryColor: "#f59e0b",
    secondaryColor: "#fef3c7",
  },
  {
    id: "gift-box",
    name: "Wrapped Gift",
    category: "classic",
    icon: "🎁",
    primaryColor: "#dc2626",
    secondaryColor: "#facc15",
  },
  // Next Val Data / Tech & Transit Ornaments
  {
    id: "mta-q",
    name: "MTA Q Bullet",
    category: "tech",
    icon: "🚇",
    primaryColor: "#fccc0a",
    secondaryColor: "#000000",
    badgeText: "Q",
  },
  {
    id: "mta-b",
    name: "MTA B Bullet",
    category: "tech",
    icon: "🚇",
    primaryColor: "#ff6319",
    secondaryColor: "#ffffff",
    badgeText: "B",
  },
  {
    id: "nvd-orb",
    name: "NextVal Orange Orb",
    category: "tech",
    icon: "🧡",
    primaryColor: "#ff6b35",
    secondaryColor: "#ffffff",
    badgeText: "NVD",
  },
  {
    id: "duckdb",
    name: "DuckDB Ornament",
    category: "tech",
    icon: "🦆",
    primaryColor: "#1e293b",
    secondaryColor: "#fde047",
    badgeText: "🦆",
  },
  {
    id: "python",
    name: "Python Orb",
    category: "tech",
    icon: "🐍",
    primaryColor: "#1d4ed8",
    secondaryColor: "#facc15",
    badgeText: "PY",
  },
  {
    id: "gpu-core",
    name: "CUDA Tensor Orb",
    category: "tech",
    icon: "⚡",
    primaryColor: "#15803d",
    secondaryColor: "#86efac",
    badgeText: "GPU",
  },
];

type TopperType = "star" | "snowflake" | "q-bullet" | "santa-hat" | "nvd-badge";
type BackdropType = "midnight" | "brooklyn-twilight" | "warm-hearth" | "frost-day";
type LightsStyle = "warm-gold" | "festive-multi" | "nvd-cyber" | "icy-blue" | "off";

const BACKDROP_THEMES: Record<
  BackdropType,
  { name: string; skyTop: string; skyBottom: string; snowGround: string; textDark?: boolean }
> = {
  midnight: {
    name: "Starry Midnight",
    skyTop: "#071126",
    skyBottom: "#172a45",
    snowGround: "#e2e8f0",
  },
  "brooklyn-twilight": {
    name: "Brooklyn Twilight",
    skyTop: "#1a103c",
    skyBottom: "#3b1d5e",
    snowGround: "#f1f5f9",
  },
  "warm-hearth": {
    name: "Cozy Evergreen",
    skyTop: "#0b2419",
    skyBottom: "#1b4332",
    snowGround: "#f8fafc",
  },
  "frost-day": {
    name: "Winter Morning",
    skyTop: "#bae6fd",
    skyBottom: "#f0f9ff",
    snowGround: "#ffffff",
    textDark: true,
  },
};

const DEFAULT_ORNAMENTS: PlacedOrnament[] = [
  { id: "init-1", typeId: "bauble-gold", x: 0.48, y: 0.31, scale: 1, rotation: 0 },
  { id: "init-2", typeId: "mta-q", x: 0.54, y: 0.39, scale: 1.05, rotation: 0 },
  { id: "init-3", typeId: "bauble-red", x: 0.43, y: 0.42, scale: 1, rotation: 0 },
  { id: "init-4", typeId: "nvd-orb", x: 0.5, y: 0.49, scale: 1.1, rotation: 0 },
  { id: "init-5", typeId: "bauble-ice", x: 0.4, y: 0.53, scale: 0.95, rotation: 0 },
  { id: "init-6", typeId: "duckdb", x: 0.59, y: 0.54, scale: 1, rotation: 0 },
  { id: "init-7", typeId: "candy-cane", x: 0.45, y: 0.61, scale: 1, rotation: -12 },
  { id: "init-8", typeId: "bauble-emerald", x: 0.55, y: 0.63, scale: 1, rotation: 0 },
  { id: "init-9", typeId: "python", x: 0.36, y: 0.66, scale: 1, rotation: 0 },
  { id: "init-10", typeId: "pinecone-bell", x: 0.63, y: 0.67, scale: 1, rotation: 8 },
  { id: "init-11", typeId: "gift-box", x: 0.41, y: 0.76, scale: 1.15, rotation: -4 },
  { id: "init-12", typeId: "gift-box", x: 0.58, y: 0.77, scale: 1.1, rotation: 5 },
];

export default function HolidayTreeDecorator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const [selectedTool, setSelectedTool] = useState<string>("bauble-red");
  const [ornamentScale, setOrnamentScale] = useState<number>(1.0);
  const [topper, setTopper] = useState<TopperType>("star");
  const [backdrop, setBackdrop] = useState<BackdropType>("midnight");
  const [lightsStyle, setLightsStyle] = useState<LightsStyle>("warm-gold");
  const [showTinsel, setShowTinsel] = useState<boolean>(true);
  const [snowCount, setSnowCount] = useState<number>(65);
  const [greetingHeadline, setGreetingHeadline] = useState<string>(
    "Happy Holidays from Next Val Data"
  );
  const [greetingSubtitle, setGreetingSubtitle] = useState<string>(
    "Wishing you clean pipelines, fast queries & zero downtime!"
  );

  const [ornaments, setOrnaments] = useState<PlacedOrnament[]>(DEFAULT_ORNAMENTS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);

  // Deterministic snowflakes so downloaded card looks crisp
  const snowflakesRef = useRef<Array<{ x: number; y: number; r: number; alpha: number }>>([]);
  useEffect(() => {
    const flakes: Array<{ x: number; y: number; r: number; alpha: number }> = [];
    for (let i = 0; i < 140; i++) {
      // Golden-ratio quasirandom distribution for pleasing snow
      const x = (i * 0.61803398875) % 1;
      const y = ((i * 0.38196601125 + (i % 7) * 0.09) % 0.86);
      const r = 1.5 + (i % 5) * 1.1;
      const alpha = 0.35 + ((i * 17) % 60) / 100;
      flakes.push({ x, y, r, alpha });
    }
    snowflakesRef.current = flakes;
  }, []);

  // Load Next Val Data SVG logo for canvas rendering
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      logoImgRef.current = img;
      setLogoLoaded(true);
    };
    img.onerror = () => {
      const fallback = new Image();
      fallback.crossOrigin = "anonymous";
      fallback.onload = () => {
        logoImgRef.current = fallback;
        setLogoLoaded(true);
      };
      fallback.src = "/img/nvdlogo.svg";
    };
    img.src = "/img/tosvg.svg";
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const theme = BACKDROP_THEMES[backdrop];

    ctx.clearRect(0, 0, W, H);

    // 1. Background Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, theme.skyTop);
    skyGrad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial aurora / glow behind the tree
    const glowGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, 30, W * 0.5, H * 0.45, W * 0.45);
    glowGrad.addColorStop(0, "rgba(255, 215, 110, 0.14)");
    glowGrad.addColorStop(0.5, "rgba(46, 139, 87, 0.08)");
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Background Snowflakes
    const flakes = snowflakesRef.current.slice(0, snowCount);
    flakes.forEach((f) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(f.x * W, f.y * H, f.r, 0, Math.PI * 2);
      ctx.fillStyle = theme.textDark
        ? `rgba(255, 255, 255, ${Math.min(1, f.alpha + 0.3)})`
        : `rgba(224, 242, 254, ${f.alpha})`;
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    });

    // 3. Snowy Ground Hills (above footer banner)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.quadraticCurveTo(W * 0.28, H * 0.73, W * 0.55, H * 0.77);
    ctx.quadraticCurveTo(W * 0.8, H * 0.8, W, H * 0.75);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    const snowGrad = ctx.createLinearGradient(0, H * 0.73, 0, H * 0.88);
    snowGrad.addColorStop(0, theme.snowGround);
    snowGrad.addColorStop(1, "#cbd5e1");
    ctx.fillStyle = snowGrad;
    ctx.fill();
    ctx.restore();

    // 4. Tree Trunk
    const trunkW = W * 0.075;
    const trunkH = H * 0.11;
    const trunkX = W * 0.5 - trunkW / 2;
    const trunkY = H * 0.69;
    ctx.save();
    const trunkGrad = ctx.createLinearGradient(trunkX, trunkY, trunkX + trunkW, trunkY);
    trunkGrad.addColorStop(0, "#451a03");
    trunkGrad.addColorStop(0.5, "#78350f");
    trunkGrad.addColorStop(1, "#3b1502");
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.roundRect(trunkX, trunkY, trunkW, trunkH, 8);
    ctx.fill();
    ctx.restore();

    // Tree Shadow on Snow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.79, W * 0.24, H * 0.028, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
    ctx.fill();
    ctx.restore();

    // 5. Layered Pine Tree Tiers (4 lush tiers from bottom to top)
    const tiers = [
      { topY: H * 0.46, bottomY: H * 0.72, halfW: W * 0.27, dark: "#0f3923", light: "#1e603c" },
      { topY: H * 0.34, bottomY: H * 0.58, halfW: W * 0.22, dark: "#14452b", light: "#247046" },
      { topY: H * 0.23, bottomY: H * 0.45, halfW: W * 0.165, dark: "#195233", light: "#2d8254" },
      { topY: H * 0.15, bottomY: H * 0.33, halfW: W * 0.11, dark: "#1e5e3a", light: "#349460" },
    ];

    tiers.forEach((tier) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(W * 0.5, tier.topY);
      ctx.quadraticCurveTo(
        W * 0.5 - tier.halfW * 0.55,
        (tier.topY + tier.bottomY) * 0.52,
        W * 0.5 - tier.halfW,
        tier.bottomY
      );
      // Scalloped bough bottom edge
      const scallops = 5;
      const stepW = (tier.halfW * 2) / scallops;
      for (let s = 0; s < scallops; s++) {
        const sx1 = W * 0.5 - tier.halfW + s * stepW;
        const sx2 = sx1 + stepW;
        const midX = (sx1 + sx2) / 2;
        ctx.quadraticCurveTo(midX, tier.bottomY + 14, sx2, tier.bottomY);
      }
      ctx.quadraticCurveTo(
        W * 0.5 + tier.halfW * 0.55,
        (tier.topY + tier.bottomY) * 0.52,
        W * 0.5,
        tier.topY
      );
      ctx.closePath();

      const folGrad = ctx.createLinearGradient(
        W * 0.5 - tier.halfW,
        tier.topY,
        W * 0.5 + tier.halfW,
        tier.bottomY
      );
      folGrad.addColorStop(0, tier.light);
      folGrad.addColorStop(0.55, tier.dark);
      folGrad.addColorStop(1, "#092617");
      ctx.fillStyle = folGrad;
      ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fill();

      // Frosted snow tips along the scalloped bottom edge
      ctx.beginPath();
      for (let s = 0; s < scallops; s++) {
        const sx1 = W * 0.5 - tier.halfW + s * stepW;
        const sx2 = sx1 + stepW;
        const midX = (sx1 + sx2) / 2;
        ctx.moveTo(sx1 + 4, tier.bottomY - 1);
        ctx.quadraticCurveTo(midX, tier.bottomY + 13, sx2 - 4, tier.bottomY - 1);
      }
      ctx.strokeStyle = "rgba(240, 249, 255, 0.7)";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    });

    // 6. Tinsel Garland Ribbons
    if (showTinsel) {
      const garlandRows = [
        { x1: W * 0.41, y1: H * 0.29, cx: W * 0.5, cy: H * 0.34, x2: W * 0.59, y2: H * 0.3 },
        { x1: W * 0.36, y1: H * 0.41, cx: W * 0.5, cy: H * 0.47, x2: W * 0.64, y2: H * 0.42 },
        { x1: W * 0.31, y1: H * 0.53, cx: W * 0.5, cy: H * 0.6, x2: W * 0.69, y2: H * 0.55 },
        { x1: W * 0.26, y1: H * 0.66, cx: W * 0.5, cy: H * 0.73, x2: W * 0.74, y2: H * 0.67 },
      ];
      garlandRows.forEach((g) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(g.x1, g.y1);
        ctx.quadraticCurveTo(g.cx, g.cy, g.x2, g.y2);
        ctx.strokeStyle = "rgba(253, 224, 71, 0.75)";
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 5]);
        ctx.shadowColor = "rgba(250, 204, 21, 0.6)";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();
      });
    }

    // 7. String Lights
    if (lightsStyle !== "off") {
      const palettes: Record<Exclude<LightsStyle, "off">, string[]> = {
        "warm-gold": ["#fef08a", "#fde047", "#facc15", "#fffbeb"],
        "festive-multi": ["#ef4444", "#fde047", "#22c55e", "#38bdf8", "#f472b6"],
        "nvd-cyber": ["#ff6b35", "#ff9f43", "#38bdf8", "#fde047"],
        "icy-blue": ["#e0f2fe", "#7dd3fc", "#38bdf8", "#ffffff"],
      };
      const colors = palettes[lightsStyle];
      const lightStrands = [
        { yStart: 0.25, yEnd: 0.31, halfSpan: 0.085, count: 6 },
        { yStart: 0.36, yEnd: 0.43, halfSpan: 0.14, count: 8 },
        { yStart: 0.48, yEnd: 0.56, halfSpan: 0.19, count: 10 },
        { yStart: 0.61, yEnd: 0.69, halfSpan: 0.24, count: 12 },
      ];

      let colorIdx = 0;
      lightStrands.forEach((strand) => {
        for (let i = 0; i < strand.count; i++) {
          const t = i / (strand.count - 1);
          const lx = W * (0.5 - strand.halfSpan + t * strand.halfSpan * 2);
          const sag = Math.sin(t * Math.PI) * 0.025;
          const ly = H * (strand.yStart + t * (strand.yEnd - strand.yStart) * 0.3 + sag);
          const c = colors[colorIdx % colors.length];
          colorIdx++;

          ctx.save();
          ctx.beginPath();
          ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.shadowColor = c;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        }
      });
    }

    // 8. Placed Ornaments
    ornaments.forEach((item) => {
      const def = ORNAMENT_CATALOG.find((o) => o.id === item.typeId);
      if (!def) return;

      const cx = item.x * W;
      const cy = item.y * H;
      const radius = 19 * item.scale;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((item.rotation * Math.PI) / 180);

      // Selection ring if currently active
      if (item.id === selectedPlacedId) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "#ff6b35";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();
      }

      // Ornament Hanger Cap
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(-4, -radius - 4, 8, 5);

      if (item.typeId === "candy-cane") {
        // Candy Cane Hook
        ctx.lineWidth = 7 * item.scale;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -4 * item.scale, 8 * item.scale, Math.PI, 0, false);
        ctx.lineTo(8 * item.scale, 14 * item.scale);
        ctx.stroke();

        ctx.strokeStyle = "#ef4444";
        ctx.setLineDash([5 * item.scale, 5 * item.scale]);
        ctx.stroke();
      } else if (item.typeId === "gift-box") {
        // Present Box
        const sz = radius * 1.65;
        ctx.fillStyle = def.primaryColor;
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-sz / 2, -sz / 2, sz, sz, 4);
        ctx.fill();

        // Ribbon Cross
        ctx.fillStyle = def.secondaryColor;
        ctx.fillRect(-sz * 0.12, -sz / 2, sz * 0.24, sz);
        ctx.fillRect(-sz / 2, -sz * 0.12, sz, sz * 0.24);
      } else {
        // Spherical Bauble or Transit/Tech Badge
        const orbGrad = ctx.createRadialGradient(
          -radius * 0.3,
          -radius * 0.3,
          radius * 0.1,
          0,
          0,
          radius
        );
        if (def.category === "classic") {
          orbGrad.addColorStop(0, def.secondaryColor);
          orbGrad.addColorStop(0.35, def.primaryColor);
          orbGrad.addColorStop(1, "#0f172a");
        } else {
          orbGrad.addColorStop(0, def.primaryColor);
          orbGrad.addColorStop(1, def.primaryColor);
        }

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = orbGrad;
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle =
          def.id === "mta-q"
            ? "#000000"
            : def.category === "tech"
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.35)";
        ctx.stroke();

        // Specular highlight
        ctx.beginPath();
        ctx.arc(-radius * 0.32, -radius * 0.32, radius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.fill();

        if (def.badgeText) {
          ctx.fillStyle = def.secondaryColor;
          ctx.font = `900 ${Math.round(radius * 0.85)}px Helvetica, Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(def.badgeText, 0, 1);
        }
      }

      ctx.restore();
    });

    // 9. Tree Topper at (W * 0.5, H * 0.14)
    const tx = W * 0.5;
    const ty = H * 0.135;
    ctx.save();
    ctx.translate(tx, ty);

    if (topper === "star") {
      ctx.beginPath();
      const spikes = 5;
      const outerR = 32;
      const innerR = 14;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const sx = Math.cos(angle) * r;
        const sy = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fillStyle = "#facc15";
      ctx.shadowColor = "#fde047";
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (topper === "snowflake") {
      ctx.strokeStyle = "#e0f2fe";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(0, 28);
        ctx.moveTo(-7, -18);
        ctx.lineTo(0, -12);
        ctx.lineTo(7, -18);
        ctx.stroke();
        ctx.restore();
      }
    } else if (topper === "q-bullet") {
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fillStyle = "#fccc0a";
      ctx.shadowColor = "#fccc0a";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1b5e20";
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.font = "900 28px Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Q", 0, 2);
    } else if (topper === "santa-hat") {
      ctx.beginPath();
      ctx.moveTo(-26, 14);
      ctx.quadraticCurveTo(-10, -28, 22, -12);
      ctx.quadraticCurveTo(30, -4, 28, 12);
      ctx.closePath();
      ctx.fillStyle = "#d90429";
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 8;
      ctx.fill();

      // White Brim
      ctx.beginPath();
      ctx.roundRect(-30, 8, 52, 12, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Pom-pom
      ctx.beginPath();
      ctx.arc(28, 14, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    } else if (topper === "nvd-badge") {
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ff6b35";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ff6b35";
      ctx.stroke();
      if (logoImgRef.current) {
        ctx.drawImage(logoImgRef.current, -20, -20, 40, 40);
      }
    }
    ctx.restore();

    // 10. Top Festive Header Text ("Happy Holidays from Next Val Data")
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "800 30px Atkinson, system-ui, -apple-system, sans-serif";
    const headlineColor = theme.textDark ? "#0f172a" : "#ffffff";
    ctx.fillStyle = headlineColor;
    ctx.shadowColor = theme.textDark ? "rgba(255,255,255,0.8)" : "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 10;
    ctx.fillText(greetingHeadline, W * 0.5, 48);

    if (greetingSubtitle.trim()) {
      ctx.font = "600 15px Atkinson, system-ui, -apple-system, sans-serif";
      ctx.fillStyle = theme.textDark ? "#334155" : "#fde68a";
      ctx.fillText(greetingSubtitle, W * 0.5, 74);
    }
    ctx.restore();

    // 11. Bottom Signature Card Footer with Official Next Val Data Logo
    const footerH = 86;
    const footerY = H - footerH;
    ctx.save();

    // Rich dark-green & gold trim postcard banner at the bottom
    const bannerGrad = ctx.createLinearGradient(0, footerY, W, H);
    bannerGrad.addColorStop(0, "#0f291e");
    bannerGrad.addColorStop(0.5, "#1b4332");
    bannerGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(0, footerY, W, footerH);

    // Gold top border line on footer
    ctx.fillStyle = "#d4af37";
    ctx.fillRect(0, footerY, W, 3);

    // Draw Next Val Data Logo inside a crisp circular badge on the left
    const logoCenterX = 56;
    const logoCenterY = footerY + footerH / 2 + 1;
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, 27, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#ff6b35";
    ctx.stroke();

    if (logoImgRef.current) {
      ctx.drawImage(logoImgRef.current, logoCenterX - 21, logoCenterY - 21, 42, 42);
    } else {
      ctx.fillStyle = "#ff6b35";
      ctx.font = "900 16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NVD", logoCenterX, logoCenterY);
    }

    // Brand Title: "Happy Holidays from Next Val Data"
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = "800 21px Atkinson, system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    const prefixText = "Happy Holidays from ";
    ctx.fillText(prefixText, 98, footerY + 38);
    const prefixW = ctx.measureText(prefixText).width;

    const nextText = "Next ";
    ctx.fillText(nextText, 98 + prefixW, footerY + 38);
    const nextW = ctx.measureText(nextText).width;

    ctx.fillStyle = "#ff6b35";
    const valText = "Val ";
    ctx.fillText(valText, 98 + prefixW + nextW, footerY + 38);
    const valW = ctx.measureText(valText).width;

    ctx.fillStyle = "#ffffff";
    ctx.fillText("Data", 98 + prefixW + nextW + valW, footerY + 38);

    // Sub-caption in footer
    ctx.font = "500 13px Atkinson, system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(
      "nextvaldata.com • Data Insights, Analytics & Technical Explorations",
      98,
      footerY + 61
    );

    // Decorative Holiday Stamp on Right
    ctx.textAlign = "right";
    ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = "#fde047";
    ctx.fillText("🎄 SEASONAL EDITION", W - 28, footerY + 40);
    ctx.fillStyle = "#86efac";
    ctx.fillText("BROOKLYN, NY", W - 28, footerY + 58);

    ctx.restore();
  }, [
    backdrop,
    snowCount,
    showTinsel,
    lightsStyle,
    ornaments,
    selectedPlacedId,
    topper,
    greetingHeadline,
    greetingSubtitle,
    logoLoaded,
  ]);

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  // Helper to convert mouse/touch event to normalized (0..1) canvas coords
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0.5, y: 0.5 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0.12, Math.min(0.84, (e.clientY - rect.top) / rect.height)),
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if user clicked an existing ornament (top-most first)
    for (let i = ornaments.length - 1; i >= 0; i--) {
      const o = ornaments[i];
      const dx = (o.x - x) * canvas.width;
      const dy = (o.y - y) * canvas.height;
      const dist = Math.hypot(dx, dy);
      if (dist <= 24 * o.scale) {
        setSelectedPlacedId(o.id);
        setDraggingId(o.id);
        return;
      }
    }

    // Otherwise place a new ornament at this position
    const newId = `orn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newOrnament: PlacedOrnament = {
      id: newId,
      typeId: selectedTool,
      x,
      y,
      scale: ornamentScale,
      rotation: selectedTool === "candy-cane" ? -10 : 0,
    };
    setOrnaments((prev) => [...prev, newOrnament]);
    setSelectedPlacedId(newId);
    setDraggingId(newId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingId) return;
    const { x, y } = getCanvasCoords(e);
    setOrnaments((prev) =>
      prev.map((o) => (o.id === draggingId ? { ...o, x, y } : o))
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggingId(null);
  };

  const handleAutoDecorate = () => {
    const spots = [
      { x: 0.49, y: 0.25 },
      { x: 0.45, y: 0.33 },
      { x: 0.55, y: 0.34 },
      { x: 0.41, y: 0.43 },
      { x: 0.5, y: 0.44 },
      { x: 0.59, y: 0.44 },
      { x: 0.37, y: 0.54 },
      { x: 0.46, y: 0.55 },
      { x: 0.54, y: 0.56 },
      { x: 0.63, y: 0.54 },
      { x: 0.33, y: 0.65 },
      { x: 0.43, y: 0.66 },
      { x: 0.52, y: 0.67 },
      { x: 0.6, y: 0.66 },
      { x: 0.67, y: 0.65 },
      { x: 0.39, y: 0.76 },
      { x: 0.61, y: 0.76 },
    ];
    const generated: PlacedOrnament[] = spots.map((pt, idx) => {
      const isBottomRow = pt.y > 0.72;
      const pool = isBottomRow
        ? ["gift-box"]
        : ORNAMENT_CATALOG.filter((c) => c.id !== "gift-box").map((c) => c.id);
      const randomType = pool[(idx * 3 + Math.floor(Math.random() * pool.length)) % pool.length];
      return {
        id: `auto-${Date.now()}-${idx}`,
        typeId: randomType,
        x: pt.x + (Math.random() - 0.5) * 0.02,
        y: pt.y + (Math.random() - 0.5) * 0.015,
        scale: isBottomRow ? 1.15 : 0.95 + (idx % 3) * 0.08,
        rotation: randomType === "candy-cane" ? -12 : 0,
      };
    });
    setOrnaments(generated);
    setSelectedPlacedId(null);
  };

  const handleRemoveSelected = () => {
    if (!selectedPlacedId) return;
    setOrnaments((prev) => prev.filter((o) => o.id !== selectedPlacedId));
    setSelectedPlacedId(null);
  };

  const handleDownloadCard = () => {
    // Re-draw without the dashed selection ring before exporting PNG
    const prevSelected = selectedPlacedId;
    setSelectedPlacedId(null);

    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "next-val-data-happy-holidays.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (prevSelected) setSelectedPlacedId(prevSelected);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Canvas Postcard */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#2e8b57] bg-slate-950 relative">
          <canvas
            ref={canvasRef}
            width={900}
            height={760}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="w-full h-auto block cursor-crosshair select-none"
          />
        </div>

        <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 bg-emerald-950/10 dark:bg-slate-800/80 border border-emerald-800/20 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium m-0">
            💡 <strong>Tip:</strong> Click anywhere on the tree to hang the selected ornament, or drag existing ornaments to rearrange them.
          </p>
          <button
            type="button"
            onClick={handleDownloadCard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#1b4332] via-[#2e8b57] to-[#d90429] hover:brightness-110 shadow-lg transition-all cursor-pointer border border-[#d4af37]"
          >
            <span>📸</span> Download Holiday Card (PNG)
          </button>
        </div>
      </div>

      {/* Right Column: Decorator Controls */}
      <div className="lg:col-span-5 space-y-5 bg-white/90 dark:bg-slate-800/90 p-6 rounded-2xl border border-emerald-900/15 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white m-0">
            🎄 Tree Decorator Studio
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAutoDecorate}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              ✨ Auto-Decorate
            </button>
            <button
              type="button"
              onClick={() => {
                setOrnaments([]);
                setSelectedPlacedId(null);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* 1. Ornaments & Tech Badges */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            1. Select Ornament or Tech Badge (Click Tree to Place)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {ORNAMENT_CATALOG.map((orn) => {
              const active = selectedTool === orn.id;
              return (
                <button
                  key={orn.id}
                  type="button"
                  onClick={() => setSelectedTool(orn.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-[#2e8b57] ring-2 ring-[#2e8b57]/40 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                  }`}
                >
                  <span className="text-xl leading-none mb-1">{orn.icon}</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                    {orn.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 mt-3 pt-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Size:
              </span>
              <input
                type="range"
                min="0.7"
                max="1.45"
                step="0.05"
                value={ornamentScale}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setOrnamentScale(val);
                  if (selectedPlacedId) {
                    setOrnaments((prev) =>
                      prev.map((o) => (o.id === selectedPlacedId ? { ...o, scale: val } : o))
                    );
                  }
                }}
                className="w-full accent-[#2e8b57]"
              />
            </div>
            {selectedPlacedId && (
              <button
                type="button"
                onClick={handleRemoveSelected}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors cursor-pointer"
              >
                🗑️ Remove Selected
              </button>
            )}
          </div>
        </div>

        {/* 2. Tree Topper */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            2. Tree Topper
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {(
              [
                { id: "star", label: "⭐ Star" },
                { id: "nvd-badge", label: "🧡 NVD Logo" },
                { id: "q-bullet", label: "🚇 Q Train" },
                { id: "santa-hat", label: "🎅 Santa Cap" },
                { id: "snowflake", label: "❄️ Crystal" },
              ] as Array<{ id: TopperType; label: string }>
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopper(t.id)}
                className={`py-2 px-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  topper === t.id
                    ? "bg-[#2e8b57] text-white border-[#2e8b57] shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Backdrop & Lights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              3. Sky Backdrop
            </label>
            <select
              value={backdrop}
              onChange={(e) => setBackdrop(e.target.value as BackdropType)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
            >
              {Object.entries(BACKDROP_THEMES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              4. String Lights
            </label>
            <select
              value={lightsStyle}
              onChange={(e) => setLightsStyle(e.target.value as LightsStyle)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value="warm-gold">✨ Warm Candlelight Gold</option>
              <option value="festive-multi">🌈 Classic Multicolor</option>
              <option value="nvd-cyber">🧡 NextVal Orange &amp; Cyan</option>
              <option value="icy-blue">❄️ Brooklyn Frost Blue</option>
              <option value="off">Off</option>
            </select>
          </div>
        </div>

        {/* Tinsel & Snow Density */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showTinsel}
              onChange={(e) => setShowTinsel(e.target.checked)}
              className="rounded accent-[#2e8b57]"
            />
            Show Gold Tinsel Garland
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              ❄️ Snow:
            </span>
            <input
              type="range"
              min="0"
              max="140"
              value={snowCount}
              onChange={(e) => setSnowCount(parseInt(e.target.value, 10))}
              className="w-24 accent-[#2e8b57]"
            />
          </div>
        </div>

        {/* 5. Custom Card Greeting */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            5. Card Greeting Banner
          </label>
          <input
            type="text"
            value={greetingHeadline}
            onChange={(e) => setGreetingHeadline(e.target.value)}
            maxLength={48}
            placeholder="Happy Holidays from Next Val Data"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100"
          />
          <input
            type="text"
            value={greetingSubtitle}
            onChange={(e) => setGreetingSubtitle(e.target.value)}
            maxLength={70}
            placeholder="Optional sub-message..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300"
          />
        </div>
      </div>
    </div>
  );
}
