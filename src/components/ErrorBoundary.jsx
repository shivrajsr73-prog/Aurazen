import React from 'react';
import { RefreshCcw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
            <RefreshCcw size={40} className="animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-gray-400 mb-8 max-w-md">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="bg-dark-800 p-4 rounded-lg text-left text-sm text-red-400 max-w-2xl overflow-auto mb-8 border border-red-500/20">
            <code>{this.state.error?.toString()}</code>
          </div>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
