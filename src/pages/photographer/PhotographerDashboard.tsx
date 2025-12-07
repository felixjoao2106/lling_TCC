import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Settings,
  Plus,
  Receipt,
  LogOut,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

const sidebarItems = [
  { href: "/photographer/dashboard", label: "Agendamentos", icon: Calendar },
  { 
    href: "/photographer/settings", 
    label: "Configurações da Empresa", 
    icon: Settings,
    children: [
      { href: "/photographer/settings/general", label: "Informações Gerais" },
      { href: "/photographer/settings/category", label: "Categoria" },
      { href: "/photographer/settings/images", label: "Imagens" },
      { href: "/photographer/settings/team", label: "Integrantes" },
      { href: "/photographer/settings/location", label: "Localização" },
    ]
  },
  { href: "/photographer/services", label: "Adicionar Serviço", icon: Plus },
  { href: "/photographer/checkouts", label: "Checkouts", icon: Receipt },
];

// Mock data
const mockStats = {
  totalViews: 12450,
  totalBookings: 47,
  monthlyEarnings: 8750,
  pendingBookings: 3
};

const mockBookings = [
  { 
    id: 1, 
    clientName: "Maria Fernanda", 
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    service: "Ensaio Pré-Wedding", 
    date: "2025-01-15", 
    time: "14:00",
    duration: "2h",
    value: 500,
    status: "pending" 
  },
  { 
    id: 2, 
    clientName: "Pedro Henrique", 
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    service: "Cobertura de Evento", 
    date: "2025-01-22", 
    time: "19:00",
    duration: "4h",
    value: 800,
    status: "confirmed" 
  },
  { 
    id: 3, 
    clientName: "Juliana Costa", 
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    service: "Ensaio Família", 
    date: "2025-01-28", 
    time: "10:00",
    duration: "2h",
    value: 360,
    status: "pending" 
  }
];

export default function PhotographerDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Camera className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para acessar</h2>
          <p className="text-muted-foreground mb-6">Acesse sua conta de fotógrafo</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!user?.isPhotographer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Camera className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Você não é um fotógrafo</h2>
          <p className="text-muted-foreground mb-6">Cadastre-se como fotógrafo para acessar o dashboard</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <Link href="/become-photographer">Tornar-me Fotógrafo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar 
        items={sidebarItems} 
        title="Dashboard"
        subtitle="Fotógrafo"
      />

      {/* Main Content */}
      <main className="flex-1 bg-[#eefafb] p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Olá, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus agendamentos e serviços</p>
          </div>
          <Button className="bg-[#338dfb] hover:bg-[#2a7de0] gap-2">
            <Plus className="h-4 w-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<Eye className="h-6 w-6" />}
            label="Visualizações"
            value={mockStats.totalViews.toLocaleString()}
            trend="+12%"
            color="blue"
          />
          <StatCard 
            icon={<Calendar className="h-6 w-6" />}
            label="Agendamentos"
            value={mockStats.totalBookings.toString()}
            trend="+5%"
            color="purple"
          />
          <StatCard 
            icon={<DollarSign className="h-6 w-6" />}
            label="Ganhos do Mês"
            value={`R$ ${mockStats.monthlyEarnings.toLocaleString()}`}
            trend="+18%"
            color="green"
          />
          <StatCard 
            icon={<AlertCircle className="h-6 w-6" />}
            label="Pendentes"
            value={mockStats.pendingBookings.toString()}
            color="amber"
          />
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Próximos Agendamentos</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Diário</Button>
              <Button variant="outline" size="sm">Semanal</Button>
            </div>
          </div>

          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend?: string;
  color: 'blue' | 'purple' | 'green' | 'amber';
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const statusConfig = {
    pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
    confirmed: { label: "Confirmado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  };

  const status = statusConfig[booking.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <Avatar className="h-12 w-12">
        <AvatarImage src={booking.clientAvatar} />
        <AvatarFallback className="bg-[#338dfb] text-white">
          {booking.clientName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{booking.service}</h4>
          <Badge className={status.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{booking.clientName}</p>
        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
          <span>📅 {new Date(booking.date).toLocaleDateString('pt-BR')}</span>
          <span>🕐 {booking.time} ({booking.duration})</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="text-lg font-bold">R$ {booking.value}</p>
        <div className="flex gap-2">
          {booking.status === 'pending' && (
            <>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Confirmar</Button>
              <Button size="sm" variant="destructive">Cancelar</Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <Button size="sm" className="bg-[#338dfb] hover:bg-[#2a7de0]">Iniciar Checkout</Button>
          )}
        </div>
      </div>
    </div>
  );
}
