"use client";

import { useState } from "react";
import { WelcomeModal } from "./welcome-modal";
import { DashboardTour } from "./dashboard-tour";

export function WelcomeModalHost() {
  const [open, setOpen] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <>
      <WelcomeModal
        open={open}
        onStartTour={() => {
          setOpen(false);
          setTourOpen(true);
        }}
        onSkip={() => setOpen(false)}
      />
      {tourOpen && <DashboardTour onClose={() => setTourOpen(false)} />}
    </>
  );
}
