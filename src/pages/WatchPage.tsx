import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Download, FileText, Play } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseBySlug, periods } from '@/data/courses';
import { useEffect, useCallback } from 'react';
import MuxVideoPlayer from '@/components/video/MuxVideoPlayer';
import { useVideoProgress } from '@/hooks/useVideoProgress';

const WatchPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, hasPurchased } = useAuth();
  const course = getCourseBySlug(slug || '');
  
  // Video progress hook
  const { progress, isLoading: progressLoading, saveProgress, forceSave } = useVideoProgress(slug || '');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (course && !hasPurchased(course.id)) {
      navigate(`/aula/${course.slug}`);
    }
  }, [isAuthenticated, course, hasPurchased, navigate]);

  // Handle time update - save progress every 5 seconds
  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    saveProgress(currentTime, duration);
  }, [saveProgress]);

  // Handle video ended - force save
  const handleVideoEnded = useCallback((currentTime: number, duration: number) => {
    forceSave(currentTime, duration);
  }, [forceSave]);

  // Save progress when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (progress.playbackTime > 0 && progress.duration) {
        forceSave(progress.playbackTime, progress.duration);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [progress, forceSave]);

  if (!course || !hasPurchased(course.id)) {
    return null;
  }

  const period = periods.find(p => p.id === course.periodId);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/minhas-aulas" className="text-muted-foreground hover:text-foreground transition-colors">
            Minhas Aulas
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-primary font-medium truncate max-w-[300px]">{course.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* MUX Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
              <MuxVideoPlayer 
                playbackId={course.muxPlaybackId || ''}
                title={course.title}
                poster={course.thumbnailUrl}
                startTime={progress.playbackTime}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />
            </div>
            
            {/* Progress indicator */}
            {progress.duration && progress.playbackTime > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" />
                  <span>
                    {progress.completed 
                      ? 'Aula concluída!' 
                      : `Continuar de ${formatTime(progress.playbackTime)}`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((progress.playbackTime / progress.duration) * 100, 100)}%` }}
                    />
                  </div>
                  <span>{Math.round((progress.playbackTime / progress.duration) * 100)}%</span>
                </div>
              </div>
            )}

            {/* Course Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {course.subject}
                </span>
                {period && (
                  <span className="text-sm text-muted-foreground">
                    {period.name}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-muted-foreground">
                {course.longDescription}
              </p>
            </div>
          </div>

          {/* Sidebar - Materials */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-24">
              <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Materiais da Aula
              </h2>

              <div className="space-y-3">
                <button className="w-full p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate">Slides da Aula</span>
                    <span className="text-sm text-muted-foreground">PDF • 2.5 MB</span>
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate">Material Complementar</span>
                    <span className="text-sm text-muted-foreground">PDF • 1.2 MB</span>
                  </div>
                </button>

                <button className="w-full p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate">Exercícios</span>
                    <span className="text-sm text-muted-foreground">PDF • 800 KB</span>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/minhas-aulas')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar às Minhas Aulas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WatchPage;
