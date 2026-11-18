import { useEffect, useState } from "react";
import { getShopifyPage, type ShopifyPage } from "../services/page.service";

// ── Loading skeleton — mirrors the policy page skeleton ──────────────────────
const PageSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-[#e4ddd4] rounded w-72 mb-3" />
    <div className="h-4 bg-[#ede8e1] rounded w-48 mb-8" />
    <div className="h-px bg-[#ddd5c8] mb-10" />
    <div className="space-y-4">
      {[100, 95, 88, 100, 72, 94, 83, 100, 60, 90].map((w, i) => (
        <div key={i} className="h-3.5 bg-[#ede8e1] rounded" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
interface ShopifyContentPageProps {
  /** Shopify page handle, e.g. "fabric-and-care-guide" */
  handle: string;
  /** Optional short subtitle shown below the title */
  subtitle?: string;
}

const ShopifyContentPage = ({ handle, subtitle }: ShopifyContentPageProps) => {
  const [page, setPage] = useState<ShopifyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(null);

    getShopifyPage(handle)
      .then((data) => { if (!cancelled) setPage(data); })
      .catch(() => { if (!cancelled) setError("Unable to load this page. Please try again later."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [handle]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [handle]);

  const hasBody = Boolean(page?.body?.trim());

  return (
    <main className="bg-ivory min-h-[100svh]">
      {/* Fixed navbar spacer */}
      <div className="h-14 md:h-16" />

      {/* ── Page Header — identical structure to PolicyPage ───────────── */}
      <header className="border-b border-[#ddd5c8]/70 bg-ivory">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-6 md:py-8">
          {/* Title */}
          <h1 className="font-display text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold leading-[1.1] tracking-[0.02em] text-[#1a1512] mb-2 md:mb-3">
            {loading ? (
              <span className="inline-block h-10 w-72 bg-[#e4ddd4] rounded animate-pulse" />
            ) : (
              page?.title ?? "Fabric and Care Guide"
            )}
          </h1>
          {/* Subtitle */}
          {subtitle && (
            <p className="font-sans text-[13px] md:text-[14px] text-[#7a7260] leading-relaxed max-w-lg">
              {subtitle}
            </p>
          )}
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-7 md:py-10 pb-20 md:pb-28">

        {/* Loading */}
        {loading && <PageSkeleton />}

        {/* Error */}
        {!loading && error && (
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

        {/* Not found */}
        {!loading && !error && !page && (
          <div className="py-20 text-center">
            <p className="font-display text-xl text-[#c8b89a] mb-3">—</p>
            <p className="font-sans text-[13px] text-[#9a9080] leading-relaxed">
              This page has not been published yet.
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && page && (
          <article>
            <div className="h-px bg-[#ddd5c8]/70 mb-8 md:mb-10" />
            <div
              className="policy-prose"
              dangerouslySetInnerHTML={{ __html: hasBody ? page.body : "<p class='text-center text-[#9a9080]'>No content available for this page.</p>" }}
            />
          </article>
        )}
      </div>
    </main>
  );
};

export default ShopifyContentPage;
