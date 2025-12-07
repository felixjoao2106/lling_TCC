import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera
} from "lucide-react";
import { Link } from "wouter";

// Mock bookings data
const mockBookings = {
  upcoming: [
    {
      id: 1,
      photographerName: "Ana Silva",
      photographerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      photographerId: 1,
      title: "Ensaio Pré-Wedding",
      date: "2025-01-15",
      time: "14:00",
      duration: 2,
      location: "Parque Ibirapuera, São Paulo",
      status: "confirmed",
      totalPrice: 500
    },
    {
      id: 2,
      photographerName: "Carlos Santos",
      photographerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      photographerId: 2,
      title: "Cobertura de Evento",
      date: "2025-01-22",
      time: "19:00",
      duration: 4,
      location: "Buffet Espaço Verde, São Paulo",
      status: "pending",
      totalPrice: 800
    }
  ],
  past: [
    {
      id: 3,
      photographerName: "Maria Costa",
      photographerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      photographerId: 3,
      title: "Ensaio Família",
      date: "2024-11-20",
      time: "10:00",
      duration: 2,
      location: "Estúdio Luz Natural",
      status: "completed",
      totalPrice: 360,
      hasReview: true
    },
    {
      id: 4,
      photographerName: "João Oliveira",
      photographerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      photographerId: 4,
      title: "Fotos Corporativas",
      date: "2024-10-15",
      time: "09:00",
      duration: 3,
      location: "Escritório Central",
      status: "completed",
      totalPrice: 900,
      hasReview: false
    }
  ],
  cancelled: [
    {
      id: 5,
      photographerName: "Paula Lima",
      photographerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      photographerId: 5,
      title: "Ensaio Gestante",
      date: "2024-09-10",
      time: "16:00",
      duration: 2,
      location: "Praia de Copacabana",
      status: "cancelled",
      totalPrice: 440
    }
  ]
};

const statusConfig = {
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  confirmed: { label: "Confirmado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  completed: { label: "Concluído", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle }
};

function BookingCard({ booking, showActions = false }: { booking: any, showActions?: boolean }) {
  const status = statusConfig[booking.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="bg-card rounded-xl p-6 card-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Photographer Info */}
        <div className="flex items-start gap-4 flex-1">
          <Link href={`/profile/${booking.photographerId}`}>
            <Avatar className="w-14 h-14 cursor-pointer">
              <AvatarImage src={booking.photographerAvatar} />
              <AvatarFallback>{booking.photographerName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{booking.title}</h3>
              <Badge className={status.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            
            <Link href={`/profile/${booking.photographerId}`}>
              <p className="text-sm text-primary hover:underline cursor-pointer">
                {booking.photographerName}
              </p>
            </Link>
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(booking.date).toLocaleDateString('pt-BR', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.time} ({booking.duration}h)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {booking.location}
              </span>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col items-end justify-between">
          <p className="text-xl font-bold">R$ {booking.totalPrice}</p>
          
          {showActions && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Mensagem
              </Button>
              {booking.status === 'pending' && (
                <Button variant="destructive" size="sm">
                  Cancelar
                </Button>
              )}
              {booking.status === 'completed' && !booking.hasReview && (
                <Button size="sm">
                  Avaliar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Bookings() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para ver seus agendamentos</h2>
          <p className="text-muted-foreground mb-6">
            Acesse sua conta para gerenciar suas sessões fotográficas
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Meus Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie suas sessões fotográficas</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Próximos ({mockBookings.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Anteriores ({mockBookings.past.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelados ({mockBookings.cancelled.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {mockBookings.upcoming.length > 0 ? (
              <div className="space-y-4">
                {mockBookings.upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions />
                ))}
              </div>
            ) : (
              <EmptyState message="Você não tem agendamentos próximos" />
            )}
          </TabsContent>

          <TabsContent value="past">
            {mockBookings.past.length > 0 ? (
              <div className="space-y-4">
                {mockBookings.past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions />
                ))}
              </div>
            ) : (
              <EmptyState message="Você não tem agendamentos anteriores" />
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {mockBookings.cancelled.length > 0 ? (
              <div className="space-y-4">
                {mockBookings.cancelled.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState message="Você não tem agendamentos cancelados" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 bg-card rounded-xl card-shadow">
      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6">
        Explore nossos fotógrafos e agende sua próxima sessão
      </p>
      <Button asChild>
        <Link href="/photographers">Encontrar Fotógrafos</Link>
      </Button>
    </div>
  );
}
