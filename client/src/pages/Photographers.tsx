import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Camera,
  MessageSquare,
  CheckCircle,
  Heart,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Photographers() {
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialQuery = params.get("q") || "";
  const initialCategory = params.get("category") || "";
  const initialLocation = params.get("location") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const { isAuthenticated } = useAuth();

  // Buscar fotógrafos do banco de dados
  const { data: photographers, isLoading, refetch } = trpc.photographers.list.useQuery({
    limit: 50,
    offset: 0,
  });

  // Buscar categorias do banco de dados
  const { data: categories } = trpc.categories.list.useQuery();

  // Mutation para seguir/deixar de seguir
  const toggleFollowMutation = trpc.follows.toggle.useMutation({
    onSuccess: (data, variables) => {
      if (data.following) {
        setFavoriteIds(prev => new Set(Array.from(prev).concat(variables.userId)));
        toast.success("Adicionado aos favoritos!");
      } else {
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(variables.userId);
          return newSet;
        });
        toast.success("Removido dos favoritos");
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar favoritos");
    },
  });

  const handleFavorite = (photographerId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Faça login para favoritar");
      navigate("/auth");
      return;
    }
    
    toggleFollowMutation.mutate({ userId: photographerId });
  };

  // Filtrar fotógrafos
  const filteredPhotographers = photographers?.filter((p: any) => {
    const matchesQuery = !searchQuery || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      p.specialty?.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesLocation = !locationFilter || 
      p.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesQuery && matchesCategory && matchesLocation;
  }) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Fotógrafos</h1>
            <p className="text-muted-foreground">
              Encontre o profissional ideal para seu projeto
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou especialidade..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 md:max-w-xs">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Localização..."
                className="pl-10"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#338dfb]" />
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <>
            <p className="text-muted-foreground mb-6">
              {filteredPhotographers.length} fotógrafo(s) encontrado(s)
            </p>

            <div className="grid gap-6">
              {filteredPhotographers.map((photographer: any) => (
                <div 
                  key={photographer.id} 
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar e Info Principal */}
                    <div className="flex gap-4 flex-1">
                      <Avatar className="h-20 w-20 border-2 border-[#338dfb]/20">
                        <AvatarImage src={photographer.avatarUrl || undefined} />
                        <AvatarFallback className="bg-[#338dfb] text-white text-2xl">
                          {photographer.name?.charAt(0) || "F"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{photographer.name}</h3>
                          {photographer.isVerified && (
                            <CheckCircle className="h-5 w-5 text-[#338dfb]" />
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Badge variant="secondary" className="bg-[#338dfb]/10 text-[#338dfb]">
                            {photographer.specialty || "Fotógrafo"}
                          </Badge>
                          {photographer.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {photographer.location}
                            </span>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {photographer.bio || "Fotógrafo profissional disponível para contratação."}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">5.0</span>
                            <span className="text-muted-foreground text-sm">(Novo)</span>
                          </div>
                          {photographer.hourlyRate && (
                            <span className="text-[#338dfb] font-semibold">
                              R$ {photographer.hourlyRate}/hora
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-48">
                      <Button 
                        className="bg-[#338dfb] hover:bg-[#2a7de0]"
                        asChild
                      >
                        <Link href={`/profile/${photographer.id}?action=book`}>
                          Contratar
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/profile/${photographer.id}`}>
                          Ver Perfil
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => handleFavorite(photographer.id, e)}
                          disabled={toggleFollowMutation.isPending}
                          className={favoriteIds.has(photographer.id) ? "text-red-500" : ""}
                        >
                          <Heart 
                            className={`h-4 w-4 ${favoriteIds.has(photographer.id) ? "fill-red-500" : ""}`} 
                          />
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/messages?to=${photographer.id}`}>
                            <MessageSquare className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPhotographers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum fotógrafo encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar os filtros ou buscar por outro termo
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setLocationFilter("");
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </>
        )}

        {/* Botão Voltar no final */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Início
          </Button>
        </div>
      </div>
    </Layout>
  );
}
