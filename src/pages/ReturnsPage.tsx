import { mockReturns } from "../data/mockData";
import type { ReturnRequest } from "../types";

const statusColor = (status: ReturnRequest["status"]) => {
  switch (status) {
    case "pending":
      return "text-[#8a6a20] bg-[#faf1dd]";
    case "approved":
      return "text-[#2a7a4a] bg-[#e8f5ee]";
    case "picked_up":
      return "text-[#6a5a8a] bg-[#eee8f5]";
    case "refunded":
      return "text-[#2a6a8a] bg-[#e0edf5]";
    case "rejected":
      return "text-[#aa3a3a] bg-[#f5e8e8]";
  }
};

const ReturnCard = ({ ret }: { ret: ReturnRequest }) => {
  const itemCount = ret.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="border border-[#e4e1db] bg-white">
      {/* Return header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e4e1db]">
        <div className="flex items-center gap-4">
          <span className="font-sans text-[12px] font-semibold tracking-[0.04em] text-[#111]">
            {ret.id}
          </span>
          <span className="font-sans text-[11px] text-[#999]">
            {new Date(ret.orderDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full ${statusColor(ret.status)}`}>
          {ret.status === "picked_up" ? "Picked Up" : ret.status}
        </span>
      </div>

      {/* Return items */}
      <div className="divide-y divide-[#f0eee8]">
        {ret.items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3">
            <div className="w-14 h-[70px] flex-shrink-0 bg-[#f5f0eb] overflow-hidden">
              <img
                src={item.image}
                alt={item.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-[13px] text-[#111] truncate leading-snug">
                {item.title}
              </p>
              <p className="font-sans text-[11px] text-[#999] mt-0.5">
                Size: {item.size} / Qty: {item.quantity}
              </p>
            </div>
            <span className="font-sans text-[13px] text-[#111] flex-shrink-0">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Reason + status info */}
      <div className="px-5 py-2.5 bg-[#faf8f5] border-t border-[#e4e1db] space-y-1">
        <p className="font-sans text-[11px] text-[#888]">
          Reason: <span className="text-[#555]">{ret.reason}</span>
        </p>
        {ret.pickupDate && (
          <p className="font-sans text-[11px] text-[#888]">
            Pickup: <span className="text-[#555]">
              {new Date(ret.pickupDate).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>
          </p>
        )}
        {ret.refundDate && (
          <p className="font-sans text-[11px] text-[#888]">
            Refunded: <span className="text-[#555]">
              {new Date(ret.refundDate).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

const ReturnsPage = () => {
  const returns = mockReturns;

  return (
    <main className="bg-ivory min-h-[100svh] pb-16">
      {/* Navbar offset */}
      <div className="h-14 md:h-16" />

      {/* Page title */}
      <header className="px-6 md:px-10 pt-8 md:pt-10 pb-6">
        <h1 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
          Returns
        </h1>
      </header>

      {returns.length === 0 ? (
        <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6">
          <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111] mb-4">
            No returns yet
          </h2>
          <p className="font-sans text-[12px] text-[#999]">
            Any items you return will appear here.
          </p>
        </section>
      ) : (
        <section className="px-6 md:px-10 max-w-3xl mx-auto space-y-4">
          {returns.map((ret) => (
            <ReturnCard key={ret.id} ret={ret} />
          ))}
        </section>
      )}
    </main>
  );
};

export default ReturnsPage;
