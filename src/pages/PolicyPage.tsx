import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllPolicies, type PolicyKey, type ShopifyPolicy } from "../services/policy.service";

// ── Policy navigation config ────────────────────────────────────────────────
const POLICY_NAV: { key: PolicyKey; label: string; route: string; subtitle: string }[] = [
  {
    key: "privacyPolicy",
    label: "Privacy Policy",
    route: "/privacy-policy",
    subtitle: "How we collect, use and protect your personal information.",
  },
  {
    key: "refundPolicy",
    label: "Refund Policy",
    route: "/refund-policy",
    subtitle: "Our returns, exchanges and refund procedures.",
  },
  {
    key: "shippingPolicy",
    label: "Shipping Policy",
    route: "/shipping-policy",
    subtitle: "Delivery timelines, carriers and shipping destinations.",
  },
  {
    key: "termsOfService",
    label: "Terms of Service",
    route: "/terms-and-conditions",
    subtitle: "Terms governing your use of this website and our services.",
  },
];

const LOCAL_POLICY_FALLBACKS: Partial<Record<PolicyKey, ShopifyPolicy>> = {
  privacyPolicy: {
    title: "Privacy Policy",
    url: "/privacy-policy",
    body: `
      <h2>Privacy Policy</h2>
      <p>We respect your privacy. This policy describes how information may be collected, used, and protected when you use our website and services.</p>
      <p>Information provided when you place an order, create an account, or contact us is used to provide and support the services you request.</p>
      <p>For questions about this policy or requests concerning your personal information, please contact us using the details provided on this website.</p>
    `,
  },
  termsOfService: {
    title: "Terms & Conditions",
    url: "/terms-and-conditions",
    body: `
      <h2>Terms &amp; Conditions</h2>
      <p>These terms govern your access to and use of this website and the services offered through it.</p>
      <p>Product information and availability may change. Orders are subject to product availability and confirmation.</p>
      <p>We may update these terms from time to time. Your continued use of the website after changes are posted indicates your acceptance of the updated terms.</p>
      <p>For questions about these terms, please contact us using the details provided on this website.</p>
    `,
  },
};

// ── Loading skeleton ─────────────────────────────────────────────────────────
const PolicySkeleton = () => (
  <div className="animate-pulse">
    {/* Eyebrow */}
    <div className="h-3 bg-[#e4ddd4] rounded w-40 mb-5" />
    {/* Title */}
    <div className="h-10 bg-[#e4ddd4] rounded w-72 mb-3" />
    {/* Subtitle */}
    <div className="h-4 bg-[#ede8e1] rounded w-56 mb-8" />
    {/* Body lines */}
    <div className="space-y-4">
      {[100, 95, 88, 100, 72, 94, 83, 100, 60, 90].map((w, i) => (
        <div
          key={i}
          className="h-3.5 bg-[#ede8e1] rounded"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
interface PolicyPageProps {
  policyKey: PolicyKey;
}

const PolicyPage = ({ policyKey }: PolicyPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [policies, setPolicies] = useState<Record<PolicyKey, ShopifyPolicy | null>>({
    privacyPolicy: null,
    refundPolicy: null,
    shippingPolicy: null,
    termsOfService: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all policies once so nav switches are instant
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllPolicies()
      .then((data) => {
        if (!cancelled) setPolicies(data as Record<PolicyKey, ShopifyPolicy | null>);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load policies. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const activePolicy = policies[policyKey]?.body.trim()
    ? policies[policyKey]
    : LOCAL_POLICY_FALLBACKS[policyKey] ?? null;
  const activeMeta = POLICY_NAV.find((n) => n.key === policyKey)!;

  // Scroll to top when policyKey changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [policyKey, location.pathname]);

  return (
    <main className="bg-ivory min-h-[100svh] font-sans">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#ddd5c8]/70 bg-ivory">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-4 md:py-6">
          {/* Title */}
          <h1 className="font-display text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] font-medium leading-[1.1] tracking-[0.02em] text-[#261317] mb-2 md:mb-3">
            {loading ? (
              <span className="inline-block h-10 w-72 bg-[#e4ddd4] rounded animate-pulse" />
            ) : (
              activeMeta.label
            )}
          </h1>
          {/* Subtitle */}
          <p className="font-sans text-[13px] md:text-[14px] text-[#7a7260] leading-relaxed max-w-lg">
            {activeMeta.subtitle}
          </p>
        </div>
      </header>

      {/* ── Layout: Nav sidebar + Content ───────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-7 md:py-10 pb-20 md:pb-28">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-20">

          {/* ── Policy Navigation ──────────────────────────────────────── */}
          <aside className="md:w-[220px] lg:w-[240px] shrink-0">
            {/* Mobile: horizontal scrollable row */}
            <nav
              className="flex flex-row md:flex-col gap-0 overflow-x-auto md:overflow-x-visible
                         -mx-6 px-6 md:mx-0 md:px-0
                         scrollbar-hide border-b border-[#ddd5c8]/60 md:border-b-0
                         pb-5 md:pb-0 mb-8 md:mb-0
                         md:sticky md:top-24 md:self-start"
              aria-label="Policy navigation"
            >
              {POLICY_NAV.map((item) => {
                const isActive = item.key === policyKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className={[
                      "whitespace-nowrap md:whitespace-normal text-left",
                      "font-sans text-[12px] md:text-[13px] tracking-[0.04em]",
                      "py-2 md:py-3 pr-5 md:pr-0",
                      "border-b-2 md:border-b-0 md:border-l-2",
                      "transition-colors duration-250",
                      isActive
                        ? "border-[#65220e] text-[#1a1512] font-semibold md:pl-4"
                        : "border-transparent text-[#9a9080] hover:text-[#3d3929] md:pl-4",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Policy Content ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 md:pt-3">

            {/* Loading */}
            {loading && <PolicySkeleton />}

            {/* Error */}
            {!loading && error && !activePolicy && (
              <div className="py-20 text-center">
                <p className="font-sans text-[13px] text-[#9a9080] leading-relaxed">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 font-sans text-[11px] tracking-[0.18em] uppercase text-[#65220e] border-b border-[#65220e]/50 hover:border-[#65220e] transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Not configured */}
            {!loading && !error && !activePolicy && (
              <div className="py-20 text-center">
                <p className="font-display text-xl text-[#c8b89a] mb-3">—</p>
                <p className="font-sans text-[13px] text-[#9a9080] leading-relaxed">
                  This policy has not been configured yet.
                </p>
              </div>
            )}

            {/* Content */}
            {!loading && activePolicy && (
              <article>
                {/* Shopify HTML body */}
                <div
                  className="policy-prose"
                  dangerouslySetInnerHTML={{ __html: activePolicy.body }}
                />
              </article>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PolicyPage;
