import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Plataforma #1 em Medicina</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Medicina direto
              <br />
              <span className="gradient-text">ao ponto.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Acelere seus estudos com aulas objetivas, conteúdo de qualidade e metodologia comprovada. 
              Prepare-se para suas provas com quem entende do assunto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/#periodos">
                <Button className="btn-primary w-full sm:w-auto text-base px-8 py-6">
                  Ver Aulas
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="btn-secondary w-full sm:w-auto text-base px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Assistir Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-heading font-bold text-2xl">5K+</span>
                </div>
                <span className="text-sm text-muted-foreground">Alunos</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-heading font-bold text-2xl">80+</span>
                </div>
                <span className="text-sm text-muted-foreground">Aulas</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-heading font-bold text-2xl">98%</span>
                </div>
                <span className="text-sm text-muted-foreground">Aprovação</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card p-8 rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                  alt="Estudante de Medicina"
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Anatomia Humana</h3>
                    <p className="text-sm text-muted-foreground">1º Período • 8h de conteúdo</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 glass-card p-4 rounded-xl animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">2.5k estudando agora</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">+500 avaliações 5⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
