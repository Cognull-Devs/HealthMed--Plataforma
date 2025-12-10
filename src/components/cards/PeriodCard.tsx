import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

interface PeriodCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

const PeriodCard = ({ id, title, description, imageUrl }: PeriodCardProps) => {
  return (
    <Link 
      to={`/periodo/${id}`}
      className="group health-card overflow-hidden block"
    >
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="health-badge">Período</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description || "Conteúdo completo para o período acadêmico"}
        </p>
        <div className="flex items-center text-primary text-sm font-medium">
          <span>Ver conteúdos</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
};

export default PeriodCard;
