import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useRef, useCallback } from 'react';

interface MuxVideoPlayerProps {
  playbackId: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  startTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: (currentTime: number, duration: number) => void;
}

const MuxVideoPlayer = ({ 
  playbackId, 
  title,
  poster,
  autoPlay = false,
  className = '',
  startTime = 0,
  onTimeUpdate,
  onEnded,
}: MuxVideoPlayerProps) => {
  const playerRef = useRef<any>(null);
  const hasSetStartTime = useRef(false);

  // Set start time when video is ready
  const handleLoadedMetadata = useCallback(() => {
    if (playerRef.current && startTime > 0 && !hasSetStartTime.current) {
      const player = playerRef.current;
      if (player.currentTime !== undefined) {
        player.currentTime = startTime;
        hasSetStartTime.current = true;
      }
    }
  }, [startTime]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (playerRef.current && onTimeUpdate) {
      const player = playerRef.current;
      const currentTime = player.currentTime || 0;
      const duration = player.duration || 0;
      onTimeUpdate(currentTime, duration);
    }
  }, [onTimeUpdate]);

  // Handle video ended
  const handleEnded = useCallback(() => {
    if (playerRef.current && onEnded) {
      const player = playerRef.current;
      const currentTime = player.currentTime || 0;
      const duration = player.duration || 0;
      onEnded(currentTime, duration);
    }
  }, [onEnded]);

  // Reset start time flag when playbackId changes
  useEffect(() => {
    hasSetStartTime.current = false;
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div className={`aspect-video bg-card rounded-2xl flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Vídeo não disponível</p>
      </div>
    );
  }

  return (
    <MuxPlayer
      ref={playerRef}
      playbackId={playbackId}
      metadata={{
        video_title: title,
      }}
      poster={poster}
      autoPlay={autoPlay}
      streamType="on-demand"
      primaryColor="#06b6d4"
      secondaryColor="#0f172a"
      accentColor="#06b6d4"
      className={`aspect-video rounded-2xl overflow-hidden ${className}`}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
};

export default MuxVideoPlayer;
