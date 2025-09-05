'use client';

import { useEffect } from 'react';
import { register } from '@/instrumentation';

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    register();
  }, []);

  return <>{children}</>;
}
