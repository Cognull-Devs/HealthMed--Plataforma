import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VideoProgress {
  playbackTime: number;
  duration: number | null;
  completed: boolean;
}

export const useVideoProgress = (courseSlug: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<VideoProgress>({
    playbackTime: 0,
    duration: null,
    completed: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const lastSavedTime = useRef(0);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id || !courseSlug) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('video_progress')
          .select('playback_time, duration, completed')
          .eq('user_id', user.id)
          .eq('course_slug', courseSlug)
          .maybeSingle();

        if (error) {
          console.error('Error loading video progress:', error);
        } else if (data) {
          setProgress({
            playbackTime: Number(data.playback_time) || 0,
            duration: data.duration ? Number(data.duration) : null,
            completed: data.completed || false,
          });
          lastSavedTime.current = Number(data.playback_time) || 0;
        }
      } catch (err) {
        console.error('Error loading video progress:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user?.id, courseSlug]);

  // Save progress (debounced - only save if time changed significantly)
  const saveProgress = useCallback(async (currentTime: number, duration: number) => {
    if (!user?.id || !courseSlug) return;

    // Only save if time changed by more than 5 seconds
    if (Math.abs(currentTime - lastSavedTime.current) < 5) return;

    const completed = duration > 0 && currentTime >= duration * 0.9;

    try {
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          course_slug: courseSlug,
          playback_time: currentTime,
          duration: duration,
          completed: completed,
        }, {
          onConflict: 'user_id,course_slug',
        });

      if (error) {
        console.error('Error saving video progress:', error);
      } else {
        lastSavedTime.current = currentTime;
        setProgress({
          playbackTime: currentTime,
          duration: duration,
          completed: completed,
        });
      }
    } catch (err) {
      console.error('Error saving video progress:', err);
    }
  }, [user?.id, courseSlug]);

  // Force save (for when video ends or user leaves)
  const forceSave = useCallback(async (currentTime: number, duration: number) => {
    if (!user?.id || !courseSlug) return;

    const completed = duration > 0 && currentTime >= duration * 0.9;

    try {
      await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          course_slug: courseSlug,
          playback_time: currentTime,
          duration: duration,
          completed: completed,
        }, {
          onConflict: 'user_id,course_slug',
        });

      lastSavedTime.current = currentTime;
    } catch (err) {
      console.error('Error force saving video progress:', err);
    }
  }, [user?.id, courseSlug]);

  return {
    progress,
    isLoading,
    saveProgress,
    forceSave,
  };
};
