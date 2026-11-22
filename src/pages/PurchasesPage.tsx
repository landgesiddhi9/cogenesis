import { useEffect, useState } from "react";
import { fetchCustomerOrders, type CustomerOrder } from "../services/customer-orders.service";

const statusColor = (status: string) => {
  const normalized = status.toUpperCase();
  if (normalized === "FULFILLED" || normalized === "SUCCESS") {
    return "text-[#2a7a4a] bg-[#e8f5ee]";
  }
  if (normalized === "PARTIALLY_FULFILLED" || normalized === "PENDING") {
    return "text-[#8a6a20] bg-[#faf1dd]";
  }
  if (normalized === "UNFULFILLED" || normalized === "OPEN") {
    return "text-[#6a5a8a] bg-[#eee8f5]";
  }
  if (normalized === "CANCELLED" || normalized === "RESTOCKED") {
    return "text-[#aa3a3a] bg-[#f5e8e8]";
  }
  return "text-[#6a5a8a] bg-[#eee8f5]";
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatMoney = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));

const OrderCard = ({ order }: { order: CustomerOrder }) => {
  const status =
    order.fulfillments.nodes[0]?.status || order.fulfillmentStatus;
  const statusLabel = [
    order.financialStatus && formatStatus(order.financialStatus),
    status && formatStatus(status),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="border border-[#e4e1db] bg-ivory">
      {/* Order header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e4e1db]">
        <div className="flex items-center gap-4">
          <span className="font-sans text-[12px] font-semibold tracking-[0.04em] text-[#111]">
            {order.name}
          </span>
          <span className="font-sans text-[11px] text-[#999]">
            {new Date(order.processedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full ${statusColor(status)}`}>
            {statusLabel}
          </span>
          <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums">
            {formatMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div className="divide-y divide-[#f0eee8]">
        {order.lineItems.nodes.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-5 py-3">
            <div className="w-14 h-[70px] flex-shrink-0 bg-[#f5f0eb] overflow-hidden">
              {item.image?.url && (
                <img
                  src={item.image.url}
                  alt={item.name || item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[13px] text-[#111] truncate leading-snug">
                {item.name || item.title}
              </p>
              <p className="font-sans text-[11px] text-[#999] mt-0.5">
                Qty: {item.quantity}
              </p>
            </div>
            {item.totalPrice && (
              <span className="font-sans text-[12px] text-[#888] tracking-[0.02em] tabular-nums flex-shrink-0">
                {formatMoney(item.totalPrice.amount, item.totalPrice.currencyCode)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Item count */}
      <div className="px-5 py-2 bg-ivory border-t border-[#e4e1db]">
        <span className="font-sans text-[10px] text-[#aaa] uppercase tracking-[0.1em]">
          {order.lineItems.nodes.length} line {order.lineItems.nodes.length === 1 ? "item" : "items"} shown
        </span>
      </div>
    </div>
  );
};

const PurchasesPage = () => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchCustomerOrders(controller.signal)
      .then(setOrders)
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load your orders.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retry]);

  return (
    <main className="bg-ivory min-h-[100svh] pb-16">
      {/* Navbar offset */}
      <div className="h-14 md:h-16" />

      {/* Page title */}
      <header className="px-6 md:px-10 pt-8 md:pt-10 pb-6">
        <h1 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
          My Purchases
        </h1>
      </header>

      {loading ? (
        <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6">
          <p className="font-sans text-[12px] text-[#999]">Loading your orders...</p>
        </section>
      ) : error ? (
        <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6">
          <p className="font-sans text-[12px] text-[#999] text-center">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              setRetry((value) => value + 1);
            }}
            className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#111] underline mt-4"
          >
            Try again
          </button>
        </section>
      ) : orders.length === 0 ? (
        <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6">
          <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111] mb-4">
            No orders yet
          </h2>
          <p className="font-sans text-[12px] text-[#999]">
            Your order history will appear here.
          </p>
        </section>
      ) : (
        <section className="px-6 md:px-10 max-w-3xl mx-auto space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </section>
      )}
    </main>
  );
};

export default PurchasesPage;
