import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { getSession, clearSession } from "../utils/auth";

// ── Single menu row ───────────────────────────────────────────────────────────
const MenuRow = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between border-b border-[#e8e8e8] bg-transparent text-left"
      style={{
        padding: hovered ? "14px 0 14px 10px" : "14px 0",
        opacity: hovered ? 0.75 : 1,
        transition: "padding 0.2s ease, opacity 0.2s ease",
      }}
    >
      <span
        style={{
          fontFamily: "inherit",
          fontSize: "18px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: "#111",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "26px",
          fontWeight: 300,
          color: "#999",
          lineHeight: 1,
          flexShrink: 0,
          marginLeft: "16px",
        }}
      >
        →
      </span>
    </button>
  );
};

// ── Account page ──────────────────────────────────────────────────────────────
const AccountPage = () => {
  const navigate = useNavigate();
  const session = getSession();

  // Guard: not logged in → redirect to login drawer
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Capitalise first letter of name for display
  const displayName =
    session.name.charAt(0).toUpperCase() + session.name.slice(1).toLowerCase();

  const handleSignOut = () => {
    clearSession();
    navigate("/");
  };

  const menuItems: { label: string; action: () => void }[] = [
    {
      label: "My Purchases",
      action: () => navigate("/purchases"),
    },
    {
      label: "Returns",
      action: () => navigate("/returns"),
    },
    {
      label: "Refunds",
      action: () => navigate("/launching-soon"),
    },
    {
      label: "My Details",
      action: () => navigate("/launching-soon"),
    },
    {
      label: "My Addresses",
      action: () => navigate("/launching-soon"),
    },
    {
      label: "Help",
      action: () => navigate("/launching-soon"),
    },
    {
      label: "Wishlist",
      action: () => navigate("/wishlist"),
    },
  ];

  return (
    <main
      className="bg-ivory min-h-[100svh]"
      style={{ fontFamily: "inherit" }}
    >
      {/* Navbar offset */}
      <div className="h-14 md:h-16" />

      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <div
        className="text-center"
        style={{ marginTop: "24px", marginBottom: "16px" }}
      >
        <h1
          style={{
            fontFamily: "inherit",
            fontSize: "clamp(22px, 2.5vw, 32px)",
            fontWeight: 300,
            letterSpacing: "-1px",
            color: "#111",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Hello, {displayName}
        </h1>
      </div>

      {/* ── Menu ──────────────────────────────────────────────────────────── */}
      <div
        className="mx-auto w-[90%]"
        style={{ maxWidth: "700px" }}
      >
        {/* Top border */}
        <div className="border-t border-[#e8e8e8]" />

        {menuItems.map((item) => (
          <MenuRow
            key={item.label}
            label={item.label}
            onClick={item.action}
          />
        ))}

        {/* ── Sign out ──────────────────────────────────────────────────── */}
        <SignOutButton onClick={handleSignOut} />
      </div>
    </main>
  );
};

// ── Sign-out button ───────────────────────────────────────────────────────────
const SignOutButton = ({ onClick }: { onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        marginTop: "24px",
        fontFamily: "inherit",
        fontSize: "13px",
        fontWeight: 400,
        letterSpacing: "3px",
        textTransform: "uppercase" as const,
        color: hovered ? "#111" : "#999",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "color 0.2s ease",
        padding: 0,
      }}
    >
      Sign Out
    </button>
  );
};

export default AccountPage;
