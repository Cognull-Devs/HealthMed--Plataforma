import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { ShoppingCart, Play, Check, Clock, BookOpen, Award, Download, Users } from "lucide-react";
import lessonThumb from "@/assets/lesson-thumb.jpg";

const AulaPage = () => {
  const { id } = useParams();
  
  const lessonData = {
    title: "APG - Aprendizagem Baseada em Problemas",
    description: "Domine a metodologia APG com nosso curso completo. Aprenda a analisar casos clínicos de forma estruturada, desenvolva raciocínio clínico e prepare-se para as avaliações com confiança. Este curso foi desenvolvido por professores experientes e inclui material exclusivo.",
    longDescription: `O curso de APG (Aprendizagem Baseada em Problemas) foi cuidadosamente elaborado para proporcionar a você uma compreensão profunda desta metodologia ativa de ensino que é fundamental na formação médica.

Ao longo do curso, você aprenderá:
- Como identificar e delimitar problemas clínicos
- Técnicas de busca e análise de evidências científicas
- Estruturação do raciocínio diagnóstico
- Formulação de hipóteses e planos terapêuticos
- Integração de conhecimentos multidisciplinares

Nosso material é constantemente atualizado seguindo as diretrizes mais recentes, garantindo que você tenha acesso ao conteúdo mais relevante para sua formação.`,
    price: 197,
    originalPrice: 297,
    includes: [
      "Acesso vitalício ao conteúdo",
      "30+ videoaulas em HD",
      "Material de apoio em PDF",
      "Banco com 200+ questões",
      "Certificado de conclusão",
      "Suporte via WhatsApp",
      "Atualizações gratuitas",
      "Acesso mobile e desktop",
    ],
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(lessonData.price);

  const formattedOriginalPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(lessonData.originalPrice);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "1º Período", href: "/periodo/1" },
            { label: "SOI", href: "/categoria/1/soi" },
            { label: id?.toUpperCase() || "APG" }
          ]} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden health-card">
              <img 
                src={lessonThumb}
                alt={lessonData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-secondary/90 flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-secondary-foreground ml-1" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="health-badge">Aula Demonstrativa</span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <span className="text-secondary font-medium text-sm">SOI • 1º Período</span>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-2 mb-4">
                {lessonData.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {lessonData.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, value: "12h", label: "de conteúdo" },
                { icon: BookOpen, value: "30+", label: "videoaulas" },
                { icon: Award, value: "200+", label: "questões" },
                { icon: Users, value: "1.500+", label: "alunos" },
              ].map((stat, index) => (
                <div key={index} className="health-card p-4 text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-xl font-bold text-foreground block">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Detailed Description */}
            <div className="health-card p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                Sobre o Curso
              </h3>
              <div className="text-muted-foreground space-y-4 whitespace-pre-line">
                {lessonData.longDescription}
              </div>
            </div>

            {/* What's Included */}
            <div className="health-card p-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
                O que está incluso:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonData.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="health-card p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-sm text-muted-foreground line-through block">
                  {formattedOriginalPrice}
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-secondary">{formattedPrice}</span>
                  <span className="text-sm text-muted-foreground mb-1">à vista</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ou 12x de R$ 19,72
                </span>
              </div>

              <div className="space-y-3">
                <button className="health-button-primary w-full flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Comprar Agora
                </button>
                <Link to="/carrinho" className="health-button-outline w-full flex items-center justify-center gap-2">
                  Adicionar ao Carrinho
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-secondary" />
                  <span>Garantia de 7 dias</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-secondary" />
                  <span>Acesso imediato</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-secondary" />
                  <span>Pagamento seguro</span>
                </div>
              </div>
            </div>

            {/* Downloads */}
            <div className="health-card p-6">
              <h4 className="font-heading font-semibold text-foreground mb-4">
                Materiais Gratuitos
              </h4>
              <div className="space-y-3">
                {["Ementa do Curso", "Aula Demonstrativa"].map((item, index) => (
                  <button 
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                  >
                    <Download className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AulaPage;
