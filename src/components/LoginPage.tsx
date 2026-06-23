import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";

type AuthState =
  | "email"
  | "signin"
  | "forgot"
  | "forgot-success"
  | "create"
  | "menu";

const EXISTING_EMAILS = [
  "test@example.com",
  "admin@example.com",
  "demo@example.com",
];

// ─── Shared style constants (match existing design exactly) ──────────────────
const inputCls =
  "w-full h-[48px] bg-transparent border-0 border-b-[1px] border-[#222] text-[16px] text-[#111] outline-none placeholder:text-[#999]";
const labelCls =
  "block text-[11px] uppercase tracking-[0.12em] text-[#666] mb-3";
const primaryBtnCls =
  "w-full h-[52px] bg-black text-white uppercase tracking-[0.12em] font-medium text-[14px] transition-opacity duration-200 hover:opacity-90";
const socialBtnCls =
  "w-full h-[48px] flex items-center justify-center gap-3 border border-[#111] bg-white text-[#111] uppercase tracking-[0.08em] text-[14px] transition-colors duration-150 hover:bg-[#F8F8F8]";
const backBtnCls =
  "text-[12px] uppercase tracking-[0.2em] text-[#666] cursor-pointer hover:text-[#111] transition-colors duration-150";
const errCls = "text-[11px] text-red-500 mt-1.5";
const eyeBtnCls =
  "absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#111] transition-colors duration-150";

// ─── OR divider ──────────────────────────────────────────────────────────────
const OrDivider = () => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-[#222]" />
    <span className="text-[12px] uppercase tracking-[0.35em] text-[#666]">
      OR
    </span>
    <div className="flex-1 h-px bg-[#222]" />
  </div>
);

// ─── Social buttons ──────────────────────────────────────────────────────────
const SocialButtons = () => (
  <div className="space-y-3">
    <button className={socialBtnCls}>
      <FcGoogle size={20} />
      <span className="font-medium">Continue with Google</span>
    </button>
    <button className={socialBtnCls}>
      <FaApple size={20} />
      <span className="font-medium">Continue with Apple</span>
    </button>
  </div>
);

// ─── Account label + heading ─────────────────────────────────────────────────
const Heading = ({ title }: { title: string }) => (
  <div className="mb-8">
    <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-[#666] mb-3">
      Account
    </p>
    <h1 className="text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-[#111]">
      {title}
    </h1>
  </div>
);

// ─── Password input with eye toggle ─────────────────────────────────────────
const PasswordInput = ({
  value,
  onChange,
  show,
  onToggle,
  onKeyDown,
  label = "Password",
  error,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  label?: string;
  error?: string;
  autoFocus?: boolean;
}) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`${inputCls} pr-10`}
        aria-label={label}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        onClick={onToggle}
        className={eyeBtnCls}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </button>
    </div>
    {error && <p className={errCls}>{error}</p>}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Drawer slide-in
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Auth state machine
  const [authState, setAuthState] = useState<AuthState>("email");
  const [contentVisible, setContentVisible] = useState(true);

  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loggedInName, setLoggedInName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Drawer entry animation
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setDrawerVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Smooth fade + slight-slide between states
  const transitionTo = (next: AuthState) => {
    setContentVisible(false);
    setTimeout(() => {
      setAuthState(next);
      setErrors({});
      setShowPassword(false);
      setShowConfirmPw(false);
      setContentVisible(true);
    }, 220);
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleEmailContinue = () => {
    if (!email.trim()) {
      setErrors({ email: "Email address is required." });
      return;
    }
    if (EXISTING_EMAILS.includes(email.toLowerCase().trim())) {
      transitionTo("signin");
    } else {
      transitionTo("create");
    }
  };

  const handleSignIn = () => {
    if (!password.trim()) {
      setErrors({ password: "Password is required." });
      return;
    }
    setLoggedInName(email.split("@")[0]);
    transitionTo("menu");
  };

  const handleCreateAccount = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!password.trim()) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!confirmPassword.trim())
      e.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoggedInName(firstName);
    transitionTo("menu");
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setNewsletter(false);
    setLoggedInName("");
    transitionTo("email");
  };

  // ── State renderers ──────────────────────────────────────────────────────────

  // STATE 1 ─ Email Entry
  const renderEmail = () => (
    <>
      <Heading title="Sign in" />

      <div className="mb-7">
        <label className={labelCls}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors({});
          }}
          onKeyDown={(e) => e.key === "Enter" && handleEmailContinue()}
          className={inputCls}
          placeholder=""
          aria-label="Email Address"
          autoFocus
        />
        {errors.email && <p className={errCls}>{errors.email}</p>}
      </div>

      <button onClick={handleEmailContinue} className={`${primaryBtnCls} mb-7`}>
        Continue
      </button>

      <div className="mb-6">
        <OrDivider />
      </div>

      <div className="mb-6">
        <SocialButtons />
      </div>

      <p className="text-[13px] text-[#666] leading-[1.6] mb-5">
        By logging in with my social login, I agree to link my account as per
        the{" "}
        <Link to="#" className="underline">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="text-[14px] tracking-[0.03em] text-[#111]">
        <p className="mb-2 uppercase tracking-[0.2em] text-[#666] text-[12px]">
          New here?
        </p>
        <button
          type="button"
          onClick={() => transitionTo("create")}
          className="underline hover:text-black text-[14px]"
        >
          Create Account →
        </button>
      </div>
    </>
  );

  // STATE 2 ─ Sign In
  const renderSignIn = () => (
    <>
      <Heading title="Welcome Back" />

      <div className="mb-7">
        <label className={labelCls}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          aria-label="Email Address"
        />
      </div>

      <div className="mb-3">
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setErrors({});
          }}
          show={showPassword}
          onToggle={() => setShowPassword((p) => !p)}
          onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          error={errors.password}
          autoFocus
        />
      </div>

      <div className="mb-7 flex justify-end">
        <button
          type="button"
          onClick={() => transitionTo("forgot")}
          className="text-[12px] text-[#666] underline hover:text-[#111] transition-colors duration-150"
        >
          Forgot Password?
        </button>
      </div>

      <button onClick={handleSignIn} className={`${primaryBtnCls} mb-7`}>
        Sign In
      </button>

      <div className="mb-6">
        <OrDivider />
      </div>

      <div className="mb-7">
        <SocialButtons />
      </div>

      <button
        type="button"
        onClick={() => transitionTo("email")}
        className={backBtnCls}
      >
        ← Back
      </button>
    </>
  );

  // STATE 3 ─ Forgot Password
  const renderForgot = () => (
    <>
      <Heading title="Reset Password" />

      <p className="text-[14px] text-[#666] leading-[1.6] mb-8">
        Enter your email address and we will send you a reset link.
      </p>

      <div className="mb-7">
        <label className={labelCls}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && transitionTo("forgot-success")}
          className={inputCls}
          aria-label="Email Address"
          autoFocus
        />
      </div>

      <button
        onClick={() => transitionTo("forgot-success")}
        className={`${primaryBtnCls} mb-7`}
      >
        Send Reset Link
      </button>

      <button
        type="button"
        onClick={() => transitionTo("signin")}
        className={backBtnCls}
      >
        ← Back to Sign In
      </button>
    </>
  );

  // STATE 3b ─ Forgot Password Success
  const renderForgotSuccess = () => (
    <>
      <Heading title="Check your inbox" />

      <div className="mb-10">
        <p className="text-[15px] text-[#111] leading-[1.6] mb-2">
          Reset link sent.
        </p>
        <p className="text-[14px] text-[#666] leading-[1.6]">
          We've sent a password reset link to{" "}
          <span className="text-[#111]">{email}</span>. Please check your inbox.
        </p>
      </div>

      <button
        type="button"
        onClick={() => transitionTo("signin")}
        className={backBtnCls}
      >
        ← Back to Sign In
      </button>
    </>
  );

  // STATE 4 ─ Create Account
  const renderCreate = () => (
    <>
      <div className="mb-6">
        <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-[#666] mb-3">
          Account
        </p>
        <h1 className="text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-[#111]">
          Create Account
        </h1>
      </div>

      <div className="mb-5">
        <label className={labelCls}>First name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setErrors((prev) => ({ ...prev, firstName: "" }));
          }}
          className={inputCls}
          aria-label="First Name"
          autoFocus
        />
        {errors.firstName && <p className={errCls}>{errors.firstName}</p>}
      </div>

      <div className="mb-5">
        <label className={labelCls}>Last name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setErrors((prev) => ({ ...prev, lastName: "" }));
          }}
          className={inputCls}
          aria-label="Last Name"
        />
        {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
      </div>

      <div className="mb-5">
        <label className={labelCls}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          aria-label="Email Address"
        />
      </div>

      <div className="mb-5">
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          show={showPassword}
          onToggle={() => setShowPassword((p) => !p)}
          error={errors.password}
        />
      </div>

      <div className="mb-5">
        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v);
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          show={showConfirmPw}
          onToggle={() => setShowConfirmPw((p) => !p)}
          error={errors.confirmPassword}
        />
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 accent-black"
        />
        <span className="text-[13px] text-[#666] leading-[1.5]">
          Receive updates and offers
        </span>
      </label>

      <button onClick={handleCreateAccount} className={`${primaryBtnCls} mb-6`}>
        Create Account
      </button>

      <button
        type="button"
        onClick={() => transitionTo("email")}
        className={backBtnCls}
      >
        ← Back
      </button>
    </>
  );

  // STATE 5 ─ Account Menu
  const renderMenu = () => (
    <>
      <div className="mb-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-[#666] mb-3">
          Account
        </p>
        <h1 className="text-[32px] font-light leading-[1.15] tracking-[-0.02em] text-[#111]">
          Hello, {loggedInName}
        </h1>
      </div>

      <nav className="mb-10">
        {[
          { label: "My Orders", to: "#" },
          { label: "Wishlist", to: "#" },
          { label: "Addresses", to: "#" },
          { label: "Profile Settings", to: "#" },
        ].map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center justify-between py-[18px] border-b border-[#EAEAEA] text-[15px] tracking-[0.02em] text-[#111] hover:text-[#666] transition-colors duration-150 group"
          >
            <span>{label}</span>
            <span className="text-[#bbb] group-hover:translate-x-1 transition-transform duration-150 text-[16px]">
              →
            </span>
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="text-[12px] uppercase tracking-[0.25em] text-[#666] hover:text-[#111] transition-colors duration-150"
      >
        Logout
      </button>
    </>
  );

  // ── Route to correct renderer ────────────────────────────────────────────────
  const renderContent = () => {
    switch (authState) {
      case "email":
        return renderEmail();
      case "signin":
        return renderSignIn();
      case "forgot":
        return renderForgot();
      case "forgot-success":
        return renderForgotSuccess();
      case "create":
        return renderCreate();
      case "menu":
        return renderMenu();
    }
  };

  // ── Root render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed right-0 top-14 md:top-16 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] w-[clamp(420px,35vw,520px)] border-l border-[#EAEAEA] bg-white z-[120] font-sans transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        drawerVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      {/* overflow-y-auto only kicks in for Create Account on short viewports */}
      <div className="relative h-full overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center px-[60px]">
          {/* Close button — unchanged */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-6 top-6 text-[28px] leading-none text-[#111] transition-opacity duration-200 hover:opacity-70 z-10"
            aria-label="Close login panel"
          >
            ×
          </button>

          {/* Content wrapper — fade + slight-slide on state change */}
          <div
            className={`transition-all duration-[220ms] ease-in-out ${
              contentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[8px]"
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
