import { Link } from "react-router-dom";

const CONTACT_SECTIONS = [
  { id: "customer-support", label: "Customer Support" },
  { id: "what-we-can-help-with", label: "What can we help you with?" },
  { id: "policies-information", label: "Policies & Information" },
];

const ContactUsPage = () => (
  <main className="bg-ivory min-h-[100svh] font-sans">
    <header className="border-b border-[#ddd5c8]/70 bg-ivory">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-4 md:py-6">
        <h1 className="font-display text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] font-medium leading-[1.1] tracking-[0.02em] text-[#261317] mb-2 md:mb-3">
          CONTACT US
        </h1>
        <p className="font-sans text-[13px] md:text-[14px] text-[#7a7260] leading-relaxed max-w-lg">
          We&apos;re here to help. If you have any questions or need assistance
          with your order, our customer support team is happy to assist you.
        </p>
      </div>
    </header>

    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-7 md:py-10 pb-20 md:pb-28">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-20">
        <aside className="md:w-[220px] lg:w-[240px] shrink-0">
          <nav
            className="flex flex-row md:flex-col gap-0 overflow-x-auto md:overflow-x-visible
                       -mx-6 px-6 md:mx-0 md:px-0
                       scrollbar-hide border-b border-[#ddd5c8]/60 md:border-b-0
                       pb-5 md:pb-0 mb-8 md:mb-0
                       md:sticky md:top-24 md:self-start"
            aria-label="Contact page sections"
          >
            {CONTACT_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap md:whitespace-normal text-left
                           font-sans text-[12px] md:text-[13px] tracking-[0.04em]
                           py-2 md:py-3 pr-5 md:pr-0
                           border-b-2 md:border-b-0 md:border-l-2 border-transparent
                           text-[#9a9080] hover:text-[#3d3929] md:pl-4
                           transition-colors duration-250"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="flex-1 min-w-0 md:pt-3 policy-prose">
          <h2 id="customer-support">Customer Support</h2>
          <p>
            Email:{" "}
            <a href="mailto:support@cogenesis.in">support@cogenesis.in</a>
          </p>

          <h2 id="what-we-can-help-with">What can we help you with?</h2>
          <p>Customers can contact us regarding:</p>
          <ul>
            <li>Order-related queries</li>
            <li>Returns and refunds</li>
            <li>Size exchanges</li>
            <li>Shipping and delivery issues</li>
            <li>Damaged, defective, or incorrect products</li>
            <li>Product information and general enquiries</li>
            <li>Any other assistance related to their shopping experience</li>
          </ul>
          <p>
            For assistance, please email us at{" "}
            <a href="mailto:support@cogenesis.in">support@cogenesis.in</a> with
            your order number (if applicable) and a brief description of your
            concern. Our team will review your request and get back to you.
          </p>

          <h2 id="policies-information">POLICIES &amp; INFORMATION</h2>
          <p>
            For more information about our services, orders, and customer
            policies, please explore the following pages.
          </p>
          <ul>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link to="/shipping-policy">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/refund-policy">Return &amp; Refund Policy</Link>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </main>
);

export default ContactUsPage;
