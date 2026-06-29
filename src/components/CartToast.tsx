import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "../hooks/useCart";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export function CartToast() {
  const { cart } = useCart();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const prevQtyRef = useRef<number | null>(null);
  const initialized = useRef(false);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  useEffect(() => {
    if (!cart) return;

    const currentQty = cart.totalQuantity;

    if (!initialized.current) {
      initialized.current = true;
      prevQtyRef.current = currentQty;
      return;
    }

    if (prevQtyRef.current !== null && currentQty > prevQtyRef.current) {
      addToast("Product added to cart", "success");
    }

    prevQtyRef.current = currentQty;
  }, [cart?.totalQuantity, addToast]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        addToast(detail.message, detail.type || "error");
      }
    };
    window.addEventListener("cart-toast", handler);
    return () => window.removeEventListener("cart-toast", handler);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(1rem); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white rounded-lg shadow-lg px-4 py-3 font-sans text-[13px] text-[#111] pointer-events-auto flex items-center gap-2.5"
            style={{
              animation: "toastIn 0.3s ease-out",
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {toast.type === "success" ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4b403a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b91c1c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
