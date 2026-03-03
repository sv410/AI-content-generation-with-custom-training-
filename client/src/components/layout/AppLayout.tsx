import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BrainCircuit, LayoutDashboard, Database, Zap, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/models", label: "My Models", icon: BrainCircuit },
    { href: "/generations", label: "Recent Generations", icon: Zap },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-t-0 border-b-0 border-l-0 hidden md:flex flex-col relative z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Cerebro</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith("/models") && item.href === "/models");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-white/10 text-white shadow-sm border border-white/5" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    initial={false}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white w-full transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden glass-panel border-b border-t-0 border-l-0 border-r-0 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">Cerebro</span>
          </div>
          {/* Simple mobile menu toggle could go here */}
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
