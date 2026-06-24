import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSession, getSession } from "../utils/auth";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";

type AuthState = "email" | "forgot" | "forgot-success" | "create";

// ─── localStorage mock auth ────────────────────────────────────────────────────
const USER_KEY = "cogenesis_users";
interface MockUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const getUsers = (): MockUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "[]");
  } catch {
    return [];
  }
};

const findUser = (email: string): MockUser | undefined =>
  getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

const saveUser = (user: MockUser): void => {
  const users = getUsers().filter(
    (u) => u.email.toLowerCase() !== user.email.toLowerCase(),
  );
  localStorage.setItem(USER_KEY, JSON.stringify([...users, user]));
};

// ─── Shared style constants (match existing design exactly) ──────────────────
const inputCls =
  "w-full h-[36px] bg-transparent border-0 border-b-[1px] border-[#222] text-[15px] text-[#111] outline-none placeholder:text-[#999]";
const labelCls =
  "block text-[10px] uppercase tracking-[0.12em] text-[#666] mb-1";

// ─── Compact variants used only in Create Account ─────────────────────────────
// Tighter label gap + slimmer input keeps all 5 fields on-screen without scroll
const inputClsCmpct =
  "w-full h-[36px] bg-transparent border-0 border-b-[1px] border-[#222] text-[15px] text-[#111] outline-none placeholder:text-[#999]";
const labelClsCmpct =
  "block text-[10px] uppercase tracking-[0.12em] text-[#666] mb-1";
const primaryBtnCls =
  "w-full h-[40px] bg-black text-white uppercase tracking-[0.12em] font-medium text-[12px] transition-opacity duration-200 hover:opacity-90";
const socialBtnCls =
  "w-full h-[40px] flex items-center justify-center gap-3 border border-[#111] bg-white text-[#111] uppercase tracking-[0.08em] text-[12px] transition-colors duration-150 hover:bg-[#F8F8F8]";
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

// ─── Heading ─────────────────────────────────────────────────────────────────
const Heading = ({ title }: { title: string }) => (
  <div className="mb-4">
    <h1 className="text-[24px] font-light leading-[1.15] tracking-[-0.02em] text-[#111]">
      {title}
    </h1>
  </div>
);

// ─── Password hints ──────────────────────────────────────────────────────────
const PasswordHints = ({ password }: { password: string }) => {
  const checks = [
    { label: "Minimum 8 characters", pass: password.length >= 8 },
    { label: "At least 1 capital letter", pass: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", pass: /[a-z]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2">
          <span
            className={`text-[10px] ${c.pass ? "text-[#2a7a4a]" : "text-[#bbb]"}`}
          >
            {c.pass ? "✓" : "○"}
          </span>
          <span
            className={`font-sans text-[10px] ${c.pass ? "text-[#2a7a4a]" : "text-[#bbb]"}`}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
};

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
  inputClassName,
  labelClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  label?: string;
  error?: string;
  autoFocus?: boolean;
  inputClassName?: string;
  labelClassName?: string;
}) => (
  <div>
    <label className={labelClassName ?? labelCls}>{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`${inputClassName ?? inputCls} pr-10`}
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Drawer entry animation + session guard (must be after all useState)
  useEffect(() => {
    if (getSession()) {
      navigate("/account", { replace: true });
      return;
    }
    const id = window.requestAnimationFrame(() => setDrawerVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [navigate]);

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
  const handleSignIn = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email address is required.";
    if (!password.trim()) e.password = "Password is required.";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const user = findUser(email);
    if (!user) {
      transitionTo("create");
      return;
    }
    if (user.password !== password) {
      setErrors({ password: "Incorrect password. Please try again." });
      return;
    }
    setSession({
      name: user.firstName || email.split("@")[0],
      email: email.trim().toLowerCase(),
    });
    navigate("/account");
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
    // Persist new account and open the dashboard
    saveUser({
      email: email.trim().toLowerCase(),
      password,
      firstName,
      lastName,
    });
    setSession({ name: firstName, email: email.trim().toLowerCase() });
    navigate("/account");
  };

  // ── State renderers ──────────────────────────────────────────────────────────

  // STATE 1 ─ Email Entry
  const renderEmail = () => (
    <>
      <h1 className="text-[22px] font-light leading-[1.15] tracking-[-0.02em] text-[#111] text-center mb-3">
        Sign in
      </h1>

      <div className="mb-2">
        <label className={labelCls}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors({});
          }}
          className={inputCls}
          placeholder=""
          aria-label="Email Address"
          autoFocus
        />
        {errors.email && <p className={errCls}>{errors.email}</p>}
      </div>

      <div className="mb-2">
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
        />
        {password.length > 0 && <PasswordHints password={password} />}
      </div>

      <div className="h-6"></div>

      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => transitionTo("forgot")}
          className="text-[11px] text-[#666] hover:text-[#111] transition-colors duration-150"
        >
          Forgot Password?
        </button>
      </div>

      <button onClick={handleSignIn} className={`${primaryBtnCls} mb-2`}>
        Sign In
      </button>

      <div className="mb-2">
        <OrDivider />
      </div>

      <div className="mb-2">
        <SocialButtons />
      </div>

      <p className="text-[11px] text-[#666] leading-[1.4] mb-2">
        By logging in with my social login, I agree to link my account as per
        the{" "}
        <Link to="#" className="underline">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="text-center mb-2">
        <p className="mb-1 uppercase tracking-[0.2em] text-[#666] text-[10px]">
          New user?
        </p>
        <button
          type="button"
          onClick={() => transitionTo("create")}
          className="text-[12px] text-[#666] hover:text-[#111] transition-colors duration-150"
        >
          Create Account →
        </button>
      </div>
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
        onClick={() => transitionTo("email")}
        className={backBtnCls}
      >
        ← Back to Sign In
      </button>
    </>
  );

  // STATE 3b ─ Forgot Password Success
  const renderForgotSuccess = () => (
    <>
      <h1 className="text-[24px] font-light leading-[1.15] tracking-[-0.02em] text-[#111] mb-4">
        Check your inbox
      </h1>

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
        onClick={() => transitionTo("email")}
        className={backBtnCls}
      >
        ← Back to Sign In
      </button>
    </>
  );

  // STATE 4 ─ Create Account
  const renderCreate = () => (
    <>
      <h1 className="text-[22px] font-light leading-[1.15] tracking-[-0.02em] text-[#111] text-center mb-3">
        Create Account
      </h1>

      <div className="mb-2">
        <label className={labelClsCmpct}>First name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setErrors((prev) => ({ ...prev, firstName: "" }));
          }}
          className={inputClsCmpct}
          aria-label="First Name"
          autoFocus
        />
        {errors.firstName && <p className={errCls}>{errors.firstName}</p>}
      </div>

      <div className="mb-2">
        <label className={labelClsCmpct}>Last name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setErrors((prev) => ({ ...prev, lastName: "" }));
          }}
          className={inputClsCmpct}
          aria-label="Last Name"
        />
        {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
      </div>

      <div className="mb-2">
        <label className={labelClsCmpct}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClsCmpct}
          aria-label="Email Address"
        />
      </div>

      <div className="mb-2">
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          show={showPassword}
          onToggle={() => setShowPassword((p) => !p)}
          error={errors.password}
          inputClassName={inputClsCmpct}
          labelClassName={labelClsCmpct}
        />
        {password.length > 0 && <PasswordHints password={password} />}
      </div>

      <div className="mb-2">
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
          inputClassName={inputClsCmpct}
          labelClassName={labelClsCmpct}
        />
      </div>

      <button
        type="button"
        onClick={handleCreateAccount}
        className="w-full h-[40px] border border-[#111] bg-white text-[#111] text-[11px] font-medium uppercase tracking-[0.12em] hover:bg-[#111] hover:text-white transition-colors duration-200 mb-2"
      >
        Create Account
      </button>

      <div className="text-center">
        <p className="mb-1 uppercase tracking-[0.2em] text-[#666] text-[10px]">
          Already have an account?
        </p>
        <button
          type="button"
          onClick={() => transitionTo("email")}
          className="text-[12px] text-[#666] hover:text-[#111] transition-colors duration-150"
        >
          Sign in →
        </button>
      </div>
    </>
  );

  // ── Route to correct renderer ─────────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (authState) {
      case "email":
        return renderEmail();

      case "forgot":
        return renderForgot();
      case "forgot-success":
        return renderForgotSuccess();
      case "create":
        return renderCreate();
    }
  };

  // ── Root render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed right-0 top-14 md:top-16 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] w-[clamp(420px,35vw,520px)] border-l border-[#EAEAEA] bg-ivory z-[120] font-sans transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        drawerVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div className="relative h-full overflow-hidden">
        <div className="min-h-full flex flex-col justify-center px-8">
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
