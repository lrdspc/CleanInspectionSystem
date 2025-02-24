import { Link } from "wouter";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ClipboardList, Home, Layers, Settings } from "lucide-react";
import { BottomNav } from "./bottom-nav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarContent>
            <NavigationMenu orientation="vertical" className="w-full">
              <NavigationMenuList className="flex-col items-start">
                <NavigationMenuItem className="w-full">
                  <Link href="/">
                    <NavigationMenuLink className="flex items-center gap-2 w-full p-2 hover:bg-accent">
                      <Home className="w-4 h-4" />
                      <span>Início</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/new-inspection">
                    <NavigationMenuLink className="flex items-center gap-2 w-full p-2 hover:bg-accent">
                      <ClipboardList className="w-4 h-4" />
                      <span>Nova Inspeção</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                  <Link href="/settings">
                    <NavigationMenuLink className="flex items-center gap-2 w-full p-2 hover:bg-accent">
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">Sistema de Inspeção Técnica Brasilit</h1>
            </div>
            <main className="pb-16 md:pb-0">
              {children}
            </main>
          </div>
          <div className="md:hidden">
            <BottomNav />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}