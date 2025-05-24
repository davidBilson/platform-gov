export const formatDuration = (duration: number): string => {
  const seconds = duration > 86400 ? Math.floor(duration / 1000) : duration;

  const cappedSeconds = Math.min(seconds, 86400);
  
  const hours = Math.floor(cappedSeconds / 3600);
  const minutes = Math.floor((cappedSeconds % 3600) / 60);
  const remainingSeconds = cappedSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

};