import Image from "next/image";
import { getOrderTrackingStatusImage } from "@/features/order-tracking/lib/order-tracking-status-images";

type OrderTrackingStepIconProps = {
  stepIndex: number;
  size?: number;
  className?: string;
};

function ConfirmedIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M9 5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 4.5h6a1.5 1.5 0 0 1 1.5 1.5V7H7.5V6A1.5 1.5 0 0 1 9 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.5 10.5 14.5 15 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function CookingIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M7.5 9.5c0-1.5 1-2.5 2.2-2.5M16.5 9.5c0-1.5-1-2.5-2.2-2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10.5h11l-.9 6.5H7.4l-.9-6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 17v1.5M12 17v1.5M15.5 17v1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 6.5c0 .8-.4 1.2-.4 1.2M12 5.8V7M14.9 6.5s-.4.4-.4 1.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeliveringIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="7" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 17h3.5l1.8-4.5h2l1.7 4.5H17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.5V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 8h5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.5 12.5h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 8.5v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompletedIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 12.2 11 14.7 15.8 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEP_ICONS = [
  ConfirmedIcon,
  CookingIcon,
  DeliveringIcon,
  CompletedIcon,
] as const;

export function OrderTrackingStepIcon({
  stepIndex,
  size = 24,
  className,
}: OrderTrackingStepIconProps) {
  const clamped = Math.max(0, Math.min(stepIndex, STEP_ICONS.length - 1));
  const Icon = STEP_ICONS[clamped]!;

  return <Icon size={size} className={className} />;
}

export function OrderTrackingStatusIcon({
  stepIndex,
  className,
}: {
  stepIndex: number;
  className?: string;
}) {
  const src = getOrderTrackingStatusImage(stepIndex);

  return (
    <div
      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[1.25rem] bg-[#FDF8ED] ring-1 ring-inset ring-brand/15 ${className ?? ""}`}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover p-1.5"
        sizes="72px"
        unoptimized
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
