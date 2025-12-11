# Guia Completo: Integração do HealthMed com Supabase

Vou explicar detalhadamente como integrar completamente seu projeto com Supabase. Este guia é dividido em etapas lógicas e progressivas.

---

## 📋 Índice

1. [Configuração Inicial e Variáveis de Ambiente](#1-configuração-inicial)
2. [Estrutura do Banco de Dados](#2-estrutura-do-banco-de-dados)
3. [Autenticação Real com Supabase](#3-autenticação-real)
4. [Consumo de Dados Dinâmicos](#4-consumo-de-dados-dinâmicos)
5. [Persistência de Ações do Usuário](#5-persistência-de-ações)
6. [Testes e Validação](#6-testes)

---

## 1. Configuração Inicial e Variáveis de Ambiente

### O que fazer?
Configurar as credenciais do Supabase no projeto e garantir que o cliente Supabase esteja corretamente inicializado.

### Por que fazer?
Sem as credenciais corretas, sua aplicação não consegue se comunicar com o backend do Supabase.

### Onde?
- Arquivo: `.env` (criar na raiz do projeto)
- Arquivo: `src/lib/supabase.ts`

### Como fazer?

#### Passo 1.1: Obter credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Abra seu projeto HealthMed
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública, começa com `eyJ...`)

#### Passo 1.2: Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Importante**: No Vite, variáveis de ambiente devem começar com `VITE_`

#### Passo 1.3: Atualizar o cliente Supabase

Abra `src/lib/supabase.ts` e garanta que está assim:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

**Explicação:**
- `autoRefreshToken`: Renova automaticamente o token de acesso
- `persistSession`: Mantém a sessão salva no localStorage
- `detectSessionInUrl`: Necessário para magic links e OAuth

---

## 2. Estrutura do Banco de Dados

### O que fazer?
Criar todas as tabelas necessárias no Supabase com relacionamentos corretos e políticas de segurança (RLS).

### Por que fazer?
O banco de dados é a fundação da aplicação. Uma estrutura bem planejada evita retrabalho futuro.

### Onde?
No **Supabase Dashboard → SQL Editor** ou localmente via migrações.

### Como fazer?

#### Passo 2.1: Criar as tabelas principais

Execute este SQL no Supabase SQL Editor:

```sql
-- ================================================
-- TABELA: profiles
-- Estende a tabela auth.users do Supabase
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABELA: periods (Períodos do curso médico)
-- ================================================
CREATE TABLE IF NOT EXISTS public.periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- Ex: "1º Período", "2º Período"
  description TEXT,
  order_index INTEGER NOT NULL, -- Para ordenação
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_index)
);

-- ================================================
-- TABELA: categories (Categorias de disciplinas)
-- ================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID NOT NULL REFERENCES public.periods(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Anatomia", "Fisiologia"
  description TEXT,
  slug TEXT NOT NULL, -- Para URLs amigáveis
  image_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period_id, slug)
);

-- ================================================
-- TABELA: courses (Cursos/Aulas dentro de uma categoria)
-- ================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Preço em reais
  duration_minutes INTEGER, -- Duração total estimada
  mux_playback_id TEXT, -- ID do Mux para streaming
  mux_asset_id TEXT, -- ID do asset no Mux
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT FALSE, -- Controle de publicação
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABELA: user_courses (Cursos comprados por usuário)
-- ================================================
CREATE TABLE IF NOT EXISTS public.user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_id TEXT, -- ID da transação no gateway de pagamento
  UNIQUE(user_id, course_id) -- Um usuário não pode comprar o mesmo curso 2x
);

-- ================================================
-- TABELA: video_progress (Progresso de vídeo do aluno)
-- ================================================
CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  current_time DECIMAL(10, 2) DEFAULT 0, -- Tempo atual em segundos
  duration DECIMAL(10, 2), -- Duração total do vídeo
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ================================================
-- ÍNDICES para performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_categories_period ON public.categories(period_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON public.user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course ON public.user_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_user ON public.video_progress(user_id);
```

#### Passo 2.2: Criar trigger para atualizar `updated_at`

```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_periods_updated_at BEFORE UPDATE ON public.periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Passo 2.3: Configurar Row Level Security (RLS)

**Por que RLS?** Garante que usuários só acessem dados que têm permissão.

```sql
-- ================================================
-- HABILITAR RLS em todas as tabelas
-- ================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- ================================================
-- POLÍTICAS: profiles
-- ================================================
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- POLÍTICAS: periods, categories, courses
-- (Conteúdo público para leitura)
-- ================================================
CREATE POLICY "Anyone can view published content"
  ON public.periods FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- Apenas admins podem modificar conteúdo
CREATE POLICY "Admins can manage periods"
  ON public.periods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- POLÍTICAS: user_courses
-- ================================================
-- Usuários podem ver apenas suas próprias compras
CREATE POLICY "Users can view own purchases"
  ON public.user_courses FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir compras (para si mesmos)
CREATE POLICY "Users can purchase courses"
  ON public.user_courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- POLÍTICAS: video_progress
-- ================================================
-- Usuários podem ver/atualizar apenas seu próprio progresso
CREATE POLICY "Users can view own progress"
  ON public.video_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.video_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own progress"
  ON public.video_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

#### Passo 2.4: Criar trigger para criar perfil automaticamente

```sql
-- Quando um usuário se registra, cria automaticamente um perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger no auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### Passo 2.5: Inserir dados de teste

```sql
-- Inserir períodos
INSERT INTO public.periods (name, description, order_index, image_url) VALUES
  ('1º Período', 'Introdução às ciências básicas', 1, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'),
  ('2º Período', 'Aprofundamento em anatomia e fisiologia', 2, 'https://images.unsplash.com/photo-1559757175-5700dde675bc'),
  ('3º Período', 'Patologia e farmacologia', 3, 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133');

-- Inserir categorias (pegue os IDs dos períodos primeiro)
INSERT INTO public.categories (period_id, name, description, slug, order_index) VALUES
  ((SELECT id FROM public.periods WHERE order_index = 1), 'Anatomia', 'Estudo da estrutura do corpo humano', 'anatomia', 1),
  ((SELECT id FROM public.periods WHERE order_index = 1), 'Fisiologia', 'Funcionamento dos sistemas corporais', 'fisiologia', 2),
  ((SELECT id FROM public.periods WHERE order_index = 2), 'Bioquímica', 'Processos químicos nos organismos vivos', 'bioquimica', 1);

-- Inserir cursos de exemplo
INSERT INTO public.courses (category_id, title, description, price, duration_minutes, order_index, is_published) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'anatomia' LIMIT 1),
    'Anatomia do Sistema Cardiovascular',
    'Estudo completo do coração e vasos sanguíneos',
    199.90,
    120,
    1,
    true
  );
```

---

## 3. Autenticação Real com Supabase

### O que fazer?
Substituir a lógica mockada de autenticação pela integração real com Supabase Auth.

### Por que fazer?
Autenticação mockada não é segura e não persiste dados reais. O Supabase Auth gerencia sessões, tokens JWT, e segurança de forma profissional.

### Onde?
- `src/contexts/AuthContext.tsx`
- `src/components/auth/Login.tsx`
- `src/components/auth/Register.tsx`

### Como fazer?

#### Passo 3.1: Refatorar AuthContext

Abra `src/contexts/AuthContext.tsx` e substitua completamente por:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setProfile(null);
    }
  };

  // Monitora mudanças na sessão
  useEffect(() => {
    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cadastro
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: 'Cadastro realizado!',
          description: 'Verifique seu email para confirmar a conta.',
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Erro no cadastro',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Login realizado!',
        description: `Bem-vindo de volta!`,
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Erro no login',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: 'Erro ao sair',
        description: authError.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Explicação:**
- `onAuthStateChange`: Escuta mudanças de autenticação em tempo real
- `getSession`: Recupera sessão salva no localStorage
- `fetchProfile`: Busca dados adicionais do usuário na tabela `profiles`
- Tratamento de erros com toast notifications

#### Passo 3.2: Atualizar componente de Login

Abra `src/components/auth/Login.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/aluno'); // Redireciona para área do aluno
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/cadastro')}
              disabled={loading}
            >
              Não tem conta? Cadastre-se
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

#### Passo 3.3: Atualizar componente de Register

Abra `src/components/auth/Register.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, fullName);
      // Após cadastro, redireciona para login
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>Crie sua conta no HealthMed</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Já tem conta? Faça login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

---

## 4. Consumo de Dados Dinâmicos

### O que fazer?
Criar hooks customizados com React Query para buscar dados do Supabase e usar esses dados nas páginas.

### Por que fazer?
React Query gerencia cache, loading states, revalidação e otimizações automaticamente.

### Onde?
- Criar: `src/hooks/useCourses.ts`
- Criar: `src/hooks/usePeriods.ts`
- Criar: `src/hooks/useCategories.ts`
- Atualizar: Páginas que usam dados mockados

### Como fazer?

#### Passo 4.1: Criar hook para Períodos

Crie `src/hooks/usePeriods.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Period {
  id: string;
  name: string;
  description: string | null;
  order_index: number;
  image_url: string | null;
  created_at: string;
}

export const usePeriods = () => {
  return useQuery({
    queryKey: ['periods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as Period[];
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};

export const usePeriod = (id: string) => {
  return useQuery({
    queryKey: ['period', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Period;
    },
    enabled: !!id, // Só executa se id existir
  });
};
```

#### Passo 4.2: Criar hook para Categorias

Crie `src/hooks/useCategories.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  period_id: string;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  order_index: number;
  created_at: string;
}

export const useCategories = (periodId?: string) => {
  return useQuery({
    queryKey: ['categories', periodId],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (periodId) {
        query = query.eq('period_id', periodId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Category;
    },
    enabled: !!slug,
  });
};
```

#### Passo 4.3: Criar hook para Cursos

Crie `src/hooks/useCourses.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Course {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  price: number;
  duration_minutes: number | null;
  mux_playback_id: string | null;
  mux_asset_id: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

// Buscar todos os cursos de uma categoria
export const useCourses = (categoryId?: string) => {
  return useQuery({
    queryKey: ['courses', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Course[];
    },
  });
};

// Buscar curso específico
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Course;
    },
    enabled: !!id,
  });
};

// Buscar cursos comprados pelo usuário
export const useUserCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userCourses', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('user_courses')
        .select(`
          id,
          purchased_at,
          payment_status,
          course:courses (*)
        `)
        .eq('user_id', user.id)
        .eq('payment_status', 'completed');

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Verificar se usuário possui um curso específico
export const useHasCourse = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hasCourse', user?.id, courseId],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_courses')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('payment_status', 'completed')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!courseId,
  });
};
```

#### Passo 4.4: Exemplo de uso nas páginas

**Página Index (Home) - mostrar períodos:**

Abra `src/pages/Index.tsx` e use assim:

```typescript
import { usePeriods } from '@/hooks/usePeriods';
import PeriodCard from '@/components/cards/PeriodCard';

export default function Index() {
  const { data: periods, isLoading, error } = usePeriods();

  if (isLoading) return <div>Carregando períodos...</div>;
  if (error) return <div>Erro ao carregar períodos</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Escolha seu período</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {periods?.map((period) => (
          <PeriodCard key={period.id} period={period} />
        ))}
      </div>
    </div>
  );
}
```

**Página de Categoria - mostrar cursos:**

```typescript
import { useParams } from 'react-router-dom';
import { useCategory } from '@/hooks/useCategories';
import { useCourses } from '@/hooks/useCourses';
import LessonCard from '@/components/cards/LessonCard';

export default function CategoriaPage() {
  const { categoria } = useParams<{ categoria: string }>();
  const { data: category } = useCategory(categoria!);
  const { data: courses, isLoading } = useCourses(category?.id);

  if (isLoading) return <div>Carregando cursos...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{category?.name}</h1>
      <p className="text-gray-600 mb-8">{category?.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <LessonCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Persistência de Ações do Usuário

### O que fazer?
Implementar compra de cursos e salvar progresso de vídeo no banco.

### Por que fazer?
Persistir essas ações permite que o usuário acesse seus cursos e continue de onde parou.

### Onde?
- Criar: `src/hooks/useUserActions.ts`
- Atualizar: `src/pages/PlayerPage.tsx`
- Atualizar: `src/pages/CheckoutPage.tsx`

### Como fazer?

#### Passo 5.1: Hook para comprar curso

Crie `src/hooks/useUserActions.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Comprar curso
export const usePurchaseCourse = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('user_courses')
        .insert({
          user_id: user.id,
          course_id: courseId,
          payment_status: 'completed', // Depois integrar com gateway real
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      toast({
        title: 'Curso adquirido!',
        description: 'Você já pode assistir as aulas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na compra',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Salvar/Atualizar progresso de vídeo
export const useUpdateVideoProgress = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      courseId,
      currentTime,
      duration,
    }: {
      courseId: string;
      currentTime: number;
      duration: number;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const completed = currentTime / duration > 0.9; // 90% = completo

      const { data, error } = await supabase
        .from('video_progress')
        .upsert(
          {
            user_id: user.id,
            course_id: courseId,
            current_time: currentTime,
            duration,
            completed,
            last_watched_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,course_id',
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// Buscar progresso de vídeo
export const useVideoProgress = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['videoProgress', user?.id, courseId],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!courseId,
  });
};
```

#### Passo 5.2: Implementar compra no Checkout

Abra `src/pages/CheckoutPage.tsx`:

```typescript
import { usePurchaseCourse } from '@/hooks/useUserActions';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const purchaseMutation = usePurchaseCourse();
  
  // Assumindo que você tem o courseId vindo do carrinho
  const courseId = 'seu-course-id'; // Pegue do estado/contexto do carrinho

  const handlePurchase = async () => {
    try {
      await purchaseMutation.mutateAsync(courseId);
      navigate('/aluno'); // Redireciona para área do aluno
    } catch (error) {
      console.error('Erro na compra:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      
      {/* Aqui você mostraria os detalhes do curso, resumo, etc */}
      
      <Button 
        onClick={handlePurchase}
        disabled={purchaseMutation.isPending}
      >
        {purchaseMutation.isPending ? 'Processando...' : 'Confirmar Compra'}
      </Button>
    </div>
  );
}
```

#### Passo 5.3: Player com progresso

Abra `src/pages/PlayerPage.tsx`:

```typescript
import { useParams } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourses';
import { useVideoProgress, useUpdateVideoProgress } from '@/hooks/useUserActions';
import { useEffect, useRef } from 'react';

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const { data: course } = useCourse(id!);
  const { data: progress } = useVideoProgress(id!);
  const updateProgress = useUpdateVideoProgress();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restaurar progresso ao carregar
  useEffect(() => {
    if (progress && videoRef.current) {
      videoRef.current.currentTime = progress.current_time;
    }
  }, [progress]);

  // Salvar progresso a cada 5 segundos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (!video.paused && video.duration) {
        updateProgress.mutate({
          courseId: id!,
          currentTime: video.currentTime,
          duration: video.duration,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (!course) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      
      {course.mux_playback_id ? (
        <video
          ref={videoRef}
          controls
          className="w-full max-w-4xl"
          src={`https://stream.mux.com/${course.mux_playback_id}.m3u8`}
        >
          Seu navegador não suporta vídeo.
        </video>
      ) : (
        <p>Vídeo não disponível</p>
      )}

      {progress && (
        <p className="mt-4 text-sm text-gray-600">
          Progresso: {Math.round((progress.current_time / progress.duration) * 100)}%
          {progress.completed && ' - ✅ Concluído'}
        </p>
      )}
    </div>
  );
}
```

---

## 6. Testes e Validação

### Como testar cada funcionalidade?

#### Teste 1: Autenticação

```bash
# No terminal, abra o console do navegador (F12)
# e teste o cadastro:

1. Acesse http://localhost:5173/cadastro
2. Preencha: Nome, Email, Senha
3. Clique em Cadastrar
4. Verifique no Supabase Dashboard → Authentication → Users
5. Confirme o email (ou desabilite confirmação em Settings → Auth)
6. Faça login em /login
7. Verifique se foi redirecionado para /aluno
8. Abra o console e digite: console.log(await supabase.auth.getUser())
```

#### Teste 2: Dados Dinâmicos

```bash
1. Abra http://localhost:5173/
2. Verifique se os períodos aparecem (vindos do banco)
3. Clique em um período
4. Verifique se as categorias aparecem
5. Abra o Network tab (F12) e veja as requisições para o Supabase
```

#### Teste 3: Compra de Curso

```bash
1. Faça login
2. Navegue até um curso
3. Clique em "Comprar" ou "Adicionar ao carrinho"
4. Finalize no checkout
5. Vá para /aluno
6. Verifique se o curso aparece na lista
7. No Supabase → Table Editor → user_courses, veja o registro
```

#### Teste 4: Progresso de Vídeo

```bash
1. Compre um curso
2. Acesse o player (/aluno/aula/:id)
3. Assista por 30 segundos
4. Feche e reabra a página
5. Verifique se o vídeo continua de onde parou
6. No Supabase → video_progress, veja o current_time atualizado
```

---

## 📦 Checklist Final

- [ ] Configurar `.env` com credenciais do Supabase
- [ ] Executar todos os comandos SQL no Supabase SQL Editor
- [ ] Refatorar `AuthContext.tsx` com Supabase Auth
- [ ] Atualizar componentes `Login.tsx` e `Register.tsx`
- [ ] Criar hooks: `usePeriods`, `useCategories`, `useCourses`
- [ ] Criar hook `useUserActions` (compra e progresso)
- [ ] Atualizar páginas para usar dados dinâmicos
- [ ] Implementar lógica de compra no `CheckoutPage`
- [ ] Implementar salvamento de progresso no `PlayerPage`
- [ ] Testar cadastro, login e logout
- [ ] Testar navegação e exibição de dados
- [ ] Testar compra e visualização de cursos comprados
- [ ] Testar progresso de vídeo (salvar e restaurar)

---

## 🎯 Próximos Passos (Após a Integração)

1. **Gateway de Pagamento**: Integrar Stripe/Mercado Pago
2. **Painel Admin**: Interface para gerenciar cursos
3. **Upload de Vídeos**: Integração completa com Mux
4. **Testes Automatizados**: Vitest + Testing Library
5. **Deploy**: Vercel + Supabase em produção

---

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

**Essa explicação cobre tudo que você precisa para integrar o HealthMed com Supabase. Siga passo a passo, teste cada etapa, e você terá um sistema funcional e seguro!** 🚀
