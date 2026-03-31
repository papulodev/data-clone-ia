'use client';

import { Clone } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import OpenCreateClone from "./buttons/OpenCreateClone";
import OpenCompareClone from "./buttons/OpenCompareClone";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useCloneStore } from "@/store/useCloneStore";
import { LogOut } from "lucide-react";

export function SidebarApp() {
  const pathname = usePathname();
  const clones = useCloneStore((state) => state.clones);
  const { data: session } = useSession();
  const router = useRouter();

  const currentCloneId = pathname.startsWith('/clones/') ? pathname.split('/')[2] : null;

  const handleLogout = async () => {
    const response = await signOut();
    console.log(response);
    router.push('/login');
  }

  return (
    <Sidebar className="bg-sidebar border-r border-white/5">
      <SidebarHeader className="p-4 bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <path d="M12 2c-4.4 0-8 2.5-8 7s3.6 7 8 7 8-2.5 8-7-3.6-7-8-7z" />
              <path d="M12 22c4.4 0 8-2.5 8-7s-3.6-7-8-7" />
              <circle cx="12" cy="9" r="2" />
              <circle cx="8" cy="13" r="1.5" />
              <circle cx="16" cy="13" r="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="font-manrope font-bold text-lg text-foreground">
              DataClone
            </h1>
            <p className="text-xs text-muted-foreground">AI Digital Twins</p>
          </div>
        </Link>
      </SidebarHeader>
      <Separator className="bg-primary/20" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <OpenCompareClone clones={clones} />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <OpenCreateClone />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>
            Clones
            <Badge variant="secondary" className="text-xs ml-2">
              {clones.length}
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {clones.map((clone) => {
                const isSelected = currentCloneId === clone._id;
                return (
                  <SidebarMenuItem key={clone._id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/dashboard/clones/${clone._id}`} className={clsx("h-auto bg-primary/10 hover:bg-primary/60 cursor-pointer transition-colors duration-300 rounded-md", { isSelected: "bg-primary/40 text-primary transition-colors" })}>
                        <CloneListItem clone={clone} selected={isSelected} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {clones.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p>No hay clones aún</p>
                  <p className="text-xs mt-1">Creá uno para empezar</p>
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="bg-white/5" />
        <SidebarFooter className="bg-transparent p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground truncate">
            {session?.user?.email}
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleLogout}
            className="w-full cursor-pointer"
          >
            <LogOut />
            Cerrar sesión
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

function CloneListItem({
  clone,
  selected,
}: {
  clone: Clone;
  selected: boolean;
}) {
  return (
    <Card
      className="flex gap-3 px-4 py-3 w-full bg-transparent ring-0"
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {clone.nombre}
            </p>
            <p className="text-xs text-muted-foreground">
              {clone.edad} años • {clone.genero}
            </p>
          </div>

          <div className={`w-2 h-2 rounded-full ${selected ? "bg-green-400" : "bg-green-400/50"}`} />
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {clone.categorias.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0">
              {cat}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
