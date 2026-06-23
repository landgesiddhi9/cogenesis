import { mockOrders } from "../data/mockData";
import type { Order } from "../types";

const statusColor = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return "text-[#2a7a4a] bg-[#e8f5ee]";
    case "shipped":
      return "text-[#8a6a20] bg-[#faf1dd]";
    case "processing":
      return "text-[#6a5a8a] bg-[#eee8f5]";
    case "cancelled":
      return "text-[#aa3a3a] bg-[#f5e8e8]";
  }
};

const OrderCard = ({ order }: { order: Order }) => {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="border border-[#e4e1db] bg-white">
      {/* Order header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e4e1db]">
        <div className="flex items-center gap-4">
          <span className="font-sans text-[12px] font-semibold tracking-[0.04em] text-[#111]">
            {order.id}
          </span>
          <span className="font-sans text-[11px] text-[#999]">
            {new Date(order.orderDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full ${statusColor(order.status)}`}>
            {order.status}
          </span>
          <span className="font-sans text-[13px] font-medium text-[#111]">
            ₹{order.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Order items */}
      <div className="divide-y divide-[#f0eee8]">
        {order.items.map((item, i) => (
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

      {/* Item count */}
      <div className="px-5 py-2 bg-[#faf8f5] border-t border-[#e4e1db]">
        <span className="font-sans text-[10px] text-[#aaa] uppercase tracking-[0.1em]">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
};

const PurchasesPage = () => {
  const orders = mockOrders;

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

      {orders.length === 0 ? (
        <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6">
          <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111] mb-4">
            No purchases yet
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
