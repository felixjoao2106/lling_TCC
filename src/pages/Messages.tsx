import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search,
  Send,
  MessageSquare,
  Check,
  CheckCheck,
  Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Conversation {
  id: number;
  otherUser: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: Date | string;
}

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearch();
  const toUserId = new URLSearchParams(searchParams).get("to");
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    toUserId ? parseInt(toUserId) : null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Buscar conversas do usuário
  const { data: conversations, isLoading: loadingConversations, refetch: refetchConversations } = 
    trpc.messages.myConversations.useQuery(undefined, {
      enabled: isAuthenticated,
      refetchInterval: 5000, // Atualizar a cada 5 segundos
    });

  // Buscar mensagens da conversa selecionada
  const { data: messages, isLoading: loadingMessages, refetch: refetchMessages } = 
    trpc.messages.getConversation.useQuery(
      { otherUserId: selectedUserId!, limit: 100 },
      { 
        enabled: isAuthenticated && !!selectedUserId,
        refetchInterval: 3000, // Atualizar a cada 3 segundos
      }
    );

  // Buscar informações do usuário selecionado
  const { data: selectedUser } = trpc.user.getProfile.useQuery(
    { userId: selectedUserId! },
    { enabled: !!selectedUserId }
  );

  // Mutation para enviar mensagem
  const sendMessageMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      refetchConversations();
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem");
    },
  });

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUserId) {
      sendMessageMutation.mutate({
        receiverId: selectedUserId,
        content: newMessage.trim(),
      });
    }
  };

  const formatTime = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Ontem";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Faça login para ver suas mensagens</h2>
          <p className="text-muted-foreground mb-6">
            Acesse sua conta para conversar com fotógrafos
          </p>
          <Button asChild className="bg-[#338dfb] hover:bg-[#2a7de0]">
            <Link href="/auth">Entrar</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar conversas..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                {loadingConversations ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#338dfb]" />
                  </div>
                ) : conversations && conversations.length > 0 ? (
                  conversations.map((conversation: any) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedUserId(conversation.otherUser.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedUserId === conversation.otherUser.id ? 'bg-[#338dfb]/5' : ''
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.otherUser.avatarUrl || undefined} />
                        <AvatarFallback className="bg-[#338dfb] text-white">
                          {conversation.otherUser.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-sm truncate">{conversation.otherUser.name}</h4>
                          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageAt)}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-[#338dfb] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhuma conversa ainda</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex flex-1 flex-col">
              {selectedUserId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedUser?.avatarUrl || undefined} />
                      <AvatarFallback className="bg-[#338dfb] text-white">
                        {selectedUser?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedUser?.name || "Carregando..."}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedUser?.isPhotographer ? "Fotógrafo" : "Cliente"}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#338dfb]" />
                      </div>
                    ) : messages && messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message: Message) => {
                          const isMe = message.senderId === user?.id;
                          return (
                            <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                                <div className={`rounded-2xl px-4 py-2 ${
                                  isMe 
                                    ? 'bg-[#338dfb] text-white rounded-br-md' 
                                    : 'bg-gray-100 rounded-bl-md'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                                  <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                                  {isMe && (
                                    message.isRead 
                                      ? <CheckCheck className="w-3 h-3 text-[#338dfb]" />
                                      : <Check className="w-3 h-3 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Nenhuma mensagem ainda</p>
                          <p className="text-sm">Envie a primeira mensagem!</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        className="flex-1"
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={sendMessageMutation.isPending || !newMessage.trim()}
                        className="bg-[#338dfb] hover:bg-[#2a7de0]"
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Selecione uma conversa</h3>
                    <p className="text-gray-500">
                      Escolha uma conversa ao lado para começar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
