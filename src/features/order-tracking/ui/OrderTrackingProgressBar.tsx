"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ORDER_TRACKING_STEPS } from "@/features/order-tracking/lib/order-tracking-steps";
import { OrderTrackingStepIcon } from "@/features/order-tracking/ui/OrderTrackingStepIcons";

type OrderTrackingProgressBarProps = {
  activeStep: number;
};

export function OrderTrackingProgressBar({
  activeStep,
}: OrderTrackingProgressBarProps) {
  const reduceMotion = useReducedMotion();
  const clampedStep = Math.max(0, Math.min(activeStep, ORDER_TRACKING_STEPS.length - 1));
  const progressRatio =
    ORDER_TRACKING_STEPS.length <= 1
      ? 0
      : clampedStep / (ORDER_TRACKING_STEPS.length - 1);

  return (
    <div className="px-1 pt-1">
      <div className="relative mx-2 mt-2">
        <div className="absolute left-4 right-4 top-[22px] h-[3px] rounded-full bg-line" />
        <motion.div
          className="absolute left-4 top-[22px] h-[3px] origin-left rounded-full bg-brand"
          initial={false}
          animate={{ width: `calc((100% - 32px) * ${progressRatio})` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 20 }
          }
        />

        {!reduceMotion && clampedStep < ORDER_TRACKING_STEPS.length - 1 && (
          <motion.div
            className="absolute top-[19px] h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(42,193,188,0.8)]"
            animate={{
              left: [
                `calc(16px + (100% - 32px) * ${Math.max(0, progressRatio - 0.08)})`,
                `calc(16px + (100% - 32px) * ${progressRatio})`,
              ],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <div className="relative flex justify-between">
          {ORDER_TRACKING_STEPS.map((step, index) => {
            const isActive = index === clampedStep;
            const isCompleted = index < clampedStep;
            const iconSize = isActive ? 24 : 22;
            const iconClass = isActive || isCompleted ? "text-white" : "text-muted";

            return (
              <div
                key={step.key}
                className="flex w-[56px] flex-col items-center gap-2"
              >
                <motion.div
                  className={`relative flex items-center justify-center rounded-full ring-2 ring-inset ${
                    isActive
                      ? "h-11 w-11 bg-brand text-white ring-brand/30"
                      : isCompleted
                        ? "h-10 w-10 bg-brand text-white ring-brand/20"
                        : "h-10 w-10 bg-white text-muted ring-line"
                  }`}
                  animate={
                    isActive && !reduceMotion
                      ? { scale: [1, 1.06, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isActive && !reduceMotion
                      ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.2 }
                  }
                >
                  {isActive && !reduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-brand/25"
                      animate={{ scale: [1, 1.4], opacity: [0.55, 0] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                  <OrderTrackingStepIcon
                    stepIndex={index}
                    size={iconSize}
                    className={iconClass}
                  />
                </motion.div>

                <motion.span
                  className={`text-center text-[11px] leading-tight ${
                    isActive
                      ? "font-bold text-brand-dark"
                      : isCompleted
                        ? "font-semibold text-brand-dark/80"
                        : "font-medium text-muted"
                  }`}
                  animate={isActive && !reduceMotion ? { y: [0, -1, 0] } : { y: 0 }}
                  transition={
                    isActive && !reduceMotion
                      ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.2 }
                  }
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
