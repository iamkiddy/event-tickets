'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      theme="light"
      closeButton
      richColors
      expand={false}
      duration={2000}
      style={{
        zIndex: 9999
      }}
    />
  );
}
