import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Camera,
  DollarSign,
  Users,
  Calendar,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const benefits = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Alcance Milhares de Clientes",
    description: "Conecte-se com pessoas buscando fotógrafos em sua região."
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Gerencie sua Agenda",
    description: "Sistema integrado de agendamentos e disponibilidade."
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Receba Pagamentos Seguros",
    description: "Transações protegidas e repasses garantidos."
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Construa sua Reputação",
    description: "Avaliações de clientes ajudam a destacar seu trabalho."
  }
];

const steps = [
  { number: 1, title: "Crie sua conta", description: "Cadastre-se gratuitamente na plataforma" },
  { number: 2, title: "Complete seu perfil", description: "Adicione suas informações e portfólio" },
  { number: 3, title: "Defina seus serviços", description: "Configure preços e disponibilidade" },
  { number: 4, title: "Comece a receber clientes", description: "Seja encontrado e feche negócios" }
];

const specialties = [
  "Casamentos",
  "Ensaios",
  "Eventos",
  "Corporativo",
  "Produtos",
  "Família",
  "Newborn",
  "Moda",
  "Arquitetura",
  "Gastronomia"
];

export default function BecomePhotographer() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    specialty: "",
    hourlyRate: "",
    yearsExperience: "",
    bio: ""
  });

  const becomePhotographerMutation = trpc.user.becomePhotographer.useMutation({
    onSuccess: () => {
      toast.success("Parabéns! Você agora é um fotógrafo na plataforma!");
      navigate(`/profile/${user?.id}`);
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar. Tente novamente.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.specialty || !formData.hourlyRate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    becomePhotographerMutation.mutate({
      specialty: formData.specialty,
      hourlyRate: Number(formData.hourlyRate),
      yearsExperience: formData.yearsExperience ? Number(formData.yearsExperience) : undefined,
      bio: formData.bio || undefined
    });
  };

  // If user is already a photographer
  if (isAuthenticated && user?.isPhotographer) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Você já é um fotógrafo!</h2>
          <p className="text-muted-foreground mb-6">
            Acesse seu dashboard para gerenciar seu perfil e agendamentos.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Ir para Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Camera className="w-4 h-4" />
              Para Fotógrafos
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Transforme sua paixão em{" "}
              <span className="gradient-text">negócio</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se à maior comunidade de fotógrafos do Brasil. Mostre seu trabalho, 
              conquiste novos clientes e gerencie seus agendamentos em um só lugar.
            </p>

            {!isAuthenticated && (
              <Button size="lg" className="h-14 px-8 rounded-xl" asChild>
                <a href={getLoginUrl()}>
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            Por que se cadastrar no Lling?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-card p-6 rounded-xl card-shadow text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            Como funciona
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.number}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      {isAuthenticated && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-xl p-8 card-shadow">
                <h2 className="text-2xl font-display font-bold mb-6 text-center">
                  Complete seu cadastro como fotógrafo
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade Principal *</Label>
                    <Select 
                      value={formData.specialty} 
                      onValueChange={(value) => setFormData({...formData, specialty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Valor por Hora (R$) *</Label>
                    <Input 
                      id="hourlyRate"
                      type="number"
                      placeholder="Ex: 150"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Anos de Experiência</Label>
                    <Input 
                      id="yearsExperience"
                      type="number"
                      placeholder="Ex: 5"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Sobre Você</Label>
                    <Textarea 
                      id="bio"
                      placeholder="Conte um pouco sobre sua experiência e estilo de trabalho..."
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Tornar-me Fotógrafo"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA for non-authenticated */}
      {!isAuthenticated && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Crie sua conta gratuitamente e comece a receber clientes hoje mesmo.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-xl" asChild>
                <a href={getLoginUrl()}>
                  Criar Minha Conta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
