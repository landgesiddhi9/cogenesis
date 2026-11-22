import HomepageProductLink from './HomepageProductLink';

const Section5Banner = () => {
  return (
    <section
      className="w-full bg-ivory py-16 border-t border-[#431C1C]/10"
      style={{ paddingLeft: '40px', paddingRight: '40px' }}
    >
      <HomepageProductLink productKey="section5">
        <div
          className="relative w-full overflow-hidden"
          style={{ maxWidth: '1440px', height: 'clamp(420px, 58vw, 760px)', margin: '0 auto' }}
        >
          <img
            src="/images/section5image.jpg"
            alt="COGENESIS editorial showcase"
            className="absolute inset-0 block h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </HomepageProductLink>
    </section>
  );
};

export default Section5Banner;
