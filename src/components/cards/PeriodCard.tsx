import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Period } from '@/data/courses';

interface PeriodCardProps {
  period: Period;
  index: number;
}

const PeriodCard = ({ period, index }: PeriodCardProps) => {
  return (
    <Link 
      to={`/periodo/${period.slug}`}
      className="group glass-card-hover p-6 flex flex-col items-center text-center"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      
      <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
        {period.name}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {period.description}
      </p>
      
      <div className="flex items-center gap-2 text-primary font-medium text-sm mt-auto">
        <span>{period.coursesCount} aulas</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default PeriodCard;
