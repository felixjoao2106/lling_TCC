import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar,
  Settings,
  Plus,
  Receipt,
  Camera,
  Upload,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  MapPin
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

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

export default function PhotographerSettings() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  const [formData, setFormData] = useState({
    businessName: "Studio Ana Silva",
    phone: "(11) 99999-9999",
    email: "contato@anasilva.com",
    bio: "Fotógrafa profissional especializada em casamentos e ensaios. Mais de 10 anos de experiência capturando momentos especiais.",
    instagram: "@anasilva.foto",
    facebook: "anasilva.fotografia",
    linkedin: "anasilva-fotografa",
    website: "www.anasilva.com.br"
  });

  if (!isAuthenticated || !user?.isPhotographer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Settings className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">Apenas fotógrafos podem acessar esta página</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações salvas com sucesso!");
  };

  // Determine which settings page to show
  const settingsPage = location.split('/').pop();

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
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Configurações da Empresa</h1>
          <p className="text-muted-foreground mt-1">Gerencie as informações do seu negócio</p>
        </div>

        {/* Settings Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Link href="/photographer/settings/general">
            <Button variant={settingsPage === 'general' || settingsPage === 'settings' ? 'default' : 'outline'} 
                    className={settingsPage === 'general' || settingsPage === 'settings' ? 'bg-[#338dfb]' : ''}>
              Informações Gerais
            </Button>
          </Link>
          <Link href="/photographer/settings/category">
            <Button variant={settingsPage === 'category' ? 'default' : 'outline'}
                    className={settingsPage === 'category' ? 'bg-[#338dfb]' : ''}>
              Categoria
            </Button>
          </Link>
          <Link href="/photographer/settings/images">
            <Button variant={settingsPage === 'images' ? 'default' : 'outline'}
                    className={settingsPage === 'images' ? 'bg-[#338dfb]' : ''}>
              Imagens
            </Button>
          </Link>
          <Link href="/photographer/settings/team">
            <Button variant={settingsPage === 'team' ? 'default' : 'outline'}
                    className={settingsPage === 'team' ? 'bg-[#338dfb]' : ''}>
              Integrantes
            </Button>
          </Link>
          <Link href="/photographer/settings/location">
            <Button variant={settingsPage === 'location' ? 'default' : 'outline'}
                    className={settingsPage === 'location' ? 'bg-[#338dfb]' : ''}>
              Localização
            </Button>
          </Link>
        </div>

        {/* General Settings Form */}
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nome Comercial</Label>
                <Input 
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Nome do seu estúdio ou empresa"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Comercial</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@seusite.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Sobre</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você e seu trabalho..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="bg-[#338dfb] hover:bg-[#2a7de0]">
                Salvar Alterações
              </Button>
            </form>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Redes Sociais</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Instagram className="h-5 w-5" />
                </div>
                <Input 
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@seuinstagram"
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Facebook className="h-5 w-5" />
                </div>
                <Input 
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="seufacebook"
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Linkedin className="h-5 w-5" />
                </div>
                <Input 
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="seulinkedin"
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <Input 
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.seusite.com.br"
                  className="flex-1"
                />
              </div>

              <Button className="bg-[#338dfb] hover:bg-[#2a7de0]">
                Salvar Redes Sociais
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
