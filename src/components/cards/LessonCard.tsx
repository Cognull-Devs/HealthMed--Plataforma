import { Link } from "react-router-dom";
import { Play, Clock, Star, BookOpen } from "lucide-react";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  duration?: string;
  rating?: number;
  lessons?: number;
}

const LessonCard = ({ 
  id, 
  title, 
  description, 
  price, 
  originalPrice, 
  imageUrl, 
  duration = "10h",
  rating = 4.8,
  lessons = 12
}: LessonCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  const formattedOriginalPrice = originalPrice ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(originalPrice) : null;

  return (
    <Link 
      to={`/aula/${id}`}
      className="group health-card overflow-hidden flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-secondary-foreground ml-1" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lessons} aulas</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div>
            {formattedOriginalPrice && (
              <span className="text-xs text-muted-foreground line-through block">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="health-price">{formattedPrice}</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
            Ver detalhes
          </button>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard;
