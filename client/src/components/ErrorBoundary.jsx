import { Component } from "react";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
          <div className="glass-card p-12 rounded-2xl text-center max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
