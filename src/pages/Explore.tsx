import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock data for portfolio items
const mockPortfolioItems = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=600&q=80", title: "Casamento na Praia", photographerName: "Ana Silva", photographerId: 1, likes: 234, views: 1520 },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80", title: "Cerimônia ao Pôr do Sol", photographerName: "Carlos Santos", photographerId: 2, likes: 189, views: 980 },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80", title: "Detalhes do Vestido", photographerName: "Maria Costa", photographerId: 3, likes: 156, views: 756 },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80", title: "Ensaio Pré-Wedding", photographerName: "João Oliveira", photographerId: 4, likes: 298, views: 2100 },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80", title: "Festa de 15 Anos", photographerName: "Paula Lima", photographerId: 5, likes: 145, views: 890 },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80", title: "Casamento no Campo", photographerName: "Ricardo Mendes", photographerId: 6, likes: 267, views: 1340 },
  { id: 7, imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80", title: "Noivos Felizes", photographerName: "Fernanda Rocha", photographerId: 7, likes: 312, views: 1890 },
  { id: 8, imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", title: "Ensaio Família", photographerName: "Bruno Alves", photographerId: 8, likes: 178, views: 920 },
  { id: 9, imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80", title: "Retrato Artístico", photographerName: "Camila Dias", photographerId: 9, likes: 423, views: 2450 },
  { id: 10, imageUrl: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=600&q=80", title: "Ensaio Gestante", photographerName: "Lucas Ferreira", photographerId: 10, likes: 287, views: 1560 },
  { id: 11, imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80", title: "Book Profissional", photographerName: "Juliana Martins", photographerId: 11, likes: 198, views: 1120 },
  { id: 12, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", title: "Retrato Masculino", photographerName: "Pedro Souza", photographerId: 12, likes: 156, views: 890 },
];

const categories = ["Todos", "Casamentos", "Ensaios", "Eventos", "Retratos", "Família", "Corporativo"];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Randomize heights for Pinterest effect
  const getRandomHeight = (index: number) => {
    const heights = ['h-64', 'h-72', 'h-80', 'h-56', 'h-96'];
    return heights[index % heights.length];
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Explorar</h1>
          <p className="text-muted-foreground">Descubra trabalhos incríveis dos nossos fotógrafos</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full whitespace-nowrap ${
                selectedCategory === category ? 'bg-[#338dfb] hover:bg-[#2a7de0]' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {mockPortfolioItems.map((item, index) => (
            <div key={item.id} className="break-inside-avoid">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer">
                <Link href={`/profile/${item.photographerId}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className={`w-full object-cover ${getRandomHeight(index)}`}
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                      {/* Action buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLike(item.id);
                          }}
                          className={`p-2.5 rounded-full transition-colors ${
                            likedItems.has(item.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/90 hover:bg-white text-gray-700'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 transition-colors"
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate text-gray-900">{item.title}</h3>
                  <Link href={`/profile/${item.photographerId}`}>
                    <p className="text-xs text-[#338dfb] hover:underline mb-3">por {item.photographerName}</p>
                  </Link>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className={`w-3.5 h-3.5 ${likedItems.has(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            Carregar mais
          </Button>
        </div>
      </div>
    </Layout>
  );
}
