import { useAuth } from "@/_core/hooks/useAuth";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Settings,
  Heart,
  Star,
  MapPin,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const sidebarItems = [
  { href: "/user/dashboard", label: "Agendamentos", icon: Calendar },
  { href: "/user/favorites", label: "Favoritos", icon: Heart },
  { href: "/user/reviews", label: "Avaliações", icon: Star },
  { href: "/user/settings", label: "Configurações", icon: Settings },
];

export default function Favorites() {
  const { user, isAuthenticated } = useAuth();
  
  // Buscar fotógrafos que o usuário segue (favoritos)
  const { data: photographers, isLoading, refetch } = trpc.photographers.list.useQuery(
    { limit: 50, offset: 0 },
    { enabled: isAuthenticated }
  );

  const toggleFollowMutation = trpc.follows.toggle.useMutation({
    onSuccess: (data) => {
      if (!data.following) {
        toast.success("Removido dos favoritos");
        refetch();
      }
    },
    onError: () => {
      toast.error("Erro ao remover dos favoritos");
    },
  });

  const handleUnfavorite = (photographerId: number) => {
    toggleFollowMutation.mutate({ userId: photographerId });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Heart className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para acessar</h2>
          <p className="text-muted-foreground mb-6">Acesse sua conta para ver seus favoritos</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <Link href="/auth">Entrar</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filtrar apenas fotógrafos favoritados (por enquanto mostra todos como exemplo)
  const favoritePhotographers = photographers || [];

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
          <h1 className="text-3xl font-display font-bold text-gray-900">Meus Favoritos</h1>
          <p className="text-muted-foreground mt-1">Fotógrafos que você salvou</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#338dfb]" />
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favoritePhotographers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePhotographers.map((photographer) => (
              <div key={photographer.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-br from-[#338dfb] to-[#64acfc]">
                  <button 
                    onClick={() => handleUnfavorite(photographer.id)}
                    disabled={toggleFollowMutation.isPending}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 pt-0">
                  {/* Avatar */}
                  <div className="flex justify-center -mt-8 mb-3">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                      <AvatarImage src={photographer.avatarUrl || undefined} />
                      <AvatarFallback className="bg-[#338dfb] text-white text-xl">
                        {photographer.name?.charAt(0) || "F"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{photographer.name}</h3>
                    <p className="text-[#338dfb] text-sm font-medium">{photographer.specialty || "Fotógrafo"}</p>
                    {photographer.location && (
                      <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {photographer.location}
                      </p>
                    )}
                    
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">5.0</span>
                      <span className="text-muted-foreground text-sm">(Novo)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/profile/${photographer.id}`}>Ver Perfil</Link>
                    </Button>
                    <Button className="flex-1 bg-[#338dfb] hover:bg-[#2a7de0]" asChild>
                      <Link href={`/messages?to=${photographer.id}`}>Mensagem</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
            <p className="text-muted-foreground mb-6">Explore fotógrafos e adicione aos seus favoritos</p>
            <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
              <Link href="/photographers">Explorar Fotógrafos</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
