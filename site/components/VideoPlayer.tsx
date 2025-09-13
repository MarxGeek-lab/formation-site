"use client";

import React from "react";
import ReactPlayer from "react-player";

interface VideoComponentProps {
  src: string;
  width?: string | number;
  height?: string | number;
}

const VideoComponent: React.FC<VideoComponentProps> = ({
  src,
  width = "100%",
  height = 300
}) => {
  return (
    <ReactPlayer
      src={src}
      playing={true}      
      muted={true}        
      loop={true}         
      controls={false} 
      style={{width: '100%', height: '100%', overflow: 'hidden'}}
      playsInline         
    />
  );
};

export default VideoComponent;
