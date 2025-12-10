import { useParams, Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CourseCard from '@/components/cards/CourseCard';
import { getPeriodBySlug, getCoursesByPeriod } from '@/data/courses';

const PeriodPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const period = getPeriodBySlug(slug || '');
  const courses = getCoursesByPeriod(slug || '');

  if (!period) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Período não encontrado</h1>
          <Link to="/" className="text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Início
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/#periodos" className="text-muted-foreground hover:text-foreground transition-colors">
              Períodos
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-primary font-medium">{period.name}</span>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">
                {period.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {period.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                Cursos ({courses.length})
              </span>
            </div>
            
            <button className="btn-ghost flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-xl mb-2">
                Em breve!
              </h3>
              <p className="text-muted-foreground">
                Novas aulas para este período serão adicionadas em breve.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PeriodPage;
