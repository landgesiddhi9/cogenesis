import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50svh] px-4 py-20 text-center">
          <div className="max-w-md">
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-warm-gray mb-4">
              Something went wrong
            </p>
            <p className="font-sans text-[13px] text-stone/70 leading-relaxed mb-8">
              We encountered an unexpected issue. Please try reloading this section.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase font-sans text-white bg-charcoal hover:bg-charcoal/90 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
