'use client';

import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarApp } from '@/components/SidebarApp';
import { Toaster } from '@/components/ui/sonner';
import { useCloneStore } from '@/store/useCloneStore';
import { SessionProvider } from 'next-auth/react';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const fetchClones = useCloneStore((state) => state.fetchClones);

  useEffect(() => {
    fetchClones();
  }, [fetchClones]);

  return (
    <>
      <SidebarApp />
      {children}
    </>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
        <Toaster />
      </SidebarProvider>
    </SessionProvider>
  );
}

export default DashboardLayout;
