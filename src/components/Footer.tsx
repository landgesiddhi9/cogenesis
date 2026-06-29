import { useState } from "react";
import allPaymentIcons from "../assets/payments/all in one.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:newsletter@cogenesis.com?subject=Newsletter Subscription&body=Please subscribe me with email: ${email}`;
      setEmail("");
    }
  };

  return (
    <footer className="section-content bg-[#f0ece4]" id="site-footer">
      {/* Main footer content — reduced vertical padding ~18% */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          {/* Left — Logo + Description + Newsletter */}
          <div className="md:col-span-4 lg:col-span-4" style={{ marginLeft: '-0.5cm' }}>
            {/* Logo — monogram + wordmark lockup (same as header) */}
            <div className="flex items-center gap-4 mb-7" id="footer-logo">
              <img
                src="/images/Monogram.png"
                alt="Cogenesis Monogram"
                className="h-[70px] w-auto object-contain shrink-0 logo-monogram"
                style={{ marginLeft: '-0.5cm' }}
              />
              <div className="logo-wordmark" style={{ width: 216, height: 35, overflow: 'hidden', flexShrink: 0, marginLeft: '-1cm' }}>
                <img
                  src="/images/logo.png"
                  alt="COGENESIS"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
            {/* Description — tighter to logo (mb-1.5 above), then large gap to newsletter */}
            <p className="font-sans text-[15px] text-[#7a7260] leading-[1.75] max-w-[420px] mb-14" style={{ marginTop: '-0.5cm' }}>
              A premium menswear label devoted to timeless
              <br />
              shirts and trousers for the modern gentleman.
            </p>

            {/* Newsletter — pushed further down via mb-14 above */}
            <h3 className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#65220e] mb-1 font-semibold pb-1.5 border-b border-[#65220e]/40 inline-block">
              Newsletter
            </h3>
            <div className="mt-4">
              <form
                onSubmit={handleSubscribe}
                className="flex items-center border-b border-[#b5a978] max-w-[420px]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-transparent font-sans text-[13px] text-[#3d3929] placeholder:text-[#a09882] py-2.5 pr-3 outline-none"
                  id="footer-email-input"
                />
                <button
                  type="submit"
                  className="font-sans text-[11px] tracking-[0.15em] uppercase text-[#3d3929] hover:text-[#3d3929] transition-colors duration-300 py-2.5 pl-3 font-semibold"
                  id="footer-subscribe-btn"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Shop — even 2-col with left padding for breathing room */}
          <div className="md:col-span-2 lg:col-span-2 md:pl-6">
            <h4 className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#65220e] mb-1 font-semibold pb-1.5 border-b border-[#65220e]/40 inline-block">
              Shop
            </h4>
            <ul className="space-y-3 mt-4">
              <li>
                <a
                  href="/men/view-all"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Men
                </a>
              </li>
              <li>
                <a
                  href="/women"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Women
                </a>
              </li>
              <li>
                <a
                  href="/fabric"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Fabric
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-3 lg:col-span-3 md:pl-4">
            <h4 className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#65220e] mb-1 font-semibold pb-1.5 border-b border-[#65220e]/40 inline-block">
              Customer Care
            </h4>
            <ul className="space-y-3 mt-4">
              <li>
                <a
                  href="/contact"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Company + Follow Us */}
          <div className="md:col-span-3 lg:col-span-3 md:pl-4">
            <h4 className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#65220e] mb-1 font-semibold pb-1.5 border-b border-[#65220e]/40 inline-block">
              Company
            </h4>
            <ul className="space-y-3 mt-4 mb-20">
              <li>
                <a
                  href="/about"
                  className="font-sans text-[13px] text-[#7a7260] hover:text-[#3d3929] transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
            </ul>

            {/* Follow Us — pushed lower (mb-12 above), underline added to heading */}
            <h4 className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#65220e] mb-1 font-semibold pb-1.5 border-b border-[#65220e]/40 inline-block">
              Follow Us
            </h4>
            <div className="flex items-center gap-3.5 mt-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/cogenesis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#65220e] flex items-center justify-center hover:bg-[#5a2a2a] transition-colors duration-300"
                aria-label="Instagram"
                id="footer-instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1.2"
                    fill="white"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/cogenesis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#65220e] flex items-center justify-center hover:bg-[#5a2a2a] transition-colors duration-300"
                aria-label="X"
                id="footer-x"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@cogenesis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#65220e] flex items-center justify-center hover:bg-[#5a2a2a] transition-colors duration-300"
                aria-label="YouTube"
                id="footer-youtube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/cogenesis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#65220e] flex items-center justify-center hover:bg-[#5a2a2a] transition-colors duration-300"
                aria-label="LinkedIn"
                id="footer-linkedin"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://www.pinterest.com/cogenesis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#65220e] flex items-center justify-center hover:bg-[#5a2a2a] transition-colors duration-300"
                aria-label="Pinterest"
                id="footer-pinterest"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
                </svg>
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.net/@cogenesis"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#65220e] flex items-center justify-center hover:bg-[#5a2a2a] transition-colors duration-300"
                aria-label="Threads"
                id="footer-threads"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M12.186 24h-.007C5.461 23.956.057 18.521 0 11.799 0 11.742 0 11.686 0 11.63.057 4.908 5.461-.528 12.179-.572h.007C18.907-.528 24.311 4.908 24.368 11.63c0 .056 0 .112 0 .169C24.311 18.521 18.907 23.956 12.186 24zm.068-22.164h-.005C6.592 1.879 2.063 6.434 2.008 11.799v.042c.055 5.365 4.584 9.92 11.241 9.963h.005c6.657-.043 11.186-4.598 11.241-9.963v-.042c-.055-5.365-4.584-9.92-11.241-9.963zM16.87 13.3c-.21-1.383-1.174-2.447-2.862-3.158a.413.413 0 0 0-.086-.031c-.92-.36-1.967-.552-3.108-.568h-.044c-1.14.016-2.188.208-3.108.568a.413.413 0 0 0-.086.031C5.888 10.853 4.924 11.917 4.714 13.3c-.137.904-.05 1.826.254 2.672.573 1.598 1.83 2.761 3.543 3.275.897.27 1.85.407 2.832.407h.082c.982 0 1.935-.137 2.832-.407 1.713-.514 2.97-1.677 3.543-3.275.304-.846.391-1.768.254-2.672h-.184zm-1.697 2.297c-.406 1.135-1.274 1.955-2.514 2.327-.717.215-1.478.325-2.262.325h-.066c-.784 0-1.545-.11-2.262-.325-1.24-.372-2.108-1.192-2.514-2.327-.212-.591-.277-1.221-.189-1.823.143-.941.815-1.712 1.997-2.293.79-.308 1.666-.472 2.605-.486h.036c.939.014 1.815.178 2.605.486 1.182.581 1.854 1.352 1.997 2.293.088.602.023 1.232-.189 1.823h-.244z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#c9c0a8]/40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-4 flex flex-col items-center">
          <div className="flex items-center justify-center mb-3">
            <img src={allPaymentIcons} alt="Accepted payment methods" className="h-8 w-auto" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-[#a09882] text-center">
            © {new Date().getFullYear()} Cogenesis. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
