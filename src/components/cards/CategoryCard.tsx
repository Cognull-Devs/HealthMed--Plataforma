import { Link } from "react-router-dom";
import { Stethoscope, Brain, ArrowRight, BookMarked } from "lucide-react";

interface CategoryCardProps {
  periodoId: string;
  category: string;
  title: string;
  description: string;
  lessonCount: number;
  icon?: "stethoscope" | "brain" | "book";
}

const CategoryCard = ({ periodoId, category, title, description, lessonCount, icon = "stethoscope" }: CategoryCardProps) => {
  const IconComponent = {
    stethoscope: Stethoscope,
    brain: Brain,
    book: BookMarked,
  }[icon];

  return (
    <Link 
      to={`/categoria/${periodoId}/${category.toLowerCase()}`}
      className="group health-card p-8 flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <IconComponent className="w-10 h-10 text-primary" />
      </div>
      
      <span className="health-badge mb-4">{category}</span>
      
      <h3 className="font-heading font-bold text-2xl text-foreground group-hover:text-primary transition-colors mb-3">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        {description}
      </p>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          <span className="text-foreground font-semibold">{lessonCount}</span> aulas disponíveis
        </span>
      </div>
      
      <div className="mt-6 flex items-center text-primary font-medium">
        <span>Acessar conteúdo</span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
      </div>
    </Link>
  );
};

export default CategoryCard;
