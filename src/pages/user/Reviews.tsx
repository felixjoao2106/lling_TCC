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
  Edit,
  Trash2,
  Camera
} from "lucide-react";

const sidebarItems = [
  { href: "/user/dashboard", label: "Agendamentos", icon: Calendar },
  { href: "/user/favorites", label: "Favoritos", icon: Heart },
  { href: "/user/reviews", label: "Avaliações", icon: Star },
  { href: "/user/settings", label: "Configurações", icon: Settings },
];

// Mock data
const mockReviews = [
  {
    id: 1,
    photographerName: "Ana Silva",
    photographerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    service: "Ensaio Pré-Wedding",
    rating: 5,
    comment: "Trabalho incrível! A Ana capturou momentos lindos do nosso ensaio. Super recomendo!",
    date: "2024-11-25"
  },
  {
    id: 2,
    photographerName: "Carlos Santos",
    photographerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    service: "Cobertura de Evento",
    rating: 4,
    comment: "Ótimo profissional, muito atencioso. As fotos ficaram muito boas.",
    date: "2024-10-15"
  },
  {
    id: 3,
    photographerName: "Maria Costa",
    photographerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    service: "Ensaio Família",
    rating: 5,
    comment: "Perfeito! Conseguiu deixar todos à vontade, inclusive as crianças. Fotos maravilhosas!",
    date: "2024-09-20"
  }
];

export default function Reviews() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Star className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para acessar</h2>
          <p className="text-muted-foreground mb-6">Acesse sua conta para ver suas avaliações</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Minhas Avaliações</h1>
          <p className="text-muted-foreground mt-1">Histórico de avaliações que você fez</p>
        </div>

        {/* Reviews List */}
        {mockReviews.length > 0 ? (
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Photographer Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.photographerAvatar} />
                      <AvatarFallback className="bg-[#338dfb] text-white">
                        {review.photographerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{review.photographerName}</h3>
                      <p className="text-sm text-muted-foreground">{review.service}</p>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:flex-col">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma avaliação ainda</h3>
            <p className="text-muted-foreground mb-6">Após concluir um serviço, você poderá avaliar o fotógrafo</p>
          </div>
        )}
      </main>
    </div>
  );
}
