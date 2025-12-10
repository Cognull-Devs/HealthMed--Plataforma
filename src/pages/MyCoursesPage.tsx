import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Play, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { courses } from '@/data/courses';
import { useEffect } from 'react';

const MyCoursesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const purchasedCourses = courses.filter(
    course => user?.purchasedCourses.includes(course.id)
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </button>

          <h1 className="font-heading text-3xl font-bold mb-2">
            Minhas Aulas
          </h1>
          <p className="text-muted-foreground">
            Acesse todo o conteúdo que você adquiriu
          </p>
        </div>

        {purchasedCourses.length > 0 ? (
          <div className="grid gap-6">
            {purchasedCourses.map((course, index) => (
              <div 
                key={course.id}
                className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative w-full md:w-64 aspect-video md:aspect-auto md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  <button className="absolute inset-0 flex items-center justify-center group">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {course.subject}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  </div>
                  
                  <h3 className="font-heading font-semibold text-xl mb-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.shortDescription}
                  </p>

                  {/* Progress (placeholder) */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium text-primary">0%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center">
                  <Link to={`/assistir/${course.slug}`}>
                    <Button className="btn-primary">
                      Assistir
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 rounded-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-4">
              Você ainda não tem aulas
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Explore nossos cursos e comece a aprender medicina de forma 
              prática e objetiva.
            </p>
            <Link to="/#periodos">
              <Button className="btn-primary">
                Ver Aulas Disponíveis
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCoursesPage;
