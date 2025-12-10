# 🔌 Guia Completo de Integração Supabase - HealthMed

Este documento contém todos os passos detalhados para integrar o banco de dados Supabase ao projeto HealthMed.

---

## 📑 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Passo 1: Gerar Tipos TypeScript](#passo-1-gerar-tipos-typescript)
3. [Passo 2: Atualizar AuthContext](#passo-2-atualizar-authcontext)
4. [Passo 3: Atualizar CartContext](#passo-3-atualizar-cartcontext)
5. [Passo 4: Criar Hooks Personalizados](#passo-4-criar-hooks-personalizados)
6. [Passo 5: Atualizar Páginas](#passo-5-atualizar-páginas)
7. [Passo 6: Área Administrativa](#passo-6-área-administrativa)
8. [Passo 7: Testar Integração](#passo-7-testar-integração)
9. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- ✅ Banco de dados Supabase criado e configurado
- ✅ Tabelas criadas conforme schema fornecido
- ✅ Variáveis de ambiente configuradas no `.env.local`:
  ```env
  VITE_SUPABASE_URL="https://kuzqpzbhjetzotlklphz.supabase.co"
  VITE_SUPABASE_ANON_KEY="sua-anon-key"
  ```
- ✅ Cliente Supabase já corrigido em `src/integrations/supabase/client.ts`

---

## Passo 1: Gerar Tipos TypeScript

### Método A: Usando Supabase CLI (Recomendado)

```powershell
# 1. Instalar Supabase CLI globalmente
npm install -g supabase

# 2. Fazer login no Supabase
supabase login

# 3. Gerar os tipos (substitua pelo seu Project ID)
npx supabase gen types typescript --project-id kuzqpzbhjetzotlklphz > src/integrations/supabase/types.ts
```

### Método B: Gerar Manualmente no Dashboard

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Project Settings** → **API**
4. Role até **Generate Types**
5. Selecione **TypeScript**
6. Copie o código gerado
7. Cole no arquivo `src/integrations/supabase/types.ts` (substituindo todo o conteúdo)

### Estrutura Esperada dos Tipos

O arquivo `types.ts` deve conter interfaces para todas as tabelas:
- `profiles`
- `periods`
- `courses`
- `purchases`
- `course_materials`
- `reviews`
- `cart_items`
- `video_progress`

---

## Passo 2: Atualizar AuthContext

### Arquivo: `src/contexts/AuthContext.tsx`

#### 2.1. Importações Necessárias

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';
```

#### 2.2. Atualizar Interface do User

```typescript
interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'admin';
  avatar_url: string | null;
}
```

#### 2.3. Implementar Função de Login

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // 1. Fazer login com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) return false;

    // 2. Buscar dados do perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    // 3. Atualizar estado do usuário
    setUser({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      avatar_url: profile.avatar_url,
    });

    return true;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
};
```

#### 2.4. Implementar Função de Registro

```typescript
const register = async (
  name: string,
  email: string,
  password: string
): Promise<boolean> => {
  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) return false;

    // 2. O trigger 'on_auth_user_created' já cria o perfil automaticamente
    // Buscar o perfil criado
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      });
    }

    return true;
  } catch (error) {
    console.error('Erro no registro:', error);
    return false;
  }
};
```

#### 2.5. Implementar Função de Logout

```typescript
const logout = async () => {
  try {
    await supabase.auth.signOut();
    setUser(null);
  } catch (error) {
    console.error('Erro no logout:', error);
  }
};
```

#### 2.6. Verificar se Usuário Comprou Curso

```typescript
const hasPurchased = async (courseId: string): Promise<boolean> => {
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('payment_status', 'approved')
      .single();

    return !!data && !error;
  } catch {
    return false;
  }
};
```

#### 2.7. Adicionar Listener de Autenticação

```typescript
useEffect(() => {
  // Verificar sessão atual
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      // Buscar perfil do usuário
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
              avatar_url: profile.avatar_url,
            });
          }
        });
    }
  });

  // Escutar mudanças na autenticação
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role,
            avatar_url: profile.avatar_url,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## Passo 3: Atualizar CartContext

### Arquivo: `src/contexts/CartContext.tsx`

#### 3.1. Importações

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
```

#### 3.2. Interface do Item do Carrinho

```typescript
interface CartItem {
  id: string;
  course_id: string;
  // Incluir dados do curso via join
  courses: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discount_price: number | null;
    thumbnail_url: string | null;
  };
}
```

#### 3.3. Carregar Itens do Carrinho

```typescript
const loadCartItems = async () => {
  if (!user) {
    setItems([]);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        course_id,
        courses (
          id,
          title,
          slug,
          price,
          discount_price,
          thumbnail_url
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    setItems(data || []);
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
  }
};

useEffect(() => {
  loadCartItems();
}, [user]);
```

#### 3.4. Adicionar Item ao Carrinho

```typescript
const addToCart = async (courseId: string) => {
  if (!user) {
    toast({
      title: 'Erro',
      description: 'Você precisa estar logado para adicionar ao carrinho',
      variant: 'destructive',
    });
    return;
  }

  try {
    // Verificar se já existe no carrinho
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      toast({
        title: 'Aviso',
        description: 'Este curso já está no carrinho',
      });
      return;
    }

    // Adicionar ao carrinho
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        course_id: courseId,
      });

    if (error) throw error;

    // Recarregar carrinho
    await loadCartItems();

    toast({
      title: 'Sucesso',
      description: 'Curso adicionado ao carrinho',
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    toast({
      title: 'Erro',
      description: 'Não foi possível adicionar ao carrinho',
      variant: 'destructive',
    });
  }
};
```

#### 3.5. Remover Item do Carrinho

```typescript
const removeFromCart = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    // Recarregar carrinho
    await loadCartItems();

    toast({
      title: 'Removido',
      description: 'Curso removido do carrinho',
    });
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
  }
};
```

#### 3.6. Limpar Carrinho

```typescript
const clearCart = async () => {
  if (!user) return;

  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;

    setItems([]);
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
  }
};
```

---

## Passo 4: Criar Hooks Personalizados

### 4.1. Hook para Períodos

#### Arquivo: `src/hooks/usePeriods.ts` (CRIAR NOVO)

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePeriods = () => {
  return useQuery({
    queryKey: ['periods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const usePeriodBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['period', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};
```

### 4.2. Hook para Cursos

#### Arquivo: `src/hooks/useCourses.ts` (CRIAR NOVO)

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          periods (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useCoursesByPeriod = (periodId: string) => {
  return useQuery({
    queryKey: ['courses', 'period', periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          periods (
            id,
            name,
            slug
          )
        `)
        .eq('period_id', periodId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!periodId,
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          periods (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          periods (
            id,
            name,
            slug
          )
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });
};
```

### 4.3. Hook para Compras

#### Arquivo: `src/hooks/usePurchases.ts` (CRIAR NOVO)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useUserPurchases = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          courses (
            id,
            title,
            slug,
            thumbnail_url,
            mux_playback_id,
            duration_hours,
            periods (
              name,
              slug
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('payment_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const usePurchaseCourse = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      amount,
      paymentMethod,
    }: {
      courseId: string;
      amount: number;
      paymentMethod: 'credit_card' | 'pix';
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          course_id: courseId,
          amount_paid: amount,
          payment_method: paymentMethod,
          payment_status: 'approved', // Em produção, seria 'pending' até confirmação
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: 'Compra realizada!',
        description: 'Você já pode acessar o curso',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro na compra',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useHasPurchased = (courseId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchase-check', courseId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('payment_status', 'approved')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!user && !!courseId,
  });
};
```

### 4.4. Hook para Materiais do Curso

#### Arquivo: `src/hooks/useCourseMaterials.ts` (CRIAR NOVO)

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCourseMaterials = (courseId: string) => {
  return useQuery({
    queryKey: ['course-materials', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', courseId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};
```

### 4.5. Hook para Reviews

#### Arquivo: `src/hooks/useReviews.ts` (CRIAR NOVO)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ['reviews', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      rating,
      comment,
    }: {
      courseId: string;
      rating: number;
      comment: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          course_id: courseId,
          user_id: user.id,
          rating,
          comment,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.courseId] });
      toast({
        title: 'Avaliação enviada!',
        description: 'Obrigado pelo seu feedback',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao enviar avaliação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
```

---

## Passo 5: Atualizar Páginas

### 5.1. Página Inicial

#### Arquivo: `src/pages/Index.tsx`

```typescript
import { usePeriods } from '@/hooks/usePeriods';
import { useFeaturedCourses } from '@/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const { data: periods, isLoading: periodsLoading } = usePeriods();
  const { data: featuredCourses, isLoading: coursesLoading } = useFeaturedCourses();

  if (periodsLoading || coursesLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <PeriodsSection periods={periods || []} />
      {/* Adicionar seção de cursos em destaque */}
    </Layout>
  );
}
```

### 5.2. Página do Período

#### Arquivo: `src/pages/PeriodPage.tsx`

```typescript
import { useParams } from 'react-router-dom';
import { usePeriodBySlug } from '@/hooks/usePeriods';
import { useCoursesByPeriod } from '@/hooks/useCourses';
import { CourseCard } from '@/components/cards/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function PeriodPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: period, isLoading: periodLoading } = usePeriodBySlug(slug || '');
  const { data: courses, isLoading: coursesLoading } = useCoursesByPeriod(
    period?.id || ''
  );

  if (periodLoading || coursesLoading) {
    return <Skeleton className="h-screen" />;
  }

  if (!period) {
    return <div>Período não encontrado</div>;
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-6">{period.name}</h1>
        <p className="text-muted-foreground mb-8">{period.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
```

### 5.3. Página do Curso

#### Arquivo: `src/pages/CoursePage.tsx`

```typescript
import { useParams } from 'react-router-dom';
import { useCourseBySlug } from '@/hooks/useCourses';
import { useHasPurchased } from '@/hooks/usePurchases';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';
import { useCourseReviews } from '@/hooks/useReviews';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  
  const { data: course, isLoading } = useCourseBySlug(slug || '');
  const { data: hasPurchased } = useHasPurchased(course?.id || '');
  const { data: materials } = useCourseMaterials(course?.id || '');
  const { data: reviews } = useCourseReviews(course?.id || '');

  if (isLoading) return <Skeleton className="h-screen" />;
  if (!course) return <div>Curso não encontrado</div>;

  const handleAddToCart = () => {
    addToCart(course.id);
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">
              {course.short_description}
            </p>
            
            <div className="prose max-w-none mb-8">
              {course.long_description}
            </div>

            {/* Materiais */}
            {materials && materials.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Materiais do Curso</h2>
                <ul>
                  {materials.map((material) => (
                    <li key={material.id}>{material.title}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
                {reviews.map((review) => (
                  <div key={review.id} className="mb-4">
                    {/* Renderizar review */}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 border rounded-lg p-6">
              <div className="text-3xl font-bold mb-4">
                R$ {course.discount_price || course.price}
              </div>
              
              {hasPurchased ? (
                <Button className="w-full" onClick={() => navigate(`/assistir/${course.slug}`)}>
                  Assistir Agora
                </Button>
              ) : (
                <Button className="w-full" onClick={handleAddToCart}>
                  Adicionar ao Carrinho
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### 5.4. Página Minhas Aulas

#### Arquivo: `src/pages/MyCoursesPage.tsx`

```typescript
import { useUserPurchases } from '@/hooks/usePurchases';
import { CourseCard } from '@/components/cards/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyCoursesPage() {
  const { data: purchases, isLoading } = useUserPurchases();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-64" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Minhas Aulas</h1>
        
        {purchases && purchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <CourseCard
                key={purchase.id}
                course={purchase.courses}
                isPurchased={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Você ainda não comprou nenhum curso
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
```

### 5.5. Página de Checkout

#### Arquivo: `src/pages/CartPage.tsx`

```typescript
import { useCart } from '@/contexts/CartContext';
import { usePurchaseCourse } from '@/hooks/usePurchases';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { mutate: purchaseCourse, isLoading } = usePurchaseCourse();

  const handleCheckout = async () => {
    // Criar compra para cada item do carrinho
    for (const item of items) {
      await purchaseCourse({
        courseId: item.course_id,
        amount: item.courses.discount_price || item.courses.price,
        paymentMethod: 'credit_card',
      });
    }
    
    // Limpar carrinho após compra
    await clearCart();
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Carrinho</h1>
        
        {items.length > 0 ? (
          <>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 p-4 border rounded">
                <div>
                  <h3 className="font-bold">{item.courses.title}</h3>
                  <p>R$ {item.courses.discount_price || item.courses.price}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
            
            <div className="mt-8 text-right">
              <div className="text-2xl font-bold mb-4">
                Total: R$ {total}
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                size="lg"
              >
                Finalizar Compra
              </Button>
            </div>
          </>
        ) : (
          <p>Seu carrinho está vazio</p>
        )}
      </div>
    </Layout>
  );
}
```

### 5.6. Página de Assistir

#### Arquivo: `src/pages/WatchPage.tsx`

```typescript
import { useParams, Navigate } from 'react-router-dom';
import { useCourseBySlug } from '@/hooks/useCourses';
import { useHasPurchased } from '@/hooks/usePurchases';
import { MuxVideoPlayer } from '@/components/video/MuxVideoPlayer';

export default function WatchPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: course, isLoading: courseLoading } = useCourseBySlug(slug || '');
  const { data: hasPurchased, isLoading: purchaseLoading } = useHasPurchased(
    course?.id || ''
  );

  if (courseLoading || purchaseLoading) {
    return <div>Carregando...</div>;
  }

  if (!course || !hasPurchased) {
    return <Navigate to="/minhas-aulas" replace />;
  }

  if (!course.mux_playback_id) {
    return <div>Vídeo não disponível</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <MuxVideoPlayer
        playbackId={course.mux_playback_id}
        courseSlug={course.slug}
      />
    </div>
  );
}
```

---

## Passo 6: Área Administrativa

### 6.1. Listar Cursos (Admin)

#### Arquivo: `src/pages/admin/AdminCourses.tsx`

```typescript
import { useCourses } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminCourses() {
  const { data: courses, isLoading } = useCourses();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja deletar este curso?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      toast({
        title: 'Curso deletado',
        description: 'O curso foi removido com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o curso',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
        <Button onClick={() => navigate('/admin/aulas/nova')}>
          Novo Curso
        </Button>
      </div>

      <div className="space-y-4">
        {courses?.map((course) => (
          <div
            key={course.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div>
              <h3 className="font-bold">{course.title}</h3>
              <p className="text-sm text-muted-foreground">
                {course.periods?.name} - R$ {course.price}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/aulas/editar/${course.id}`)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(course.id)}
              >
                Deletar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6.2. Criar Novo Curso (Admin)

#### Arquivo: `src/pages/admin/AdminNewCourse.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePeriods } from '@/hooks/usePeriods';

const courseSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  period_id: z.string().uuid('Selecione um período válido'),
  subject: z.string().optional(),
  short_description: z.string().min(10, 'Descrição curta deve ter no mínimo 10 caracteres'),
  long_description: z.string().min(50, 'Descrição longa deve ter no mínimo 50 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
  discount_price: z.number().positive().optional(),
  thumbnail_url: z.string().url('URL inválida').optional(),
  duration_hours: z.number().positive().optional(),
});

export default function AdminNewCourse() {
  const { data: periods } = usePeriods();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert([data]);

      if (error) throw error;

      toast({
        title: 'Curso criado!',
        description: 'O curso foi adicionado com sucesso',
      });

      navigate('/admin/aulas');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o curso',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Criar Novo Curso</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div>
          <label className="block mb-2">Título</label>
          <Input {...register('title')} />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Slug</label>
          <Input {...register('slug')} />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Período</label>
          <select {...register('period_id')} className="w-full border rounded p-2">
            <option value="">Selecione um período</option>
            {periods?.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
          {errors.period_id && (
            <p className="text-red-500 text-sm mt-1">{errors.period_id.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Matéria</label>
          <Input {...register('subject')} />
        </div>

        <div>
          <label className="block mb-2">Descrição Curta</label>
          <Textarea {...register('short_description')} />
          {errors.short_description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.short_description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">Descrição Longa</label>
          <Textarea {...register('long_description')} rows={6} />
          {errors.long_description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.long_description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Preço</label>
            <Input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">Preço com Desconto</label>
            <Input
              type="number"
              step="0.01"
              {...register('discount_price', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">URL da Thumbnail</label>
          <Input {...register('thumbnail_url')} />
        </div>

        <div>
          <label className="block mb-2">Duração (horas)</label>
          <Input
            type="number"
            step="0.5"
            {...register('duration_hours', { valueAsNumber: true })}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar Curso'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/aulas')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

## Passo 7: Testar Integração

### 7.1. Criar Usuário Admin

No SQL Editor do Supabase, execute:

```sql
-- Primeiro, crie o usuário manualmente no Authentication
-- Depois, atualize o perfil para admin:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

### 7.2. Checklist de Testes

- [ ] **Autenticação**
  - [ ] Registro de novo usuário funciona
  - [ ] Login funciona
  - [ ] Logout funciona
  - [ ] Sessão persiste após refresh

- [ ] **Listagem de Dados**
  - [ ] Períodos aparecem na home
  - [ ] Cursos aparecem ao clicar em período
  - [ ] Cursos em destaque aparecem

- [ ] **Carrinho**
  - [ ] Adicionar curso ao carrinho funciona
  - [ ] Remover curso do carrinho funciona
  - [ ] Carrinho persiste no banco

- [ ] **Compras**
  - [ ] Checkout cria registro em purchases
  - [ ] Cursos comprados aparecem em "Minhas Aulas"
  - [ ] Não é possível comprar curso duplicado

- [ ] **Player de Vídeo**
  - [ ] Player carrega com mux_playback_id
  - [ ] Progresso é salvo
  - [ ] Apenas usuários que compraram têm acesso

- [ ] **Admin**
  - [ ] Admin pode criar cursos
  - [ ] Admin pode editar cursos
  - [ ] Admin pode deletar cursos
  - [ ] Estudantes não têm acesso ao admin

- [ ] **RLS (Row Level Security)**
  - [ ] Usuário só vê seu próprio carrinho
  - [ ] Usuário só vê suas próprias compras
  - [ ] Apenas admins podem modificar cursos

---

## Troubleshooting

### Problema: Tela branca após iniciar

**Solução:**
1. Verifique o console do navegador para erros
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique se `VITE_SUPABASE_ANON_KEY` está correto no `.env.local`

### Problema: RLS bloqueando acesso

**Solução:**
1. No Dashboard do Supabase, vá em **Table Editor**
2. Selecione a tabela com problema
3. Clique em **RLS** e revise as policies
4. Teste as queries no **SQL Editor**

### Problema: Tipos TypeScript incorretos

**Solução:**
1. Regerar os tipos com `npx supabase gen types typescript --project-id SEU_ID`
2. Reiniciar o servidor de desenvolvimento
3. Recarregar a janela do VS Code

### Problema: Usuário não consegue se registrar

**Solução:**
1. Verifique se o trigger `on_auth_user_created` existe
2. Verifique se a função `handle_new_user()` está correta
3. Veja os logs no Dashboard do Supabase

### Problema: CORS errors

**Solução:**
1. No Dashboard do Supabase, vá em **Settings** → **API**
2. Em **URL Configuration**, adicione a URL do seu frontend
3. Reinicie o servidor de desenvolvimento

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação React Query](https://tanstack.com/query/latest)
- [Guia de RLS do Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Documentação Mux](https://docs.mux.com/)

---

## ✅ Conclusão

Após seguir todos esses passos, seu projeto estará completamente integrado com o Supabase, usando autenticação real, banco de dados PostgreSQL, e Row Level Security para proteção dos dados.

**Próximos passos recomendados:**
1. Implementar integração de pagamento (Stripe/PagSeguro)
2. Adicionar upload de vídeos para Mux
3. Implementar sistema de notificações
4. Adicionar analytics e métricas
5. Otimizar SEO e performance
