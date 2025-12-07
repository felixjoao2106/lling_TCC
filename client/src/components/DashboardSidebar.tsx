import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: { href: string; label: string }[];
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  title: string;
  subtitle?: string;
}

export default function DashboardSidebar({ items, title, subtitle }: DashboardSidebarProps) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    return location === href || location.startsWith(href + '/');
  };

  return (
    <aside className="w-64 bg-[#338dfb] text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-display font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-white/70 mt-1">{subtitle}</p>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <div key={item.href}>
              <Link href={item.href}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                    active 
                      ? "bg-white/20 text-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
              
              {/* Subitems */}
              {item.children && active && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      <button
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-lg text-sm transition-colors",
                          location === child.href
                            ? "bg-white/15 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {child.label}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <Link href="/">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <img src="/logo.png" alt="Lling" className="h-6 w-6" />
            <span className="font-medium">Voltar ao Lling</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
