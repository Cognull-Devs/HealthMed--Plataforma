# Análise do Projeto HealthMed

Este documento fornece um resumo das funcionalidades existentes na plataforma HealthMed e identifica os pontos que precisam ser desenvolvidos para que o projeto se torne totalmente funcional.

## Visão Geral do Projeto

O HealthMed é uma plataforma de e-learning (ensino à distância) voltada para estudantes de medicina. O objetivo é fornecer um portal onde os alunos possam comprar cursos, assistir a aulas em vídeo e acompanhar seu progresso.

**Pilha de Tecnologia (Frontend):**
*   **Framework:** React com Vite
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS e componentes `shadcn/ui`
*   **Roteamento:** React Router
*   **Gerenciamento de Estado (API):** TanStack Query (React Query)

**Pilha de Tecnologia (Backend):**
*   **Banco de Dados e Autenticação:** Supabase

---

## Funcionalidades Implementadas

A estrutura base do frontend está bem definida, com várias páginas e componentes que delineiam as principais funcionalidades da plataforma. No entanto, a maioria dessas funcionalidades está atualmente em um estado de "mock" (simulação), sem integração real com o backend.

### 1. Autenticação de Usuário
*   **Páginas:** Existem páginas de `Login` (`/login`) e `Cadastro` (`/cadastro`).
*   **Contexto de Autenticação:** Um `AuthContext` gerencia o estado do usuário (logado ou não).
*   **Status:** **MOCKADO.** A lógica de autenticação utiliza uma lista de usuários hardcoded. Não há comunicação com o Supabase Auth. Os dados do usuário logado são salvos no `localStorage` do navegador.

### 2. Navegação e Catálogo de Cursos
*   **Páginas:** A `Home Page` (`/`), páginas de `Período` (`/periodo/:id`) e `Categoria` (`/categoria/:periodo/:categoria`) permitem que o usuário navegue pelo conteúdo.
*   **Componentes:** Cards para `Período`, `Categoria` e `Aula` são usados para exibir as informações.
*   **Status:** **PARCIALMENTE MOCKADO.** O conteúdo (títulos, descrições, imagens) está, em sua maioria, hardcoded nas páginas. A estrutura para exibir dados dinâmicos existe, mas precisa ser conectada ao banco de dados.

### 3. Compra de Cursos (E-commerce)
*   **Páginas:** O fluxo inclui um `Carrinho` (`/carrinho`) e uma página de `Checkout` (`/checkout`).
*   **Status:** **MOCKADO.** A funcionalidade de adicionar ao carrinho e "comprar" um curso existe no frontend, mas não está conectada a nenhum sistema de pagamento ou lógica de backend para registrar a compra.

### 4. Área do Aluno e Consumo de Conteúdo
*   **Páginas:** Uma `Área do Aluno` (`/aluno`) e uma página de `Player de Vídeo` (`/aluno/aula/:id`).
*   **Banco de Dados:** A estrutura do banco de dados inclui uma tabela `video_progress` para salvar o progresso do aluno em cada vídeo.
*   **Status:** **MOCKADO E NÃO INTEGRADO.** A `Área do Aluno` não busca os cursos comprados pelo usuário no backend. O player de vídeo ainda não carrega o vídeo do backend (ex: Mux) nem salva o progresso do usuário no banco de dados.

---

## O Que Falta para o Projeto ser Funcional?

Para que a plataforma HealthMed se torne um produto viável e funcional, os seguintes pontos precisam ser desenvolvidos:

### 1. **Integração Completa com o Backend (Supabase)**
*   **Autenticação Real:**
    *   Substituir a lógica de autenticação mockada pela integração com o **Supabase Auth** (login, cadastro, logout).
    *   Gerenciar as sessões de usuário com base no Supabase.
*   **Consumo de Dados Dinâmicos:**
    *   Criar funções para buscar todos os dados (cursos, períodos, categorias, aulas) do banco de dados do Supabase em vez de usar conteúdo hardcoded.
*   **Persistência de Ações do Usuário:**
    *   Implementar a lógica no backend para registrar a compra de cursos por um usuário.
    *   Integrar o player de vídeo para buscar e salvar o progresso de vídeo na tabela `video_progress`.

### 2. **Sistema de Pagamentos**
*   Integrar um gateway de pagamento (ex: Stripe, Mercado Pago) na página de `Checkout`.
*   Criar webhooks para confirmar o pagamento e liberar o acesso ao curso para o usuário no banco de dados.

### 3. **Gerenciamento de Conteúdo (Painel de Admin)**
*   **Interface de Admin:** Desenvolver uma área de administração onde usuários com a role `admin` possam:
    *   Adicionar, editar e remover cursos, aulas, períodos e categorias.
    *   Gerenciar uploads de vídeo (integrado ao Supabase/Mux).
    *   Visualizar e gerenciar usuários.
*   **Segurança de Rotas:** Proteger as rotas de administração para que apenas administradores possam acessá-las.

### 4. **Upload e Streaming de Vídeos**
*   Finalizar a integração da função `mux-upload` do Supabase para permitir o upload de vídeos das aulas.
*   No `PlayerPage`, buscar o ID de reprodução do Mux (ou outro serviço de streaming) a partir do backend para exibir o vídeo.

### 5. **Testes e Validações**
*   **Testes Unitários e de Integração:** Adicionar um framework de testes (como Jest e React Testing Library) para garantir a qualidade e a estabilidade do código.
*   **Validação de Formulários:** Implementar validação robusta nos formulários de cadastro, login e checkout.
