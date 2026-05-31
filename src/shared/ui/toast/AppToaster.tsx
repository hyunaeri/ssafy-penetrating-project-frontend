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
      closeButton={false}
      expand={false}
      visibleToasts={2}
      toastOptions={{
        unstyled: true,
      }}
    />
  );
}
