import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Settings,
  Heart,
  Star,
  LogOut,
  Camera,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "wouter";

const sidebarItems = [
  { href: "/user/dashboard", label: "Agendamentos", icon: Calendar },
  { href: "/user/favorites", label: "Favoritos", icon: Heart },
  { href: "/user/reviews", label: "Avaliações", icon: Star },
  { href: "/user/settings", label: "Configurações", icon: Settings },
];

// Mock data
const mockBookings = {
  inProgress: [
    { id: 1, photographer: "Ana Silva", service: "Ensaio Pré-Wedding", date: "2025-01-15", time: "14:00", location: "Parque Ibirapuera", value: 500, status: "confirmed" },
    { id: 2, photographer: "Carlos Santos", service: "Cobertura de Evento", date: "2025-01-22", time: "19:00", location: "Buffet Espaço Verde", value: 800, status: "pending" },
  ],
  completed: [
    { id: 3, photographer: "Maria Costa", service: "Ensaio Família", date: "2024-11-20", time: "10:00", location: "Estúdio Luz Natural", value: 360, status: "completed" },
  ],
  cancelled: [
    { id: 4, photographer: "Paula Lima", service: "Ensaio Gestante", date: "2024-09-10", time: "16:00", location: "Praia de Copacabana", value: 440, status: "cancelled" },
  ]
};

export default function UserDashboard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Camera className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para acessar</h2>
          <p className="text-muted-foreground mb-6">Acesse sua conta para ver seus agendamentos</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <a href={getLoginUrl()}>Entrar</a>
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
        title="Meu Painel"
        subtitle={user?.name || "Usuário"}
      />

      {/* Main Content */}
      <main className="flex-1 bg-[#eefafb] p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Meus Agendamentos</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas sessões fotográficas</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatarUrl || undefined} />
              <AvatarFallback className="bg-[#338dfb] text-white">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Em Andamento */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#338dfb]" />
            Em Andamento ({mockBookings.inProgress.length})
          </h2>
          <div className="space-y-4">
            {mockBookings.inProgress.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showActions />
            ))}
          </div>
        </section>

        {/* Concluídos */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Concluídos ({mockBookings.completed.length})
          </h2>
          <div className="space-y-4">
            {mockBookings.completed.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showReview />
            ))}
          </div>
        </section>

        {/* Cancelados */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Cancelados ({mockBookings.cancelled.length})
          </h2>
          <div className="space-y-4">
            {mockBookings.cancelled.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function BookingCard({ booking, showActions, showReview }: { booking: any; showActions?: boolean; showReview?: boolean }) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700"
  };

  const statusLabels = {
    pending: "Pendente",
    confirmed: "Confirmado",
    completed: "Concluído",
    cancelled: "Cancelado"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{booking.service}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
              {statusLabels[booking.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p className="text-[#338dfb] font-medium mb-2">{booking.photographer}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>📅 {new Date(booking.date).toLocaleDateString('pt-BR')}</span>
            <span>🕐 {booking.time}</span>
            <span>📍 {booking.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <p className="text-2xl font-bold text-gray-900">R$ {booking.value}</p>
          <div className="flex gap-2 mt-4">
            {showActions && booking.status !== 'cancelled' && (
              <Button variant="destructive" size="sm">Cancelar</Button>
            )}
            {showReview && (
              <Button size="sm" className="bg-[#338dfb] hover:bg-[#2a7de0]">Avaliar</Button>
            )}
            <Button variant="outline" size="sm">Ver Detalhes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
