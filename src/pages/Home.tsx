import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Camera, 
  Calendar, 
  Star, 
  MapPin,
  ArrowRight,
  Heart,
  Shield,
  MessageSquare,
  CheckCircle,
  Sparkles,
  PartyPopper,
  Users,
  Briefcase,
  Baby,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

// Imagens do slideshow
const heroImages = [
  "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80",
];

// Categorias com ícones
const categories = [
  { id: 1, name: "Casamentos", icon: Heart },
  { id: 2, name: "Ensaios", icon: Camera },
  { id: 3, name: "Eventos", icon: PartyPopper },
  { id: 4, name: "Família", icon: Users },
  { id: 5, name: "Corporativo", icon: Briefcase },
  { id: 6, name: "Newborn", icon: Baby },
];

const howItWorks = [
  {
    icon: Search,
    title: "Busque",
    description: "Encontre fotógrafos por categoria, localização ou estilo"
  },
  {
    icon: Calendar,
    title: "Agende",
    description: "Escolha a data e horário que melhor se encaixam na sua agenda"
  },
  {
    icon: Camera,
    title: "Fotografe",
    description: "Aproveite sua sessão com um profissional qualificado"
  },
  {
    icon: Heart,
    title: "Receba",
    description: "Receba suas fotos editadas e prontas para compartilhar"
  }
];

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Buscar fotógrafos do banco de dados
  const { data: photographers } = trpc.photographers.list.useQuery({
    limit: 4,
    offset: 0,
  });

  // Buscar categorias do banco de dados
  const { data: dbCategories } = trpc.categories.list.useQuery();

  // Slideshow automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Função de busca
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (locationQuery) params.set("location", locationQuery);
    navigate(`/photographers?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Combinar categorias do banco com ícones
  const displayCategories = dbCategories?.map((cat: any) => {
    const staticCat = categories.find(c => c.name === cat.name);
    return {
      ...cat,
      icon: staticCat?.icon || Camera,
    };
  }) || categories;

  return (
    <Layout>
      {/* Hero Section com Slideshow */}
      <section className="relative bg-gradient-to-br from-[#338dfb] to-[#2a7de0] text-white py-20 lg:py-32 overflow-hidden">
        {/* Slideshow de imagens de fundo */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-20" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* Indicadores do slideshow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Setas de navegação */}
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Encontre o fotógrafo perfeito para seu momento especial
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Conectamos você aos melhores profissionais de fotografia do Brasil
            </p>
            
            {/* Search Bar Funcional */}
            <div className="bg-white rounded-2xl p-2 shadow-xl max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="O que você procura? (Ex: Casamento, Ensaio...)"
                    className="pl-12 h-12 border-0 text-gray-900 placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Onde? (Cidade ou Estado)"
                    className="pl-12 h-12 border-0 text-gray-900 placeholder:text-gray-500"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <Button 
                  className="h-12 px-8 bg-[#338dfb] hover:bg-[#2a7de0]"
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Explore por Categoria
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encontre o profissional ideal para cada tipo de ocasião
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayCategories.map((category: any) => {
              const Icon = category.icon;
              return (
                <Link key={category.id} href={`/photographers?category=${category.name}`}>
                  <div className="bg-[#eefafb] rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-[#338dfb]/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-8 w-8 text-[#338dfb]" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Photographers - Dados do Banco */}
      <section className="py-16 bg-[#eefafb]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Fotógrafos em Destaque
              </h2>
              <p className="text-muted-foreground">
                Profissionais bem avaliados prontos para atender você
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/photographers">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {photographers?.map((photographer: any) => (
              <div key={photographer.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Cover Image */}
                <div className="relative h-40 bg-gradient-to-br from-[#338dfb] to-[#64acfc]">
                  {photographer.coverImageUrl && (
                    <img 
                      src={photographer.coverImageUrl} 
                      alt={photographer.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 pt-0">
                  {/* Avatar */}
                  <div className="flex justify-center -mt-10 mb-3">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                      <AvatarImage src={photographer.avatarUrl || undefined} />
                      <AvatarFallback className="bg-[#338dfb] text-white text-2xl">
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

                    {/* Price */}
                    {photographer.hourlyRate && (
                      <p className="text-sm text-muted-foreground mt-2">
                        A partir de R$ {photographer.hourlyRate}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/profile/${photographer.id}`}>Ver Perfil</Link>
                    </Button>
                    <Button className="flex-1 bg-[#338dfb] hover:bg-[#2a7de0]" asChild>
                      <Link href={`/profile/${photographer.id}?action=book`}>Contratar</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link href="/photographers">
                Ver todos os fotógrafos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Contratar um fotógrafo profissional nunca foi tão fácil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#338dfb] flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="h-10 w-10 text-white" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-[#64acfc] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#338dfb] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Por que escolher o LLING?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profissionais Verificados</h3>
              <p className="text-white/80">
                Todos os fotógrafos passam por um processo de verificação
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat Direto</h3>
              <p className="text-white/80">
                Converse diretamente com o fotógrafo antes de contratar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagamento Seguro</h3>
              <p className="text-white/80">
                Pagamentos processados com segurança e garantia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#338dfb] to-[#64acfc] rounded-2xl p-8 md:p-12 text-center text-white">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold mb-4">
              É fotógrafo profissional?
            </h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Junte-se à nossa plataforma e alcance milhares de clientes em busca do seu talento
            </p>
            <Button size="lg" className="bg-white text-[#338dfb] hover:bg-white/90" asChild>
              <Link href="/become-photographer">
                Cadastre-se como Fotógrafo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
