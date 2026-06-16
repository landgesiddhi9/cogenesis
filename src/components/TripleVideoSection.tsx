import { useEffect, useRef } from 'react';
import { aboutTripleVideo } from '../data/mockData';

const COLUMN_OFFSETS = aboutTripleVideo.offsets;

const TripleVideoSection = () => {
  const leftRef = useRef<HTMLVideoElement>(null);
  const centerRef = useRef<HTMLVideoElement>(null);
  const rightRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = [
      { ref: leftRef, offset: COLUMN_OFFSETS[0] },
      { ref: centerRef, offset: COLUMN_OFFSETS[1] },
      { ref: rightRef, offset: COLUMN_OFFSETS[2] },
    ];

    const startVideo = (video: HTMLVideoElement, offset: number) => {
      video.defaultMuted = true;
      video.muted = true;

      const playFromOffset = () => {
        if (video.duration && offset < video.duration) {
          video.currentTime = offset;
        }
        video.play().catch(() => {
          // Autoplay may be blocked until user interaction on some browsers
        });
      };

      if (video.readyState >= 1) {
        playFromOffset();
      } else {
        video.addEventListener('loadedmetadata', playFromOffset, { once: true });
      }
    };

    videos.forEach(({ ref, offset }) => {
      if (ref.current) {
        startVideo(ref.current, offset);
      }
    });
  }, []);

  const videoProps = {
    src: aboutTripleVideo.src,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: 'auto' as const,
    disablePictureInPicture: true,
    controls: false,
    controlsList: 'nodownload nofullscreen noremoteplayback',
  };

  return (
    <section className="triple-video section-media">
      <div className="left">
        <video ref={leftRef} {...videoProps} />
      </div>
      <div className="center">
        <video ref={centerRef} {...videoProps} />
      </div>
      <div className="right">
        <video ref={rightRef} {...videoProps} />
      </div>
    </section>
  );
};

export default TripleVideoSection;
