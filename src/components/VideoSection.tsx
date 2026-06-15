import { useEffect, useRef, useState } from 'react';
import { editorialVideo } from '../data/mockData';

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState(editorialVideo.src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const play = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay may be blocked until user interaction on some browsers
        });
      }
    };

    if (video.readyState >= 2) {
      play();
    } else {
      video.addEventListener('loadeddata', play, { once: true });
    }

    return () => {
      video.removeEventListener('loadeddata', play);
    };
  }, [videoSrc]);

  const handleError = () => {
    if (editorialVideo.fallbackSrc && videoSrc !== editorialVideo.fallbackSrc) {
      setVideoSrc(editorialVideo.fallbackSrc);
    }
  };

  return (
    <section className="campaign-film">
      <video
        key={videoSrc}
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        onError={handleError}
      />
    </section>
  );
};

export default VideoSection;
