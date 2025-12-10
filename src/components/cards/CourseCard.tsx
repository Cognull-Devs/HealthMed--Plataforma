import { Link } from 'react-router-dom';
import { Clock, Star, Users, ShoppingCart, Check } from 'lucide-react';
import { Course } from '@/data/courses';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CourseCardProps {
  course: Course;
  index?: number;
}

const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  const { addToCart, isInCart } = useCart();
  const { hasPurchased } = useAuth();
  
  const isPurchased = hasPurchased(course.id);
  const inCart = isInCart(course.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPurchased) {
      toast.info('Você já possui essa aula!');
      return;
    }
    
    if (inCart) {
      toast.info('Aula já está no carrinho!');
      return;
    }
    
    addToCart(course);
    toast.success('Aula adicionada ao carrinho!');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const installmentPrice = (course.price / 3).toFixed(2).replace('.', ',');

  return (
    <div 
      className="group glass-card-hover overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/aula/${course.slug}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Duration Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium">{course.duration}</span>
          </div>

          {/* Rating Badge */}
          {course.rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-md">
              <Star className="w-3 h-3 fill-primary-foreground text-primary-foreground" />
              <span className="text-xs font-bold text-primary-foreground">{course.rating}</span>
            </div>
          )}

          {/* Purchased Badge */}
          {isPurchased && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-md">
              <Check className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">Adquirido</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              {course.subject}
            </span>
            {course.studentsCount && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {course.studentsCount.toLocaleString()}
              </span>
            )}
          </div>
          
          <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {course.shortDescription}
          </p>
          
          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through block">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
              <span className="card-price">{formatPrice(course.price)}</span>
              <span className="card-price-installment block">
                ou 3x de R$ {installmentPrice}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <Button 
          onClick={handleAddToCart}
          disabled={isPurchased}
          className={`w-full ${isPurchased ? 'bg-green-500/20 text-green-500' : inCart ? 'bg-secondary' : 'btn-primary'}`}
          variant={isPurchased ? 'ghost' : inCart ? 'secondary' : 'default'}
        >
          {isPurchased ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Acessar Aula
            </>
          ) : inCart ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              No Carrinho
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
