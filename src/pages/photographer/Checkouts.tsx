import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Settings,
  Plus,
  Receipt,
  Camera,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

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

// Mock data
const mockCheckouts = [
  { 
    id: 1, 
    clientName: "Maria Fernanda",
    service: "Ensaio Pré-Wedding",
    date: "2025-01-15",
    value: 500,
    paymentMethod: "PIX",
    status: "paid",
    paidAt: "2025-01-10"
  },
  { 
    id: 2, 
    clientName: "Pedro Henrique",
    service: "Cobertura de Evento",
    date: "2025-01-22",
    value: 800,
    paymentMethod: "Cartão de Crédito",
    status: "pending",
    paidAt: null
  },
  { 
    id: 3, 
    clientName: "Juliana Costa",
    service: "Ensaio Família",
    date: "2024-12-20",
    value: 360,
    paymentMethod: "PIX",
    status: "paid",
    paidAt: "2024-12-18"
  },
  { 
    id: 4, 
    clientName: "Roberto Silva",
    service: "Ensaio Newborn",
    date: "2024-11-15",
    value: 600,
    paymentMethod: "Boleto",
    status: "cancelled",
    paidAt: null
  },
];

const mockSummary = {
  totalEarnings: 8750,
  pendingPayments: 800,
  completedCheckouts: 15,
  cancelledCheckouts: 2
};

export default function Checkouts() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.isPhotographer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eefafb]">
        <div className="text-center">
          <Receipt className="w-16 h-16 text-[#338dfb] mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">Apenas fotógrafos podem acessar esta página</p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    paid: { label: "Pago", color: "bg-green-100 text-green-700", icon: CheckCircle },
    pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: Clock },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
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
            <h1 className="text-3xl font-display font-bold text-gray-900">Checkouts</h1>
            <p className="text-muted-foreground mt-1">Histórico de pagamentos e transações</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Total Recebido</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {mockSummary.totalEarnings.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Pendente</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {mockSummary.pendingPayments.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Concluídos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockSummary.completedCheckouts}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <XCircle className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Cancelados</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockSummary.cancelledCheckouts}</p>
          </div>
        </div>

        {/* Checkouts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Histórico de Transações</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Serviço</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Pagamento</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockCheckouts.map((checkout) => {
                  const status = statusConfig[checkout.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={checkout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{checkout.clientName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{checkout.service}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(checkout.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 font-semibold">R$ {checkout.value}</td>
                      <td className="px-6 py-4 text-muted-foreground">{checkout.paymentMethod}</td>
                      <td className="px-6 py-4">
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          Ver
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
