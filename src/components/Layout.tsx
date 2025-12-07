import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Home,
  Compass,
  Camera,
  Calendar,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Heart,
  Star,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { useState, ReactNode } from "react";
import { trpc } from "@/lib/trpc";

interface LayoutProps {
  children: ReactNode;
}

// Componente de notificações que busca mensagens não lidas
function NotificationBell() {
  const { data: conversations } = trpc.messages.myConversations.useQuery(undefined, {
    refetchInterval: 10000, // Atualizar a cada 10 segundos
  });

  // Contar total de mensagens não lidas
  const unreadCount = conversations?.reduce((acc: number, conv: any) => {
    return acc + (conv.unreadCount || 0);
  }, 0) || 0;

  return (
    <Link href="/messages">
      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/explore", label: "Explorar", icon: Compass },
    { href: "/photographers", label: "Fotógrafos", icon: Camera },
  ];

  const authNavItems = [
    { href: "/bookings", label: "Agendamentos", icon: Calendar },
    { href: "/messages", label: "Mensagens", icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eefafb]">
      {/* Header Azul */}
      <header className="sticky top-0 z-50 bg-[#338dfb] text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.jpeg" 
                alt="LLING" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-2xl font-display font-bold">LLING</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input 
                  placeholder="Buscar fotógrafos, categorias..."
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                  </Link>
                );
              })}

              {isAuthenticated && authNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              {isAuthenticated && <NotificationBell />}

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors">
                      <Avatar className="h-8 w-8 border-2 border-white/50">
                        <AvatarImage src={user?.avatarUrl || undefined} />
                        <AvatarFallback className="bg-white/20 text-white">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2 border-b">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/user/dashboard" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Meu Painel
                      </Link>
                    </DropdownMenuItem>
                    
                    {user?.isPhotographer && (
                      <DropdownMenuItem asChild>
                        <Link href="/photographer/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard Fotógrafo
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link href="/user/favorites" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/user/reviews" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Minhas Avaliações
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/user/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {!user?.isPhotographer && (
                      <DropdownMenuItem asChild>
                        <Link href="/become-photographer" className="flex items-center gap-2 text-[#338dfb]">
                          <Camera className="h-4 w-4" />
                          Seja um Fotógrafo
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/auth">Entrar</Link>
                  </Button>
                  <Button 
                    className="bg-white text-[#338dfb] hover:bg-white/90"
                    asChild
                  >
                    <Link href="/auth">Cadastrar</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>


        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2a7de0] border-t border-white/20">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? 'bg-white/20' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
              
              {isAuthenticated && authNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? 'bg-white/20' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#338dfb] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo.jpeg" 
                  alt="LLING" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-2xl font-display font-bold">LLING</span>
              </Link>
              <p className="text-white/80 text-sm">
                Conectando fotógrafos talentosos a clientes que buscam eternizar seus momentos especiais.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Para Clientes</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="/photographers" className="hover:text-white">Encontrar Fotógrafos</Link></li>
                <li><Link href="/explore" className="hover:text-white">Explorar Portfólios</Link></li>
                <li><Link href="/bookings" className="hover:text-white">Meus Agendamentos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Para Fotógrafos</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="/become-photographer" className="hover:text-white">Cadastre-se</Link></li>
                <li><Link href="/photographer/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/photographer/services" className="hover:text-white">Gerenciar Serviços</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            <p>© 2025 Lling. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
