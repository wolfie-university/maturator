"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calculator, GraduationCap, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { href: "/trening", label: "Trening Tematyczny", icon: Calculator },
    { href: "/egzamin", label: "Symulator Matury", icon: GraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-80 transition-opacity">
          <div className="bg-indigo-600 text-white p-1.5 rounded-md">
            <Calculator className="w-5 h-5" />
          </div>
          Maturator
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-indigo-600",
                pathname.startsWith(route.href) ? "text-indigo-600" : "text-slate-600"
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
                <Menu className="w-6 h-6 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-lg font-medium p-2 rounded-lg hover:bg-slate-50 transition-colors",
                      pathname.startsWith(route.href) ? "text-indigo-600 bg-indigo-50" : "text-slate-600"
                    )}
                  >
                    <route.icon className="w-5 h-5" />
                    {route.label}
                  </Link>
                ))}
                <Button asChild className="w-full mt-4" onClick={() => setIsOpen(false)}>
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
