import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";

type AuthMode = "signin" | "signup";
type UserType = "client" | "photographer";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a integração com o sistema de autenticação
    console.log("Form submitted:", { mode, userType, formData });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#338dfb] to-[#2a7de0] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/15"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="LLING" 
              className="h-12 w-auto rounded-lg"
            />
            <span className="text-3xl font-bold">LLING</span>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">
                Conectando momentos especiais através da fotografia
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Encontre os melhores fotógrafos ou mostre seu talento para milhares de clientes.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Fotógrafos verificados e avaliados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Agendamento fácil e seguro</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Chat direto com o profissional</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-white/60 text-sm">
            © 2025 LLING. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#eefafb]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img 
              src="/logo.jpeg" 
              alt="LLING" 
              className="h-12 w-auto rounded-lg"
            />
            <span className="text-3xl font-bold text-[#338dfb]">LLING</span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Tabs */}
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 pb-4 text-center font-semibold transition-colors ${
                  mode === "signup"
                    ? "text-[#338dfb] border-b-2 border-[#338dfb]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Cadastrar
              </button>
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 pb-4 text-center font-semibold transition-colors ${
                  mode === "signin"
                    ? "text-[#338dfb] border-b-2 border-[#338dfb]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Entrar
              </button>
            </div>

            {/* User Type Selection (only for signup) */}
            {mode === "signup" && !userType && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
                  Como você quer usar o LLING?
                </h2>
                
                <button
                  onClick={() => setUserType("client")}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#338dfb] hover:bg-[#338dfb]/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#338dfb]/10 flex items-center justify-center group-hover:bg-[#338dfb]/20 transition-colors">
                      <User className="h-7 w-7 text-[#338dfb]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Sou Cliente</h3>
                      <p className="text-sm text-gray-500">Quero contratar fotógrafos</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-[#338dfb] transition-colors" />
                  </div>
                </button>
                
                <button
                  onClick={() => setUserType("photographer")}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#338dfb] hover:bg-[#338dfb]/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#338dfb]/10 flex items-center justify-center group-hover:bg-[#338dfb]/20 transition-colors">
                      <Camera className="h-7 w-7 text-[#338dfb]" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Sou Fotógrafo</h3>
                      <p className="text-sm text-gray-500">Quero oferecer meus serviços</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-[#338dfb] transition-colors" />
                  </div>
                </button>
              </div>
            )}

            {/* Registration Form */}
            {mode === "signup" && userType && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setUserType(null)}
                  className="text-sm text-[#338dfb] hover:underline mb-2"
                >
                  ← Voltar para seleção
                </button>
                
                <div className="flex items-center gap-3 p-3 bg-[#338dfb]/10 rounded-lg mb-4">
                  {userType === "client" ? (
                    <User className="h-5 w-5 text-[#338dfb]" />
                  ) : (
                    <Camera className="h-5 w-5 text-[#338dfb]" />
                  )}
                  <span className="text-sm font-medium text-[#338dfb]">
                    Cadastro como {userType === "client" ? "Cliente" : "Fotógrafo"}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Sua senha"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-[#338dfb] hover:bg-[#2a7de0]">
                  Criar Conta
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <a href="#" className="text-[#338dfb] hover:underline">Termos de Uso</a>
                  {" "}e{" "}
                  <a href="#" className="text-[#338dfb] hover:underline">Política de Privacidade</a>
                </p>
              </form>
            )}

            {/* Login Form */}
            {mode === "signin" && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="signin-password">Senha</Label>
                    <a href="#" className="text-sm text-[#338dfb] hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Sua senha"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-[#338dfb] hover:bg-[#2a7de0]">
                  Entrar
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ou</span>
                  </div>
                </div>

                <p className="text-center text-gray-600">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[#338dfb] font-semibold hover:underline"
                  >
                    Cadastre-se
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-gray-500 hover:text-[#338dfb] transition-colors">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
