import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, History, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import StudentLessonCard from "@/components/cards/StudentLessonCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AlunoPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: BookOpen, label: "Minhas Aulas", href: "/aluno" },
    { icon: User, label: "Perfil", href: "/aluno/perfil" },
    { icon: History, label: "Histórico", href: "/aluno/historico" },
    { icon: LogOut, label: "Sair", href: "/" },
  ];

  const myLessons = [
    { id: "1", title: "APG - Aprendizagem Baseada em Problemas", progress: 75, totalLessons: 30, completedLessons: 22 },
    { id: "2", title: "HAM I - Habilidades Médicas I", progress: 40, totalLessons: 25, completedLessons: 10 },
    { id: "3", title: "PP - Prática Profissional", progress: 100, totalLessons: 20, completedLessons: 20 },
    { id: "4", title: "N1 - Preparatório Primeira Unidade", progress: 15, totalLessons: 15, completedLessons: 2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border
          transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">JS</span>
              </div>
              <div>
                <span className="font-semibold text-foreground block">João Silva</span>
                <span className="text-sm text-muted-foreground">Aluno</span>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${location.pathname === item.href 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                Minhas <span className="text-secondary">Aulas</span>
              </h1>
              <p className="text-muted-foreground">
                Continue de onde parou ou explore novos conteúdos
              </p>
            </div>

            {/* Progress Overview */}
            <div className="health-card p-6 mb-8">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                Seu Progresso Geral
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Cursos", value: "4" },
                  { label: "Aulas Concluídas", value: "54" },
                  { label: "Horas Estudadas", value: "32h" },
                  { label: "Certificados", value: "1" },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                    <span className="text-2xl font-bold text-primary">{stat.value}</span>
                    <span className="block text-sm text-muted-foreground mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myLessons.map((lesson) => (
                <StudentLessonCard key={lesson.id} {...lesson} />
              ))}
            </div>

            {/* Empty State */}
            {myLessons.length === 0 && (
              <div className="health-card p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Você ainda não tem cursos
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Explore nosso catálogo e comece a aprender hoje
                </p>
                <Link to="/" className="health-button-primary inline-flex items-center gap-2">
                  Explorar Cursos
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AlunoPage;
