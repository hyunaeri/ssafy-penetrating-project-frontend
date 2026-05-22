"use client";

import { Toaster } from "sonner";

const TOASTER_OFFSET_TOP = 16;

export function AppToaster() {
  return (
    <Toaster
      className="app-toaster"
      position="top-center"
      offset={TOASTER_OFFSET_TOP}
      gap={10}
      duration={3200}
      closeButton
      expand={false}
      visibleToasts={2}
      toastOptions={{
        unstyled: true,
        classNames: {
          closeButton:
            "!absolute !right-2.5 !top-3 !left-auto !border-0 !bg-transparent !text-inherit !opacity-45 hover:!opacity-80",
        },
      }}
    />
  );
}
