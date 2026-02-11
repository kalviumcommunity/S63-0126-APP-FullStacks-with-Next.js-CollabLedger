"use client";

import { Button } from "@/components";

export default function DashboardActions() {
  return (
    <div className="mt-8 flex gap-3">
      <Button
        label="Refresh Metrics"
        variant="primary"
        onClick={() => window.location.reload()}
      />
      <Button
        label="View API"
        variant="secondary"
        onClick={() => window.open("/api/health", "_blank")}
      />
    </div>
  );
}
