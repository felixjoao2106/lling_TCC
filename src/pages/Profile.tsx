import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Star, 
  Calendar,
  MessageSquare,
  Share2,
  Instagram,
  Globe,
  Phone,
  Mail,
  Heart,
  Eye,
  CheckCircle,
  Clock,
  Camera
} from "lucide-react";
import { useParams } from "wouter";
import { useState } from "react";

// Mock photographer data
const photographerData = {
  id: 1,
  name: "Ana Silva",
  specialty: "Fotógrafa de Casamentos",
  location: "São Paulo, SP",
  rating: 4.9,
  reviews: 127,
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  coverImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1600&q=80",
  hourlyRate: 250,
  bio: "Fotógrafa profissional há 8 anos, especializada em casamentos e eventos especiais. Minha paixão é capturar momentos únicos e transformá-los em memórias eternas. Trabalho com um estilo documental e artístico, buscando sempre a naturalidade e emoção de cada momento.",
  yearsExperience: 8,
  isVerified: true,
  followers: 1234,
  following: 567,
  instagram: "@anasilva.foto",
  website: "www.anasilvafotografia.com.br",
  phone: "(11) 99999-9999",
  email: "contato@anasilvafoto.com.br",
  portfolio: [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&q=80", title: "Casamento na Praia", likes: 234, views: 1520 },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80", title: "Cerimônia ao Pôr do Sol", likes: 189, views: 980 },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80", title: "Detalhes do Vestido", likes: 156, views: 756 },
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80", title: "Ensaio Pré-Wedding", likes: 298, views: 2100 },
    { id: 5, imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80", title: "Casamento no Campo", likes: 267, views: 1340 },
    { id: 6, imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80", title: "Noivos Felizes", likes: 312, views: 1890 },
  ],
  reviewsList: [
    { id: 1, author: "Maria Fernanda", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80", rating: 5, comment: "Ana foi incrível no nosso casamento! Capturou todos os momentos especiais com muita sensibilidade.", date: "2024-11-15" },
    { id: 2, author: "Pedro Henrique", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80", rating: 5, comment: "Profissional excepcional. As fotos ficaram lindas e ela foi muito atenciosa durante todo o evento.", date: "2024-10-28" },
    { id: 3, author: "Juliana Costa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", rating: 4, comment: "Muito satisfeita com o trabalho! Recomendo para quem busca qualidade.", date: "2024-10-10" },
  ]
};

export default function Profile() {
  const params = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const photographer = photographerData; // In real app, fetch by params.id
  const isOwnProfile = isAuthenticated && user?.id === Number(params.id);

  return (
    <Layout>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 to-secondary/20">
        <img 
          src={photographer.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex justify-center md:justify-start">
                <Avatar className="w-32 h-32 ring-4 ring-card -mt-20">
                  <AvatarImage src={photographer.avatar} />
                  <AvatarFallback className="text-3xl">{photographer.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-display font-bold">{photographer.name}</h1>
                  {photographer.isVerified && (
                    <Badge className="w-fit mx-auto md:mx-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                
                <p className="text-primary font-medium">{photographer.specialty}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {photographer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {photographer.yearsExperience} anos de experiência
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mt-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">{photographer.followers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{photographer.following.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Seguindo</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{photographer.portfolio.length}</p>
                    <p className="text-xs text-muted-foreground">Trabalhos</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold text-lg">{photographer.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({photographer.reviews} avaliações)</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">A partir de</p>
                <p className="text-2xl font-bold text-primary mb-4">R$ {photographer.hourlyRate}/hora</p>

                {!isOwnProfile && (
                  <>
                    <Button className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Sessão
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant={isFollowing ? "secondary" : "outline"} 
                        className="flex-1"
                        onClick={() => setIsFollowing(!isFollowing)}
                      >
                        {isFollowing ? "Seguindo" : "Seguir"}
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}

                {isOwnProfile && (
                  <Button variant="outline" className="w-full">
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="portfolio" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio">
                <div className="masonry-grid">
                  {photographer.portfolio.map((item) => (
                    <div key={item.id} className="masonry-item">
                      <div className="pin-card group cursor-pointer">
                        <div className="relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full object-cover rounded-t-xl"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-t-xl">
                            <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Heart className="w-5 h-5 text-secondary" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-card rounded-b-xl">
                          <h3 className="font-medium text-sm">{item.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" /> {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {item.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about">
                <div className="bg-card rounded-xl p-6 card-shadow">
                  <h3 className="font-semibold text-lg mb-4">Sobre mim</h3>
                  <p className="text-muted-foreground leading-relaxed">{photographer.bio}</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {photographer.reviewsList.map((review) => (
                    <div key={review.id} className="bg-card rounded-xl p-6 card-shadow">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{review.author}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-muted'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h3 className="font-semibold text-lg mb-4">Contato</h3>
              <div className="space-y-3">
                {photographer.instagram && (
                  <a href={`https://instagram.com/${photographer.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                    <Instagram className="w-4 h-4" />
                    {photographer.instagram}
                  </a>
                )}
                {photographer.website && (
                  <a href={`https://${photographer.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                    <Globe className="w-4 h-4" />
                    {photographer.website}
                  </a>
                )}
                {photographer.phone && (
                  <a href={`tel:${photographer.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                    <Phone className="w-4 h-4" />
                    {photographer.phone}
                  </a>
                )}
                {photographer.email && (
                  <a href={`mailto:${photographer.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                    <Mail className="w-4 h-4" />
                    {photographer.email}
                  </a>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h3 className="font-semibold text-lg mb-4">Serviços</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">Cobertura de Casamento</span>
                  <span className="font-semibold">R$ 3.500</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">Ensaio Pré-Wedding</span>
                  <span className="font-semibold">R$ 800</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">Ensaio Individual</span>
                  <span className="font-semibold">R$ 450</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Hora adicional</span>
                  <span className="font-semibold">R$ 250</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h3 className="font-semibold text-lg mb-4">Disponibilidade</h3>
              <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Disponível para agendamentos
              </div>
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Agenda
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
