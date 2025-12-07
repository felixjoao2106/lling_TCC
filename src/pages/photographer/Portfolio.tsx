import DashboardLayout from "@/components/DashboardLayout";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Plus,
  X,
  Camera,
  Calendar,
  Settings,
  CreditCard,
  LayoutDashboard,
  ImagePlus
} from "lucide-react";
import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const sidebarItems = [
  { href: "/photographer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/photographer/portfolio", label: "Portfólio", icon: ImagePlus },
  { href: "/photographer/settings", label: "Configurações", icon: Settings },
  { href: "/photographer/services", label: "Serviços", icon: Camera },
  { href: "/photographer/checkouts", label: "Checkouts", icon: CreditCard },
];

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export default function Portfolio() {
  const [location] = useLocation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock portfolio items - seria substituído por dados reais do banco
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 1,
      title: "Casamento na Praia",
      description: "Ensaio de casamento ao pôr do sol",
      category: "Casamentos",
      imageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=400&q=80",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Ensaio Família",
      description: "Sessão de fotos em família no parque",
      category: "Família",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
      createdAt: "2024-01-10",
    },
  ]);

  const uploadMutation = trpc.portfolio.create.useMutation({
    onSuccess: () => {
      toast.success("Foto adicionada ao portfólio!");
      setIsUploadOpen(false);
      resetForm();
      // Recarregar a página para mostrar a nova foto
      window.location.reload();
    },
    onError: (error: { message: string }) => {
      toast.error("Erro ao fazer upload: " + error.message);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ title: "", description: "", category: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setUploading(true);
    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await uploadMutation.mutateAsync({
          title: formData.title,
          description: formData.description || undefined,
          base64,
          mimeType: selectedFile.type,
        });
        setUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    toast.success("Foto removida do portfólio");
  };

  const isActive = (href: string) => location.startsWith(href);

  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Painel do Fotógrafo</h2>
            <p className="text-sm text-gray-500">Gerencie seu perfil</p>
          </div>
          <nav className="px-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      isActive(item.href)
                        ? "bg-[#338dfb] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#eefafb]">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meu Portfólio</h1>
                <p className="text-gray-500 mt-1">Gerencie suas fotos e trabalhos</p>
              </div>
              
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#338dfb] hover:bg-[#2a7de0]">
                    <Plus className="h-5 w-5 mr-2" />
                    Adicionar Foto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Adicionar ao Portfólio</DialogTitle>
                    <DialogDescription>
                      Faça upload de uma nova foto para seu portfólio
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleUpload} className="space-y-4 mt-4">
                    {/* Upload Area */}
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        previewUrl ? "border-[#338dfb] bg-[#338dfb]/5" : "border-gray-300 hover:border-[#338dfb]"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {previewUrl ? (
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              resetForm();
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">Clique para selecionar uma imagem</p>
                          <p className="text-sm text-gray-400 mt-1">PNG, JPG ou WEBP (máx. 10MB)</p>
                        </>
                      )}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Casamento na Praia"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casamentos">Casamentos</SelectItem>
                          <SelectItem value="Ensaios">Ensaios</SelectItem>
                          <SelectItem value="Eventos">Eventos</SelectItem>
                          <SelectItem value="Família">Família</SelectItem>
                          <SelectItem value="Corporativo">Corporativo</SelectItem>
                          <SelectItem value="Newborn">Newborn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva brevemente este trabalho..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsUploadOpen(false);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#338dfb] hover:bg-[#2a7de0]"
                        disabled={uploading || !selectedFile}
                      >
                        {uploading ? "Enviando..." : "Adicionar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Portfolio Grid */}
            {portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs bg-[#338dfb]/10 text-[#338dfb] px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma foto ainda</h3>
                <p className="text-gray-500 mb-6">Comece adicionando fotos ao seu portfólio</p>
                <Button 
                  className="bg-[#338dfb] hover:bg-[#2a7de0]"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Primeira Foto
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
