import { useParams, Link } from "react-router-dom";
import { Play, Pause, Volume2, Maximize, SkipBack, SkipForward, Download, MessageSquare, CheckCircle, FileText, ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";

const PlayerPage = () => {
  const { id } = useParams();

  const courseContent = [
    { id: "1", title: "Introdução ao APG", duration: "15:32", completed: true },
    { id: "2", title: "Metodologia de Estudo", duration: "22:45", completed: true },
    { id: "3", title: "Casos Clínicos - Parte 1", duration: "35:20", completed: true },
    { id: "4", title: "Casos Clínicos - Parte 2", duration: "28:15", completed: false, current: true },
    { id: "5", title: "Raciocínio Diagnóstico", duration: "40:00", completed: false },
    { id: "6", title: "Prática Guiada", duration: "45:30", completed: false },
    { id: "7", title: "Avaliação Final", duration: "30:00", completed: false },
  ];

  const downloads = [
    { name: "Apostila Completa", type: "PDF", size: "12 MB" },
    { name: "Slides da Aula", type: "PDF", size: "5 MB" },
    { name: "Resumo Esquemático", type: "PDF", size: "2 MB" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Player Area */}
        <div className="flex-1 flex flex-col">
          {/* Back Button */}
          <div className="p-4 border-b border-border">
            <Link to="/aluno" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Voltar para Minhas Aulas</span>
            </Link>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-secondary/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-secondary-foreground ml-1" />
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1 bg-muted/50 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full w-[35%] bg-secondary rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>12:35</span>
                  <span>35:20</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-foreground hover:text-secondary transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Pause className="w-5 h-5 text-secondary-foreground" />
                  </button>
                  <button className="text-foreground hover:text-secondary transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-foreground hover:text-secondary transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button className="text-foreground hover:text-secondary transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6">
            <span className="text-secondary text-sm font-medium">Aula 4 de 7</span>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground mt-1 mb-4">
              Casos Clínicos - Parte 2
            </h1>
            <p className="text-muted-foreground">
              Nesta aula, vamos aprofundar nos casos clínicos e desenvolver o raciocínio 
              diagnóstico através de exemplos práticos.
            </p>
          </div>

          {/* Tabs (Mobile) */}
          <div className="lg:hidden border-t border-border">
            <div className="flex">
              <button className="flex-1 py-4 text-sm font-medium text-primary border-b-2 border-primary">
                Conteúdo
              </button>
              <button className="flex-1 py-4 text-sm font-medium text-muted-foreground">
                Downloads
              </button>
              <button className="flex-1 py-4 text-sm font-medium text-muted-foreground">
                Anotações
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-96 border-l border-border flex flex-col">
          {/* Tabs (Desktop) */}
          <div className="hidden lg:flex border-b border-border">
            <button className="flex-1 py-4 text-sm font-medium text-primary border-b-2 border-primary">
              Conteúdo
            </button>
            <button className="flex-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Downloads
            </button>
            <button className="flex-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Anotações
            </button>
          </div>

          {/* Course Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {courseContent.map((lesson, index) => (
                <button
                  key={lesson.id}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all
                    ${lesson.current 
                      ? 'bg-primary/10 border border-primary' 
                      : 'bg-muted/30 hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${lesson.completed 
                        ? 'bg-secondary' 
                        : lesson.current 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/30'
                      }
                    `}>
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-secondary-foreground" />
                      ) : (
                        <span className="text-xs text-foreground font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`
                        block text-sm font-medium truncate
                        ${lesson.current ? 'text-primary' : 'text-foreground'}
                      `}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </div>
                    {lesson.current && (
                      <Play className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Downloads Section */}
            <div className="p-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Materiais da Aula
              </h4>
              <div className="space-y-2">
                {downloads.map((file, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium text-foreground block">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{file.type} • {file.size}</span>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Anotações
              </h4>
              <textarea
                placeholder="Digite suas anotações aqui..."
                className="health-input min-h-[120px] resize-none"
              />
              <button className="health-button-primary w-full mt-3 text-sm">
                Salvar Anotações
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PlayerPage;
