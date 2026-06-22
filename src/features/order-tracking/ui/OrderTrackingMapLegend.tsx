type LegendItemProps = {
  color: string;
  label: string;
};

function PinIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="18" viewBox="0 0 32 40" fill="none" aria-hidden>
      <path
        d="M16 1C9.4 1 4 6.4 4 13c0 8.4 12 24 12 24s12-15.6 12-24C28 6.4 22.6 1 16 1Z"
        fill={color}
        stroke="white"
        strokeWidth="2.2"
      />
      <circle cx="16" cy="13" r="4.5" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <li className="flex items-center gap-2">
      <PinIcon color={color} />
      <span className="text-[12px] font-semibold text-ink">{label}</span>
    </li>
  );
}

export function OrderTrackingMapLegend() {
  return (
    <div
      className="pointer-events-none absolute left-4 top-[4.5rem] z-20 rounded-2xl bg-white/92 px-3 py-2.5 shadow-soft backdrop-blur-sm"
      aria-label="지도 마커 안내"
    >
      <ul className="space-y-1.5">
        <LegendItem color="#2ac1bc" label="매장" />
        <LegendItem color="#2b2d42" label="집" />
      </ul>
    </div>
  );
}
