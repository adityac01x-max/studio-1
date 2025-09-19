

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  ListChecks,
  Shield,
  Menu,
  Search,
  LogOut,
  Building,
  Plane,
  Train,
  Bus,
  Hotel,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { SosButton } from '@/components/sos-button';
import { Chatbot } from '@/components/chatbot';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from './ui/separator';

const touristNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/itinerary-planner', label: 'Itinerary Planner', icon: ListChecks },
  { href: '/location', label: 'Location Explorer', icon: Map },
];

const bookingNavItems = [
    { href: '/accommodations', label: 'Accommodations', icon: Building },
    { href: '/flights', label: 'Flights', icon: Plane },
    { href: '/trains', label: 'Trains', icon: Train },
    { href: '/buses', label: 'Buses', icon: Bus },
];

const agencyNavItems = [
  { href: '/agency/dashboard', label: 'Agency Dashboard', icon: LayoutDashboard },
  { href: '/agency/accommodations', label: 'Manage Accommodations', icon: Hotel },
  { href: '/itinerary-planner', label: 'Itinerary Planner', icon: ListChecks },
  { href: '/location', label: 'Location Explorer', icon: Map },
];

const adminNavItems = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
];


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const isAgency = pathname.startsWith('/agency');
  const isAdmin = pathname.startsWith('/admin');

  const getNavItems = () => {
    if (isAdmin) return { primary: adminNavItems, secondary: [] };
    if (isAgency) return { primary: agencyNavItems, secondary: bookingNavItems };
    return { primary: touristNavItems, secondary: bookingNavItems };
  }
  const navItems = getNavItems();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/location/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const sidebarContent = (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.primary.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {navItems.secondary.length > 0 && (
             <SidebarMenu>
                <Separator className="my-2"/>
                 {navItems.secondary.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={{ children: item.label }}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        )}
      </SidebarContent>
       <SidebarFooter>
        <SidebarMenuItem>
          <Link href="/login">
            <SidebarMenuButton tooltip={{ children: 'Logout' }}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarFooter>
    </>
  );
  
  return (
    <SidebarProvider>
      <div className="relative min-h-screen">
        <Sidebar collapsible="icon">{sidebarContent}</Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/60 backdrop-blur-sm px-4 md:px-6">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <Sidebar>{sidebarContent}</Sidebar>
                </SheetContent>
              </Sheet>
            </div>

            <div className="w-full flex-1">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="w-full appearance-none bg-background pl-9 md:w-2/3 lg:w-1/3"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
        {!isAdmin && !isAgency && <SosButton />}
        {!isAdmin && !isAgency && <Chatbot />}
      </div>
    </SidebarProvider>
  );
}
