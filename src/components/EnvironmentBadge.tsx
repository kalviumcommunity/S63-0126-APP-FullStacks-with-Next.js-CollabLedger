'use client';

import { getPublicAppEnv } from '../lib/env.client';

export default function EnvironmentBadge() {
  const appEnv = getPublicAppEnv();

  return (
    <div className="rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide">
      Environment: {appEnv}
    </div>
  );
}
