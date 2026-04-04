import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DataClone AI — Gemelos Digitales de Clientes",
  description: "Crea perfiles de comportamiento, simulá decisiones y chateá con clones de IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      >
        <SessionProvider>
          <TooltipProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
            </ThemeProvider>
          </TooltipProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
