"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  width?: string | number;
  height?: string | number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  width = "100%",
  height = 300,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Essaye de jouer la vidéo après que le DOM soit prêt
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Vidéo en lecture automatique");
          })
          .catch((error) => {
            console.log("Autoplay bloqué:", error);
          });
      }
    }
  }, []);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      controls
      muted
      playsInline
      style={{ borderRadius: "8px", border: "1px solid #ccc" }}
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne supporte pas la lecture vidéo.
    </video>
  );
};

export default VideoPlayer;
