import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Settings,
  Plus,
  Receipt,
  Camera,
  Edit,
  Trash2,
  Clock,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

// Mock existing services
const mockServices = [
  { id: 1, name: "Ensaio Pré-Wedding", duration: 2, price: 500, description: "Ensaio romântico para casais antes do casamento" },
  { id: 2, name: "Cobertura de Casamento", duration: 8, price: 3500, description: "Cobertura completa do seu grande dia" },
  { id: 3, name: "Ensaio Família", duration: 2, price: 360, description: "Fotos profissionais para toda a família" },
  { id: 4, name: "Ensaio Newborn", duration: 3, price: 600, description: "Fotos delicadas do seu bebê recém-nascido" },
];

export default function Services() {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState(mockServices);
  
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    durationUnit: "hours",
    price: "",
    description: ""
  });

  if (!isAuthenticated || !user?.isPhotographer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Plus className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">Apenas fotógrafos podem acessar esta página</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.duration || !formData.price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const newService = {
      id: services.length + 1,
      name: formData.name,
      duration: Number(formData.duration),
      price: Number(formData.price),
      description: formData.description
    };
    
    setServices([...services, newService]);
    setFormData({ name: "", duration: "", durationUnit: "hours", price: "", description: "" });
    setShowForm(false);
    toast.success("Serviço adicionado com sucesso!");
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    toast.success("Serviço removido");
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Meus Serviços</h1>
            <p className="text-muted-foreground mt-1">Gerencie os serviços que você oferece</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#338dfb] hover:bg-[#2a7de0] gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Add Service Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold mb-4">Adicionar Novo Serviço</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Ensaio/Serviço *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ensaio Pré-Wedding"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="2"
                      className="flex-1"
                    />
                    <Select 
                      value={formData.durationUnit} 
                      onValueChange={(value) => setFormData({ ...formData, durationUnit: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Horas</SelectItem>
                        <SelectItem value="minutes">Minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input 
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o que está incluso neste serviço..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#338dfb] hover:bg-[#2a7de0]">
                  Adicionar Serviço
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{service.duration}h</span>
                </div>
                <div className="flex items-center gap-1 text-[#338dfb] font-bold">
                  <DollarSign className="h-4 w-4" />
                  <span>R$ {service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
