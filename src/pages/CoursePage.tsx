import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Clock, Star, Users, Check, ShoppingCart, 
  Play, BookOpen, FileText, Award, ArrowLeft 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getCourseBySlug, getPeriodBySlug, periods } from '@/data/courses';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CoursePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = getCourseBySlug(slug || '');
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated, hasPurchased } = useAuth();

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Aula não encontrada</h1>
          <Link to="/" className="text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  const period = periods.find(p => p.id === course.periodId);
  const isPurchased = hasPurchased(course.id);
  const inCart = isInCart(course.id);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const installmentPrice = (course.price / 3).toFixed(2).replace('.', ',');

  const handleAddToCart = () => {
    if (isPurchased) {
      navigate('/minhas-aulas');
      return;
    }
    
    if (!isAuthenticated) {
      toast.info('Faça login para continuar');
      navigate('/auth');
      return;
    }
    
    addToCart(course);
    toast.success('Aula adicionada ao carrinho!');
  };

  const handleBuyNow = () => {
    if (isPurchased) {
      navigate('/minhas-aulas');
      return;
    }
    
    if (!isAuthenticated) {
      toast.info('Faça login para continuar');
      navigate('/auth');
      return;
    }
    
    if (!inCart) {
      addToCart(course);
    }
    navigate('/carrinho');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {period && (
            <>
              <Link 
                to={`/periodo/${period.slug}`} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {period.name}
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </>
          )}
          <span className="text-primary font-medium truncate max-w-[200px]">{course.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Preview */}
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors group">
                  <Play className="w-8 h-8 text-primary-foreground ml-1 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              
              {isPurchased && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500 px-4 py-2 rounded-lg">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Você já possui esta aula</span>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {course.subject}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{course.duration}</span>
                </div>
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                )}
                {course.studentsCount && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{course.studentsCount.toLocaleString()} alunos</span>
                  </div>
                )}
              </div>
              
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {course.longDescription}
              </p>
            </div>

            {/* What's Included */}
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                O que está incluso
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {course.includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-24">
              {/* Price */}
              <div className="mb-6">
                {course.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through block">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(course.price)}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ou 3x de R$ {installmentPrice} sem juros
                </span>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  onClick={handleBuyNow}
                  className="btn-primary w-full py-6 text-base"
                >
                  {isPurchased ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Acessar Aula
                    </>
                  ) : (
                    'Comprar Agora'
                  )}
                </Button>
                
                {!isPurchased && (
                  <Button 
                    onClick={handleAddToCart}
                    variant="outline"
                    className="btn-secondary w-full py-6 text-base"
                    disabled={inCart}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        No Carrinho
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 border-t border-border pt-6">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  {course.duration} de conteúdo
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Material para download
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-primary" />
                  Certificado de conclusão
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Acesso vitalício
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursePage;
