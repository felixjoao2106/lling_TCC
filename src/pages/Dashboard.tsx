import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Camera,
  Calendar,
  DollarSign,
  Eye,
  Heart,
  TrendingUp,
  Plus,
  Settings,
  Image,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";

// Mock dashboard data
const dashboardData = {
  stats: {
    totalViews: 12450,
    totalLikes: 3420,
    totalBookings: 47,
    monthlyEarnings: 8750
  },
  recentBookings: [
    { id: 1, clientName: "Maria Fernanda", clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80", title: "Ensaio Pré-Wedding", date: "2025-01-15", status: "confirmed" },
    { id: 2, clientName: "Pedro Henrique", clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80", title: "Cobertura de Evento", date: "2025-01-22", status: "pending" },
    { id: 3, clientName: "Juliana Costa", clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", title: "Ensaio Família", date: "2025-01-28", status: "confirmed" }
  ],
  topPortfolio: [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=300&q=80", title: "Casamento na Praia", views: 1520, likes: 234 },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80", title: "Cerimônia ao Pôr do Sol", views: 980, likes: 189 },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80", title: "Ensaio Pré-Wedding", views: 2100, likes: 298 }
  ]
};

const statusConfig = {
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  confirmed: { label: "Confirmado", color: "bg-green-100 text-green-700", icon: CheckCircle }
};

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para acessar o Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Acesse sua conta para gerenciar seu perfil de fotógrafo
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!user?.isPhotographer) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Você ainda não é um fotógrafo</h2>
          <p className="text-muted-foreground mb-6">
            Cadastre-se como fotógrafo para acessar o Dashboard
          </p>
          <Button asChild>
            <Link href="/become-photographer">Tornar-me Fotógrafo</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, {user?.name?.split(' ')[0]}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Link>
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Foto
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{dashboardData.stats.totalViews.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Visualizações</p>
          </div>

          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{dashboardData.stats.totalLikes.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Curtidas</p>
          </div>

          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{dashboardData.stats.totalBookings}</p>
            <p className="text-sm text-muted-foreground">Agendamentos</p>
          </div>

          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">R$ {dashboardData.stats.monthlyEarnings.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Ganhos do Mês</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Próximos Agendamentos</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/bookings">Ver todos</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {dashboardData.recentBookings.map((booking) => {
                  const status = statusConfig[booking.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <Avatar>
                        <AvatarImage src={booking.clientAvatar} />
                        <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.title}</h4>
                        <p className="text-sm text-muted-foreground">{booking.clientName}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(booking.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Portfolio */}
          <div>
            <div className="bg-card rounded-xl p-6 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Fotos em Destaque</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/profile/${user?.id}`}>Ver todas</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {dashboardData.topPortfolio.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {item.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl p-6 card-shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Image className="w-4 h-4 mr-2" />
                  Adicionar ao Portfólio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Gerenciar Disponibilidade
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Configurar Preços
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
