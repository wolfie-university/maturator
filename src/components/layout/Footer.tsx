import Link from "next/link";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="w-full py-4 text-center text-foreground/20 text-sm border-t bg-background">
      <p>© 2025 Szymon Wilczek <br />
        <Button variant="link" asChild
          className="p-0 m-0 align-baseline text-foreground/20 hover:underline transition-opacity hover:opacity-80"
        >
          <Link
            href="https://github.com/wolfie-university/maturator"
            target="_blank"
            rel="noopener noreferrer"
          >
            Maturator - Projekt Open Source
          </Link>
        </Button>
      </p>
    </footer>
  );
}
