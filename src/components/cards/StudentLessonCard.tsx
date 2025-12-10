import { Link } from "react-router-dom";
import { Play, CheckCircle, BookOpen } from "lucide-react";

interface StudentLessonCardProps {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  imageUrl?: string;
}

const StudentLessonCard = ({ 
  id, 
  title, 
  progress, 
  totalLessons, 
  completedLessons,
  imageUrl 
}: StudentLessonCardProps) => {
  return (
    <Link to={`/aluno/aula/${id}`} className="group health-card overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-secondary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
            <Play className="w-5 h-5 text-secondary-foreground ml-0.5" />
          </div>
        </div>

        {/* Progress Badge */}
        {progress === 100 && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="w-6 h-6 text-secondary fill-secondary" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
          {title}
        </h4>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{completedLessons} de {totalLessons} aulas</span>
            <span className="text-secondary font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button className="w-full mt-4 py-2 text-sm font-medium text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-all">
          {progress === 100 ? "Revisar" : "Continuar"}
        </button>
      </div>
    </Link>
  );
};

export default StudentLessonCard;
