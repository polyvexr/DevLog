import { Component } from "react";
import { FiAlertTriangle } from "react-icons/fi";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0c0c] text-slate-200 flex items-center justify-center p-6 select-none">
          <div className="bg-[#121214] border border-[#222225] p-12 text-center rounded-xl space-y-6 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 text-lg">
              <FiAlertTriangle />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-xl font-[Cormorant_Garamond] font-semibold italic text-white leading-none">
                Something went wrong
              </h1>
              <p className="text-slate-500 text-xs font-mono max-w-xs mx-auto leading-relaxed">
                An unexpected error occurred in your current session. Let's restart the app context.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-[#e23e2d] hover:bg-[#cf2e2e] text-white font-mono text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                ← Return to Main Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
