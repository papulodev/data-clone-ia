'use client';

import { useEffect, useState } from "react";
import { Clone, listarClones } from "@/lib/api";
import { SimulatorView } from "@/components/SimulatorView";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import BackgroundNebula from "@/components/BackgroundNebula";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SimulatePage({ params }: PageProps) {
  const [clone, setClone] = useState<Clone | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClone = async () => {
      const resolvedParams = await params;
      const res = await listarClones();
      if (res.ok) {
        const foundClone = res.clones.find((c: Clone) => c._id === resolvedParams.id);
        setClone(foundClone || null);
      }
      setLoading(false);
    };

    fetchClone();
  }, [params]);

  if (loading) {
    return (
      <SidebarInset className="overflow-hidden bg-surface text-on-surface selection:bg-primary/30">
        <BackgroundNebula />
        <SidebarTrigger size="icon-lg" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando simulador...</p>
        </div>
      </SidebarInset>
    );
  }

  if (!clone) {
    return (
      <SidebarInset className="overflow-hidden bg-surface text-on-surface selection:bg-primary/30">
        <BackgroundNebula />
        <SidebarTrigger size="icon-lg" />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground mb-4">Clon no encontrado</p>
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="overflow-hidden bg-surface text-on-surface selection:bg-primary/30">
      <BackgroundNebula />
      <SidebarTrigger size="icon-lg" />
      <SimulatorView clone={clone} onBack={() => router.push(`/clones/${clone._id}`)} />
    </SidebarInset>
  );
}
