# Lling - TODO

## Configuração Inicial
- [x] Atualizar nome e branding para Lling
- [x] Configurar design system (LinkedIn + Pinterest)
- [x] Atualizar variáveis CSS e tipografia

## Backend - Banco de Dados
- [x] Criar tabela de fotógrafos (photographers) - integrado em users
- [x] Criar tabela de portfólio (portfolio_items)
- [x] Criar tabela de agendamentos (bookings)
- [x] Criar tabela de avaliações (reviews)
- [x] Criar tabela de mensagens/chat (messages)
- [x] Criar tabela de categorias (categories)
- [x] Criar tabela de follows
- [x] Criar tabela de likes (portfolio_likes)
- [x] Criar tabela de disponibilidade (availability_slots)

## Backend - API/Procedures
- [x] CRUD de perfil de fotógrafo
- [x] CRUD de itens do portfólio
- [x] Sistema de agendamento
- [x] Sistema de avaliações
- [x] Sistema de chat/mensagens
- [x] Busca e filtros de fotógrafos
- [x] Sistema de follows
- [x] Sistema de likes

## Frontend - Páginas Públicas
- [x] Home Page (Landing) - novo design com paleta azul
- [x] Feed de fotógrafos (estilo Pinterest) - Explore
- [x] Perfil do fotógrafo (estilo LinkedIn) - Profile
- [x] Página de busca com filtros - Photographers
- [x] Página para se tornar fotógrafo - BecomePhotographer

## Nova Paleta de Cores
- [x] Aplicar paleta azul (#338dfb, #eefafb, #7eb3f3, #91cefc, #64acfc)
- [x] Menu/Header azul sólido
- [x] Atualizar variáveis CSS
- [x] Footer azul consistente

## Dashboard Usuário Comum (Menu Lateral)
- [x] Página de Agendamentos (em andamento, concluídos, cancelados)
- [x] Configurações de Conta (nome, email, telefone, senha)
- [x] Favoritos (lista de fotógrafos favoritados)
- [x] Avaliações (histórico, editar, excluir)
- [x] Sidebar com navegação

## Dashboard Fotógrafo (Menu Lateral)
- [x] Agendamentos (visualização diária/semanal, confirmar/cancelar)
- [x] Configurações da Empresa
  - [x] Informações Gerais (nome, telefone, email, redes sociais)
  - [x] Categoria (tabs de navegação)
  - [x] Imagens (tabs de navegação)
  - [x] Integrantes (tabs de navegação)
  - [x] Localização (tabs de navegação)
- [x] Adicionar Serviço (nome, duração, preço)
- [x] Checkouts (histórico de serviços concluídos)
- [x] Sidebar com navegação

## Rotas Implementadas
- [x] /user/dashboard
- [x] /user/favorites
- [x] /user/reviews
- [x] /user/settings
- [x] /photographer/dashboard
- [x] /photographer/settings
- [x] /photographer/settings/:page
- [x] /photographer/services
- [x] /photographer/checkouts

## Funcionalidades Extras (Pendentes)
- [ ] Sistema de notificações em tempo real
- [ ] Calendário de disponibilidade visual
- [ ] Integração com pagamentos (Stripe)


## Correções Solicitadas
- [x] Remover barra de pesquisa duplicada do menu
- [x] Remover emojis das categorias (substituir por ícones profissionais)
- [x] Atualizar logo para logo.jpeg do Lling
- [x] Atualizar favicon para logo.jpeg
- [x] Garantir funcionalidades funcionando corretamente


## Correções Finais v2.2
- [x] Corrigir nome "Lling" para "LLING" no menu e footer
- [x] Remover estatísticas inventadas (500+ Fotógrafos, 10.000+ Sessões, 4.9 Avaliação)
- [x] Criar página de Login/Cadastro personalizada com design inspirado na imagem de exemplo
- [x] Adicionar seleção de tipo de usuário (Comum ou Fotógrafo) no cadastro
- [x] Implementar upload de fotos funcional para fotógrafos (página Portfolio)
- [x] Implementar sistema de favoritos funcional
- [x] Implementar chat ao vivo entre cliente e fotógrafo
- [ ] Configuração de agendamentos funcional


## Correções v2.3
- [ ] Remover notificação fixa "3" - mostrar apenas quando houver mensagens não lidas
- [ ] Conectar pesquisa da Home à API para buscar fotógrafos reais
- [ ] Adicionar slideshow de fotos no hero em vez de imagem única
- [ ] Chat puxar pessoas com agendamentos (contratados)
- [ ] Corrigir botão de favoritar (coração) para funcionar
- [ ] Adicionar botão "Contratar" e "Voltar" na página de fotógrafos
- [ ] Conectar agendamentos ao banco de dados (criar, confirmar, cancelar)
