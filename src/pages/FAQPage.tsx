import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import faqData from "../data/faqData";
import { fetchShopifyPolicies, type PolicyKey, type ShopifyPolicy } from "../services/policy.service";
import { getShopifyPage, type ShopifyPage } from "../services/page.service";

interface FAQContentSource {
  id: string;
  label: string;
  body: string;
}

const POLICY_SOURCES: {
  key: PolicyKey;
  id: string;
  label: string;
}[] = [
  { key: "privacyPolicy", id: "privacyPolicy", label: "Privacy Policy" },
  { key: "refundPolicy", id: "refundPolicy", label: "Refund Policy" },
  { key: "shippingPolicy", id: "shippingPolicy", label: "Shipping Policy" },
  { key: "termsOfService", id: "termsOfService", label: "Terms of Service" },
];

const CATEGORY_SOURCES: Record<string, string[]> = {
  "ordering-payments": ["termsOfService", "refundPolicy", "privacyPolicy"],
  "shipping-delivery": ["shippingPolicy", "refundPolicy"],
  "returns-exchanges": ["refundPolicy"],
  "product-sizing": ["fabricGuide", "termsOfService"],
  "fabric-care": ["fabricGuide"],
  "account-wishlist": ["privacyPolicy", "termsOfService"],
  "gift-cards": ["termsOfService", "refundPolicy"],
  "privacy-security": ["privacyPolicy"],
  "contact-us": ["privacyPolicy", "refundPolicy", "shippingPolicy", "termsOfService"],
};

const TERM_ALIASES: Record<string, string[]> = {
  account: ["guest", "register", "registration", "checkout"],
  card: ["cards", "gift card", "credit card", "debit card"],
  care: ["wash", "washing", "laundry", "cleaning"],
  contact: ["email", "support", "inquiry", "customer service"],
  exchange: ["exchanges", "return", "refund"],
  gift: ["gifts", "gift card", "gift cards"],
  hours: ["business hours", "support", "contact"],
  linen: ["wrinkle", "wrinkles", "natural"],
  order: ["orders", "purchase", "checkout", "dispatch"],
  payment: ["payments", "pay", "paid", "transaction", "upi", "razorpay", "card"],
  privacy: ["personal information", "data", "collect", "protect"],
  refund: ["refunds", "return", "returns", "exchange"],
  response: ["inquiry", "contact", "support"],
  secure: ["security", "protect", "encrypted", "encryption"],
  share: ["disclose", "third party", "sell", "share"],
  shipping: ["ship", "delivery", "deliver", "dispatch", "carrier"],
  shrunk: ["shrink", "shrinkage", "pre-shrunk"],
  size: ["sizing", "fit", "measurement", "measurements"],
  track: ["tracking", "shipment", "dispatch"],
};

const STOP_WORDS = new Set([
  "a", "about", "after", "all", "am", "an", "and", "are", "as", "at", "be", "can",
  "do", "does", "for", "from", "get", "how", "i", "if", "in", "is", "it", "my",
  "of", "on", "or", "our", "the", "their", "this", "to", "we", "what", "when",
  "where", "which", "who", "why", "with", "you", "your",
]);

const getPolicySources = (
  policies: Record<PolicyKey, ShopifyPolicy | null>,
  fabricGuide: ShopifyPage | null,
): FAQContentSource[] => {
  const sources = POLICY_SOURCES.flatMap(({ key, id, label }) => {
    const policy = policies[key];
    return policy?.body.trim() ? [{ id, label, body: policy.body }] : [];
  });

  if (fabricGuide?.body.trim()) {
    sources.push({
      id: "fabricGuide",
      label: fabricGuide.title || "Fabric and Care Guide",
      body: fabricGuide.body,
    });
  }

  return sources;
};

const getContentBlocks = (html: string): string[] => {
  const document = new DOMParser().parseFromString(html, "text/html");
  const blocks = Array.from(
    document.body.querySelectorAll("h1, h2, h3, h4, p, li, td, th, blockquote"),
  )
    .map((element) => element.textContent?.replace(/\s+/g, " ").trim() ?? "")
    .filter(Boolean);

  return blocks.length ? blocks : [document.body.textContent?.replace(/\s+/g, " ").trim() ?? ""].filter(Boolean);
};

const getSearchTerms = (question: string): string[] => {
  const words = question.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const terms = new Set(words.filter((word) => word.length > 2 && !STOP_WORDS.has(word)));

  for (const word of words) {
    TERM_ALIASES[word]?.forEach((alias) => terms.add(alias));
  }

  return Array.from(terms);
};

const getAnswer = (
  categoryId: string,
  question: string,
  sources: FAQContentSource[],
  loading: boolean,
  error: boolean,
): string => {
  if (loading) return "Loading the latest information from our store policies and care guide.";
  if (error) return "Unable to load the latest store information. Please try again later.";

  const sourceIds = CATEGORY_SOURCES[categoryId] ?? [];
  const candidates = sources.filter((source) => sourceIds.includes(source.id));
  const searchTerms = getSearchTerms(question);
  const matches = candidates
    .flatMap((source) =>
      getContentBlocks(source.body).map((text) => ({
        text,
        score: searchTerms.reduce(
          (score, term) => score + (text.toLowerCase().includes(term) ? 1 : 0),
          0,
        ),
      })),
    )
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  if (matches.length) {
    return matches.map((match) => match.text).join(" ");
  }

  const sourceLabels = candidates.map((source) => source.label);
  if (sourceLabels.length) {
    return `Please refer to the current ${sourceLabels.join(" or ")} for the latest information about this question.`;
  }

  return "This information is not available in the currently published Shopify policies or Fabric and Care Guide.";
};

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(faqData[0].id);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [sources, setSources] = useState<FAQContentSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchShopifyPolicies(), getShopifyPage("fabric-guide")])
      .then(([policies, fabricGuide]) => {
        if (!cancelled) setSources(getPolicySources(policies, fabricGuide));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleItem = (categoryId: string, question: string) => {
    const key = `${categoryId}-${question}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isOpen = (categoryId: string, question: string) => {
    return !!openItems[`${categoryId}-${question}`];
  };

  return (
    <main className="bg-ivory min-h-[100svh]">
      <div className="h-14 md:h-16" />

      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-14">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-lg md:text-xl lg:text-2xl text-black tracking-wide font-bold"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[11px] md:text-xs text-black mt-2 max-w-lg mx-auto leading-relaxed"
          >
            Everything you need to know about shopping with Cogenesis.
          </motion.p>
        </div>
      </section>

      {/* 2-Column Layout */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left — Sticky Category Nav */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-[25%] md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-8rem)] md:overflow-y-auto"
          >
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {faqData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`whitespace-nowrap md:whitespace-normal text-left font-sans text-[13px] tracking-[0.05em] py-2 md:py-2.5 px-1 transition-all duration-300 ${
                    activeCategory === category.id
                      ? "text-black underline underline-offset-4 decoration-black decoration-1"
                      : "text-black hover:text-black"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Right — Accordion Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:w-[75%]"
          >
            {faqData
              .filter((category) => category.id === activeCategory)
              .map((category) => (
                <div key={category.id} className="mb-12 md:mb-16">
                  <h2 className="font-display text-2xl md:text-3xl text-black mb-6 tracking-wide font-medium">
                    {category.label}
                  </h2>

                  <div className="space-y-0">
                    {category.items.map((item, idx) => {
                      const key = `${category.id}-${item.question}`;
                      const expanded = isOpen(category.id, item.question);

                      return (
                        <div
                          key={key}
                          className={`border-t border-[#d4cdc0]/60 ${
                            idx === category.items.length - 1
                              ? "border-b border-[#d4cdc0]/60"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(category.id, item.question)}
                            className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group cursor-pointer"
                          >
                            <span className="font-sans text-[14px] md:text-[15px] text-black leading-relaxed pr-4">
                              {item.question}
                            </span>
                            <span className="shrink-0 w-5 h-5 flex items-center justify-center text-black group-hover:text-black transition-colors duration-300">
                              <motion.svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                animate={{ rotate: expanded ? 45 : 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <line
                                  x1="8"
                                  y1="2"
                                  x2="8"
                                  y2="14"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                />
                                <line
                                  x1="2"
                                  y1="8"
                                  x2="14"
                                  y2="8"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                />
                              </motion.svg>
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="overflow-hidden"
                              >
                                <div className="pb-6 md:pb-7 pr-12">
                                  {item.answerHtml ? (
                                    <div
                                      className="font-sans text-[14px] text-black leading-relaxed [&_p]:mb-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-2"
                                      dangerouslySetInnerHTML={{
                                        __html: item.answerHtml,
                                      }}
                                    />
                                  ) : (
                                    <p className="font-sans text-[14px] text-black leading-relaxed">
                                      {getAnswer(
                                        category.id,
                                        item.question,
                                        sources,
                                        loading,
                                        error,
                                      )}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default FAQPage;
