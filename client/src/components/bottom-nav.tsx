import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ClipboardList, Home, Settings } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="container flex justify-around py-2">
        <Link href="/">
          <Button variant={location === "/" ? "default" : "ghost"} size="icon">
            <Home className="w-5 h-5" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        <Link href="/new-inspection">
          <Button
            variant={location === "/new-inspection" ? "default" : "ghost"}
            size="icon"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="sr-only">Nova Inspeção</span>
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant={location === "/settings" ? "default" : "ghost"}
            size="icon"
          >
            <Settings className="w-5 h-5" />
            <span className="sr-only">Configurações</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
