"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calculator, GraduationCap, InfoIcon, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { href: "/trening", label: "Trening Tematyczny", icon: Calculator },
    { href: "/egzamin", label: "Symulator Matury", icon: GraduationCap },
    { href: "/about", label: "O projekcie", icon: InfoIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-neutral-200 hover:opacity-80 transition-opacity"
        >
          <div className="bg-neutral-600 text-white p-1.5 rounded-md">
            <Calculator className="w-5 h-5" />
          </div>
          Maturator
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/30",
                pathname.startsWith(route.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {route.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-4">
            <Link href="/trening">Zacznij naukę</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-12 h-12 text-neutral-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Nawigacja mobilna
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 mx-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-lg font-medium p-2 rounded-lg hover:bg-foreground/70 hover:text-background transition-colors",
                      pathname.startsWith(route.href)
                        ? "bg-foreground text-background"
                        : "text-foreground/60"
                    )}
                  >
                    <route.icon className="w-5 h-5" />
                    {route.label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="mx-2 mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/trening">Zacznij naukę</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
