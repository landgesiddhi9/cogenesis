import { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { campaignData } from '../data/mockData';

const CampaignBanner = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, []);

  return (
    <section
      ref={ref}
      className="campaign-banner"
    >
      {campaignData.video ? (
        <video
          ref={videoRef}
          src={campaignData.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          className="media-cover absolute inset-0 m-0 p-0"
        />
      ) : (
        campaignData.image && (
          <img
            src={campaignData.image.src}
            alt={campaignData.image.alt}
            className={`media-cover absolute inset-0 transition-transform duration-[2500ms] ease-out ${
              isInView ? 'scale-100' : 'scale-110'
            }`}
            loading="lazy"
          />
        )
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/30 via-transparent to-transparent" />

      {campaignData.title && (
        <div
          className={`absolute bottom-10 md:bottom-16 left-6 md:left-12 lg:left-16 transition-all duration-1000 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="font-accent text-[9px] tracking-wide-editorial uppercase text-white/70 block mb-3">
            {campaignData.subtitle}
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white tracking-wide">
            {campaignData.title}
          </h2>
        </div>
      )}
    </section>
  );
};

export default CampaignBanner;
