import Layout from "@/components/layout/Layout";
import PeriodCard from "@/components/cards/PeriodCard";
import { ArrowRight, BookOpen, Users, Award, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";
import period1 from "@/assets/period-1.jpg";
import period2 from "@/assets/period-2.jpg";
import period3 from "@/assets/period-3.jpg";

const Index = () => {
  const periods = [
    { id: "1", title: "1º Período", description: "Fundamentos da medicina e ciências básicas", imageUrl: period1 },
    { id: "2", title: "2º Período", description: "Aprofundamento em sistemas orgânicos", imageUrl: period2 },
    { id: "3", title: "3º Período", description: "Patologia e farmacologia avançada", imageUrl: period3 },
  ];

  const stats = [
    { icon: BookOpen, value: "500+", label: "Aulas disponíveis" },
    { icon: Users, value: "10.000+", label: "Alunos aprovados" },
    { icon: Award, value: "98%", label: "Taxa de aprovação" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="HealthMed - Medicina direto ao ponto"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Plataforma #1 em Medicina
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Medicina direto{" "}
              <span className="health-gradient-text">ao ponto.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 animate-fade-in max-w-lg" style={{ animationDelay: "0.2s" }}>
              Domine os conteúdos essenciais da medicina com aulas objetivas, 
              resumos práticos e questões comentadas. Sua aprovação começa aqui.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/periodo/1" className="health-button-primary inline-flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Começar Agora
              </Link>
              <Link to="/aluno" className="health-button-outline inline-flex items-center justify-center gap-2">
                Área do Aluno
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-secondary hidden sm:block" />
                    <span className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Periods Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="health-badge mb-4">Conteúdos</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha seu <span className="text-secondary">Período</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Conteúdos organizados por período acadêmico para facilitar seus estudos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {periods.map((period) => (
              <PeriodCard key={period.id} {...period} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/periodo/1" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium">
              Ver todos os períodos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="health-badge mb-4">Por que escolher</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                A plataforma mais completa para{" "}
                <span className="text-primary">estudantes de medicina</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Desenvolvida por médicos e professores experientes, nossa plataforma 
                oferece todo o suporte que você precisa para conquistar sua aprovação.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Aulas Objetivas", desc: "Conteúdo direto ao ponto, sem enrolação" },
                  { title: "Material Atualizado", desc: "Sempre alinhado com as últimas diretrizes" },
                  { title: "Questões Comentadas", desc: "Pratique com exercícios explicados" },
                  { title: "Suporte Dedicado", desc: "Tire suas dúvidas com especialistas" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="health-card p-8 relative z-10">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-pulse-slow">
                    <Play className="w-8 h-8 text-secondary-foreground ml-1" />
                  </div>
                </div>
                <div className="mt-6">
                  <span className="text-xs text-secondary font-medium">AULA DEMONSTRATIVA</span>
                  <h4 className="font-heading font-semibold text-lg text-foreground mt-1">
                    Conheça nossa metodologia
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Veja como nossos conteúdos podem acelerar seus estudos
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4">
          <div className="health-card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Pronto para começar sua jornada?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Junte-se a milhares de estudantes que já conquistaram seus objetivos com a HealthMed
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/periodo/1" className="health-button-primary inline-flex items-center justify-center gap-2">
                  Ver Cursos Disponíveis
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/carrinho" className="health-button-outline inline-flex items-center justify-center">
                  Ir para o Carrinho
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
